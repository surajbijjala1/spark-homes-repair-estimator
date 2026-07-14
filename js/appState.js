// Spark Homes — App State Manager
// Handles localStorage persistence and state operations

window.AppStateManager = {
  STORAGE_KEY: 'spark_homes_projects',
  GLOBAL_PRICES_KEY: 'spark_homes_global_prices',

  loadProjects: function() {
    try {
      var raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      var projects = JSON.parse(raw);
      // Validate structure — discard stale data from old formats
      if (!Array.isArray(projects)) return [];
      return projects.filter(function(p) { return p && Array.isArray(p.rooms) && p.rooms.length > 0 && p.rooms[0].groups; });
    } catch(e) { return []; }
  },

  saveProjects: function(projects) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  },

  loadGlobalPrices: function() {
    try {
      var raw = localStorage.getItem(this.GLOBAL_PRICES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch(e) { return {}; }
  },

  saveGlobalPrices: function(prices) {
    localStorage.setItem(this.GLOBAL_PRICES_KEY, JSON.stringify(prices));
  },

  // Apply global price overrides to a project (merges, project overrides win)
  applyGlobalPrices: function(project, globalPrices) {
    if (!globalPrices || Object.keys(globalPrices).length === 0) return project;
    var updated = JSON.parse(JSON.stringify(project));
    updated.rooms.forEach(function(room) {
      Object.keys(room.groups).forEach(function(groupName) {
        var group = room.groups[groupName];
        group.items.forEach(function(item) {
          var key = groupName + ':' + item.name;
          if (item.overrideCost === null && globalPrices[key] !== undefined) {
            item.unitCost = globalPrices[key];
          }
        });
      });
    });
    return updated;
  },

  // Calculate project totals
  getProjectTotal: function(project) {
    var total = 0;
    if (!project || !project.rooms) return 0;
    project.rooms.forEach(function(room) {
      Object.keys(room.groups).forEach(function(groupName) {
        var group = room.groups[groupName];
        if (!group.noActionNeeded) {
          group.items.forEach(function(item) {
            var cost = item.overrideCost !== null ? item.overrideCost : item.unitCost;
            total += cost * (item.qty || 0);
          });
        }
      });
    });
    return total;
  },

  getRoomTotal: function(room) {
    var total = 0;
    if (!room || !room.groups) return 0;
    Object.keys(room.groups).forEach(function(groupName) {
      var group = room.groups[groupName];
      if (!group.noActionNeeded) {
        group.items.forEach(function(item) {
          var cost = item.overrideCost !== null ? item.overrideCost : item.unitCost;
          total += cost * (item.qty || 0);
        });
      }
    });
    return total;
  },

  getGroupTotal: function(group) {
    if (group.noActionNeeded) return 0;
    var total = 0;
    group.items.forEach(function(item) {
      var cost = item.overrideCost !== null ? item.overrideCost : item.unitCost;
      total += cost * (item.qty || 0);
    });
    return total;
  },

  // Progress tracking
  getProgress: function(project) {
    var totalGroups = 0;
    var completedGroups = 0;
    if (!project || !project.rooms) return { completed: 0, total: 0, pct: 0 };
    project.rooms.forEach(function(room) {
      Object.keys(room.groups).forEach(function(groupName) {
        totalGroups++;
        var group = room.groups[groupName];
        if (group.noActionNeeded || group.items.some(function(i) { return i.qty > 0; })) {
          completedGroups++;
        }
      });
    });
    return { completed: completedGroups, total: totalGroups, pct: totalGroups > 0 ? Math.round((completedGroups / totalGroups) * 100) : 0 };
  },

  // Count instances of a room type
  countRoomType: function(project, type) {
    return project.rooms.filter(function(r) { return r.type === type; }).length;
  },

  addRoom: function(project, type) {
    var count = this.countRoomType(project, type) + 1;
    var room = window.createRoomInstance(type, count);
    if (!room) return project;
    var updated = JSON.parse(JSON.stringify(project));
    updated.rooms.push(room);
    return updated;
  },

  removeRoom: function(project, roomId) {
    var updated = JSON.parse(JSON.stringify(project));
    updated.rooms = updated.rooms.filter(function(r) { return r.id !== roomId; });
    return updated;
  },

  addLineItem: function(project, roomId, groupName, item) {
    var updated = JSON.parse(JSON.stringify(project));
    var room = updated.rooms.find(function(r) { return r.id === roomId; });
    if (room && room.groups[groupName]) {
      room.groups[groupName].items.push({
        id: 'li_' + Math.random().toString(36).slice(2, 10),
        name: item.name || 'Custom item',
        unit: item.unit || 'each',
        unitCost: item.unitCost || 0,
        qty: item.qty || 0,
        overrideCost: null,
        isCustom: true,
      });
    }
    return updated;
  },

  removeLineItem: function(project, roomId, groupName, itemId) {
    var updated = JSON.parse(JSON.stringify(project));
    var room = updated.rooms.find(function(r) { return r.id === roomId; });
    if (room && room.groups[groupName]) {
      room.groups[groupName].items = room.groups[groupName].items.filter(function(i) { return i.id !== itemId; });
    }
    return updated;
  },
};
