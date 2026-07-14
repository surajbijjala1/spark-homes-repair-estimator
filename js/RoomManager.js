// Spark Homes — Room Manager Component

function RoomManager({ projectData, setProjectData, onSelectRoom, activeRoomId }) {
  var _s = React.useState(false), showAdd = _s[0], setShowAdd = _s[1];
  var pl = window.DEFAULT_PRICE_LIST;
  var multiTypes = Object.keys(pl.roomTypes).filter(function(t) { return pl.roomTypes[t].allowMultiple; });

  function addRoom(type) {
    var count = window.AppStateManager.countRoomType(projectData, type);
    var p = window.AppStateManager.addRoom(projectData, type);
    setProjectData(p);
    setShowAdd(false);
    // Auto-select the new room
    var newest = p.rooms[p.rooms.length - 1];
    if (newest) onSelectRoom(newest.id);
  }

  function removeRoom(roomId) {
    if (!confirm('Remove this room and all its line items?')) return;
    var p = window.AppStateManager.removeRoom(projectData, roomId);
    setProjectData(p);
    if (activeRoomId === roomId) onSelectRoom(null);
  }

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
    projectData.rooms.map(function(room) {
      var total = window.AppStateManager.getRoomTotal(room);
      var progress = 0;
      var groupNames = Object.keys(room.groups);
      var done = groupNames.filter(function(g) {
        var grp = room.groups[g];
        return grp.noActionNeeded || grp.items.some(function(i) { return i.qty > 0; });
      }).length;
      progress = groupNames.length > 0 ? Math.round((done / groupNames.length) * 100) : 0;
      var isActive = activeRoomId === room.id;
      var canRemove = pl.roomTypes[room.type] && pl.roomTypes[room.type].allowMultiple;

      return React.createElement('button', {
        key: room.id,
        onClick: function() { onSelectRoom(room.id); },
        style: {
          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
          padding: '12px 14px', border: isActive ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', cursor: 'pointer',
          textAlign: 'left', fontFamily: 'var(--font-body)',
        }
      },
        // Progress ring
        React.createElement('div', { style: { position: 'relative', width: 36, height: 36, flexShrink: 0 } },
          React.createElement('svg', { width: 36, height: 36, viewBox: '0 0 36 36' },
            React.createElement('circle', { cx: 18, cy: 18, r: 15, fill: 'none', stroke: 'var(--border-subtle)', strokeWidth: 3 }),
            React.createElement('circle', {
              cx: 18, cy: 18, r: 15, fill: 'none', stroke: 'var(--accent-secondary)', strokeWidth: 3,
              strokeDasharray: (progress * 94.2 / 100) + ' 94.2',
              transform: 'rotate(-90 18 18)', strokeLinecap: 'round',
            })
          ),
          React.createElement('span', {
            style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-secondary)' }
          }, progress + '%')
        ),
        // Label + count
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' } }, room.label),
          React.createElement('div', { style: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 } }, done + '/' + groupNames.length + ' groups')
        ),
        // Total
        total > 0 ? React.createElement('span', {
          style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--accent-primary)' }
        }, '$' + total.toLocaleString()) : null,
        // Remove (only multi-instance rooms)
        canRemove ? React.createElement('span', {
          onClick: function(e) { e.stopPropagation(); removeRoom(room.id); },
          style: { fontSize: 16, color: 'var(--text-muted)', cursor: 'pointer', padding: '0 4px' }
        }, '✕') : null
      );
    }),
    // Add room button
    !showAdd ?
      React.createElement('button', {
        onClick: function() { setShowAdd(true); },
        style: {
          minHeight: 48, border: '2px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)',
          background: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14,
          fontWeight: 600, color: 'var(--accent-primary)',
        }
      }, '+ Add room') :
      React.createElement('div', {
        style: { border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', overflow: 'hidden' }
      },
        React.createElement('div', { style: { padding: '10px 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-body)' } }, 'Add room instance'),
        multiTypes.map(function(type) {
          var count = window.AppStateManager.countRoomType(projectData, type);
          return React.createElement('button', {
            key: type,
            onClick: function() { addRoom(type); },
            style: {
              width: '100%', padding: '12px 14px', border: 'none', borderBottom: '1px solid var(--border-subtle)',
              background: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14,
              color: 'var(--text-primary)', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
            }
          }, type, React.createElement('span', { style: { color: 'var(--text-muted)', fontSize: 12 } }, count + ' added'));
        }),
        React.createElement('button', {
          onClick: function() { setShowAdd(false); },
          style: { width: '100%', padding: '10px 14px', border: 'none', background: 'var(--bg-surface-sunken)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)' }
        }, 'Cancel')
      )
  );
}

window.RoomManager = RoomManager;
