// Spark Homes — Collapsible Section & Line Item Components

function SectionView({ room, onUpdateProject, projectData, setProjectData }) {
  var groupNames = Object.keys(room.groups);
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 2 } },
    groupNames.map(function(groupName) {
      return React.createElement(GroupView, {
        key: room.id + ':' + groupName,
        room: room,
        groupName: groupName,
        group: room.groups[groupName],
        projectData: projectData,
        setProjectData: setProjectData,
      });
    })
  );
}

function GroupView({ room, groupName, group, projectData, setProjectData }) {
  var _s = React.useState(false), expanded = _s[0], setExpanded = _s[1];
  var _a = React.useState(false), addingItem = _a[0], setAddingItem = _a[1];
  var total = window.AppStateManager.getGroupTotal(group);
  var hasActivity = group.items.some(function(i) { return i.qty > 0; });
  var isComplete = group.noActionNeeded || hasActivity;
  var label = room.label + ': ' + groupName;

  function toggleNoAction() {
    var p = JSON.parse(JSON.stringify(projectData));
    var r = p.rooms.find(function(r) { return r.id === room.id; });
    if (r) { r.groups[groupName].noActionNeeded = !r.groups[groupName].noActionNeeded; }
    setProjectData(p);
  }

  function updateQty(itemId, newQty) {
    var p = JSON.parse(JSON.stringify(projectData));
    var r = p.rooms.find(function(rm) { return rm.id === room.id; });
    if (r) {
      var item = r.groups[groupName].items.find(function(i) { return i.id === itemId; });
      if (item) item.qty = Math.max(0, newQty);
    }
    setProjectData(p);
  }

  function updateCost(itemId, newCost) {
    var p = JSON.parse(JSON.stringify(projectData));
    var r = p.rooms.find(function(rm) { return rm.id === room.id; });
    if (r) {
      var item = r.groups[groupName].items.find(function(i) { return i.id === itemId; });
      if (item) item.overrideCost = newCost;
    }
    setProjectData(p);
  }

  function removeItem(itemId) {
    var p = window.AppStateManager.removeLineItem(projectData, room.id, groupName, itemId);
    setProjectData(p);
  }

  function addCustomItem(name, unit, cost) {
    var p = window.AppStateManager.addLineItem(projectData, room.id, groupName, { name: name, unit: unit, unitCost: cost, qty: 1 });
    setProjectData(p);
    setAddingItem(false);
  }

  var headerBg = isComplete ? 'rgba(62,107,76,0.08)' : 'var(--bg-surface)';
  var statusDot = isComplete ? 'var(--color-success)' : 'var(--border-subtle)';

  return React.createElement('div', {
    style: { marginBottom: 4, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }
  },
    // Header
    React.createElement('button', {
      onClick: function() { setExpanded(!expanded); },
      style: {
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 14px', background: headerBg, border: 'none', cursor: 'pointer',
        fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-primary)',
        textAlign: 'left', minHeight: 48,
      }
    },
      React.createElement('span', { style: { width: 8, height: 8, borderRadius: '50%', background: statusDot, flexShrink: 0 } }),
      React.createElement('span', { style: { flex: 1, fontWeight: 600 } }, label),
      total > 0 ? React.createElement('span', {
        style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--accent-primary)', marginRight: 8 }
      }, '$' + total.toLocaleString()) : null,
      React.createElement('span', {
        style: { fontSize: 18, color: 'var(--text-muted)', transition: 'transform 150ms', transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }
      }, '▾')
    ),
    // Body
    expanded ? React.createElement('div', { style: { background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' } },
      // No action needed toggle
      React.createElement('label', {
        style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }
      },
        React.createElement('input', { type: 'checkbox', checked: group.noActionNeeded, onChange: toggleNoAction, style: { accentColor: 'var(--accent-secondary)' } }),
        'No action needed'
      ),
      // Line items
      !group.noActionNeeded ? React.createElement('div', null,
        group.items.map(function(item) {
          return React.createElement(LineItemView, {
            key: item.id, item: item,
            onUpdateQty: function(q) { updateQty(item.id, q); },
            onUpdateCost: function(c) { updateCost(item.id, c); },
            onRemove: item.isCustom ? function() { removeItem(item.id); } : null,
          });
        }),
        // Add item
        !addingItem ? React.createElement('button', {
          onClick: function() { setAddingItem(true); },
          style: { width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--accent-primary)', textAlign: 'left' }
        }, '+ Add item') :
        React.createElement(AddItemForm, { onAdd: addCustomItem, onCancel: function() { setAddingItem(false); } })
      ) : React.createElement('div', {
        style: { padding: '16px 14px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)' }
      }, 'Marked as reviewed — no repairs needed.')
    ) : null
  );
}

function LineItemView({ item, onUpdateQty, onUpdateCost, onRemove }) {
  var _e = React.useState(false), editingCost = _e[0], setEditingCost = _e[1];
  var effectiveCost = item.overrideCost !== null ? item.overrideCost : item.unitCost;
  var lineTotal = effectiveCost * (item.qty || 0);
  var unitLabel = window.UNIT_LABELS[item.unit] || item.unit;

  return React.createElement('div', {
    style: { padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-body)' }
  },
    // Row 1: name + line total
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } },
      React.createElement('div', { style: { fontSize: 14, color: 'var(--text-primary)', fontWeight: 500, flex: 1 } },
        item.name,
        onRemove ? React.createElement('button', {
          onClick: onRemove,
          style: { border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-danger)', fontSize: 12, marginLeft: 6 }
        }, '✕') : null
      ),
      lineTotal > 0 ? React.createElement('span', {
        style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--accent-primary)' }
      }, '$' + lineTotal.toLocaleString()) : null
    ),
    // Row 2: qty stepper + unit cost
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
      // Qty control
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' } },
        React.createElement('button', {
          onClick: function() { onUpdateQty(item.qty - 1); },
          style: { width: 36, height: 36, border: 'none', background: 'var(--bg-surface-sunken)', cursor: 'pointer', fontSize: 16, color: 'var(--accent-primary)' }
        }, '−'),
        React.createElement('input', {
          type: 'number', value: item.qty || 0,
          onChange: function(e) { onUpdateQty(parseInt(e.target.value) || 0); },
          style: { width: 48, height: 36, border: 'none', borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)', textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, background: 'var(--bg-surface)', color: 'var(--text-primary)' }
        }),
        React.createElement('button', {
          onClick: function() { onUpdateQty(item.qty + 1); },
          style: { width: 36, height: 36, border: 'none', background: 'var(--bg-surface-sunken)', cursor: 'pointer', fontSize: 16, color: 'var(--accent-primary)' }
        }, '+')
      ),
      React.createElement('span', { style: { fontSize: 12, color: 'var(--text-muted)', minWidth: 32 } }, unitLabel),
      // Unit cost (tap to edit)
      !editingCost ?
        React.createElement('button', {
          onClick: function() { setEditingCost(true); },
          style: { border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: item.overrideCost !== null ? 'var(--color-warning)' : 'var(--text-secondary)', fontFamily: 'var(--font-body)', textDecoration: 'underline dotted' }
        }, '@ $' + effectiveCost.toLocaleString() + '/' + unitLabel) :
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 4 } },
          React.createElement('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, '$'),
          React.createElement('input', {
            type: 'number', autoFocus: true, defaultValue: effectiveCost,
            onBlur: function(e) { var v = parseFloat(e.target.value); if (!isNaN(v)) onUpdateCost(v); setEditingCost(false); },
            onKeyDown: function(e) { if (e.key === 'Enter') e.target.blur(); },
            style: { width: 70, height: 28, border: '1px solid var(--accent-primary)', borderRadius: 4, padding: '0 6px', fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-primary)' }
          })
        )
    )
  );
}

function AddItemForm({ onAdd, onCancel }) {
  var _n = React.useState(''), name = _n[0], setName = _n[1];
  var _u = React.useState('each'), unit = _u[0], setUnit = _u[1];
  var _c = React.useState(0), cost = _c[0], setCost = _c[1];
  var inputStyle = { height: 36, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0 10px', fontFamily: 'var(--font-body)', fontSize: 14, background: 'var(--bg-surface)', color: 'var(--text-primary)' };
  var btnStyle = { height: 36, border: 'none', borderRadius: 'var(--radius-sm)', padding: '0 14px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13 };

  return React.createElement('div', { style: { padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface-sunken)' } },
    React.createElement('input', { placeholder: 'Item name', value: name, onChange: function(e) { setName(e.target.value); }, style: Object.assign({}, inputStyle, { width: '100%' }), autoFocus: true }),
    React.createElement('div', { style: { display: 'flex', gap: 8 } },
      React.createElement('select', { value: unit, onChange: function(e) { setUnit(e.target.value); }, style: Object.assign({}, inputStyle, { flex: 1 }) },
        ['each','sqft','lnft','lot','hr'].map(function(u) { return React.createElement('option', { key: u, value: u }, window.UNIT_LABELS[u] || u); })
      ),
      React.createElement('input', { type: 'number', placeholder: 'Unit $', value: cost || '', onChange: function(e) { setCost(parseFloat(e.target.value) || 0); }, style: Object.assign({}, inputStyle, { width: 80 }) })
    ),
    React.createElement('div', { style: { display: 'flex', gap: 8 } },
      React.createElement('button', { onClick: onCancel, style: Object.assign({}, btnStyle, { flex: 1, background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }) }, 'Cancel'),
      React.createElement('button', { onClick: function() { if (name.trim()) onAdd(name, unit, cost); }, style: Object.assign({}, btnStyle, { flex: 1, background: 'var(--accent-primary)', color: 'var(--text-on-accent)' }) }, 'Add')
    )
  );
}

window.SectionView = SectionView;
window.GroupView = GroupView;
window.LineItemView = LineItemView;
