// Spark Homes — Main Repair Estimator App Shell

function EstimatorApp() {
  var _v = React.useState('home'), view = _v[0], setView = _v[1];
  var _p = React.useState(null), project = _p[0], setProject = _p[1];
  var _r = React.useState(null), activeRoomId = _r[0], setActiveRoomId = _r[1];
  var _gp = React.useState(null), showGlobalPrices = _gp[0], setShowGlobalPrices = _gp[1];

  // Load from localStorage on mount
  React.useEffect(function() {
    var projects = window.AppStateManager.loadProjects();
    if (projects.length > 0) {
      setProject(projects[0]);
      setView('rooms');
    }
  }, []);

  // Persist on every change
  React.useEffect(function() {
    if (project) {
      window.AppStateManager.saveProjects([project]);
    }
  }, [project]);

  function startNew() {
    var p = window.createNewProject('');
    setProject(p);
    setView('intake');
  }

  function goToRooms() { setView('rooms'); setActiveRoomId(null); }

  var activeRoom = project && activeRoomId ? project.rooms.find(function(r) { return r.id === activeRoomId; }) : null;
  var progress = project ? window.AppStateManager.getProgress(project) : { completed: 0, total: 0, pct: 0 };
  var grandTotal = project ? window.AppStateManager.getProjectTotal(project) : 0;

  // ── RENDER ──

  var styles = {
    shell: { width: '100%', maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)' },
    header: { display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: 'var(--color-charcoal)', color: 'var(--text-on-dark)', minHeight: 56, position: 'sticky', top: 0, zIndex: 20 },
    headerTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, flex: 1 },
    backBtn: { border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-cream)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 },
    content: { flex: 1, overflow: 'auto' },
    stickyTotal: { position: 'sticky', bottom: 0, background: 'var(--color-charcoal)', color: 'var(--text-on-dark)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 },
    totalLabel: { fontSize: 13, fontWeight: 600, letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', opacity: 0.7 },
    totalAmount: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28 },
  };

  // HOME
  if (view === 'home' || !project) {
    return React.createElement('div', { style: styles.shell },
      React.createElement('div', { style: styles.header },
        React.createElement('span', { style: styles.headerTitle }, 'Spark Homes')
      ),
      React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 20, textAlign: 'center' } },
        React.createElement('img', { src: './assets/logo/spark-homes-logo.png', alt: 'Spark Homes', style: { width: 80, borderRadius: 12 } }),
        React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--text-primary)' } }, 'Repair Estimator'),
        React.createElement('div', { style: { fontSize: 15, color: 'var(--text-secondary)', maxWidth: 280 } }, 'Walk the property, log repairs room by room, get a cost estimate.'),
        React.createElement('button', {
          onClick: startNew,
          style: { minHeight: 48, padding: '0 32px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-primary)', color: 'var(--text-on-accent)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, cursor: 'pointer' }
        }, 'New estimate')
      )
    );
  }

  // INTAKE
  if (view === 'intake') {
    return React.createElement('div', { style: styles.shell },
      React.createElement('div', { style: styles.header },
        React.createElement('span', { style: styles.headerTitle }, 'Property details')
      ),
      React.createElement('div', { style: { padding: 20, display: 'flex', flexDirection: 'column', gap: 16 } },
        React.createElement(FieldInput, { label: 'ADDRESS', placeholder: '123 Maple St', value: project.address, onChange: function(v) { setProject(Object.assign({}, project, { address: v })); } }),
        React.createElement('div', { style: { display: 'flex', gap: 12 } },
          React.createElement(FieldInput, { label: 'SQ FT', type: 'number', placeholder: '1800', value: project.sqft, onChange: function(v) { setProject(Object.assign({}, project, { sqft: v })); } }),
          React.createElement(FieldInput, { label: 'YEAR BUILT', type: 'number', placeholder: '1974', value: project.yearBuilt, onChange: function(v) { setProject(Object.assign({}, project, { yearBuilt: v })); } })
        ),
        React.createElement('button', {
          onClick: goToRooms,
          style: { minHeight: 48, borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-primary)', color: 'var(--text-on-accent)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginTop: 12 }
        }, 'Start walkthrough')
      )
    );
  }

  // ROOMS LIST
  if (view === 'rooms') {
    return React.createElement('div', { style: styles.shell },
      React.createElement('div', { style: styles.header },
        React.createElement('button', { onClick: function() { setView('intake'); }, style: styles.backBtn }, '‹'),
        React.createElement('span', { style: styles.headerTitle }, project.address || 'Walkthrough'),
        React.createElement('button', {
          onClick: function() { setView('photos'); },
          style: Object.assign({}, styles.backBtn, { fontSize: 16 })
        }, '📷'),
        React.createElement('button', {
          onClick: function() { setView('totals'); },
          style: Object.assign({}, styles.backBtn, { fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 700 })
        }, '$')
      ),
      // Progress
      React.createElement('div', { style: { padding: '12px 16px', background: 'var(--bg-surface-sunken)' } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 } },
          React.createElement('span', null, progress.completed + ' of ' + progress.total + ' groups reviewed'),
          React.createElement('span', null, progress.pct + '%')
        ),
        React.createElement('div', { style: { height: 6, borderRadius: 'var(--radius-full)', background: 'var(--border-subtle)', overflow: 'hidden' } },
          React.createElement('div', { style: { width: progress.pct + '%', height: '100%', background: 'var(--accent-secondary)', transition: 'width 200ms ease-out' } })
        )
      ),
      // Room list
      React.createElement('div', { style: { padding: 16, flex: 1 } },
        React.createElement(window.RoomManager, {
          projectData: project,
          setProjectData: setProject,
          onSelectRoom: function(id) { if (id) { setActiveRoomId(id); setView('room'); } },
          activeRoomId: null,
        })
      ),
      // Sticky total
      React.createElement('div', { style: styles.stickyTotal },
        React.createElement('span', { style: styles.totalLabel }, 'Running total'),
        React.createElement('span', { style: styles.totalAmount }, '$' + grandTotal.toLocaleString())
      )
    );
  }

  // ROOM DETAIL
  if (view === 'room' && activeRoom) {
    return React.createElement('div', { style: styles.shell },
      React.createElement('div', { style: styles.header },
        React.createElement('button', { onClick: goToRooms, style: styles.backBtn }, '‹'),
        React.createElement('span', { style: styles.headerTitle }, activeRoom.label)
      ),
      React.createElement('div', { style: { padding: 12, flex: 1 } },
        React.createElement(window.SectionView, {
          room: activeRoom,
          projectData: project,
          setProjectData: setProject,
        })
      ),
      React.createElement('div', { style: styles.stickyTotal },
        React.createElement('span', { style: styles.totalLabel }, 'Room total'),
        React.createElement('span', { style: Object.assign({}, styles.totalAmount, { fontSize: 22 }) }, '$' + window.AppStateManager.getRoomTotal(activeRoom).toLocaleString())
      )
    );
  }

  // PHOTOS
  if (view === 'photos') {
    return React.createElement('div', { style: styles.shell },
      React.createElement('div', { style: styles.header },
        React.createElement('button', { onClick: goToRooms, style: styles.backBtn }, '‹'),
        React.createElement('span', { style: styles.headerTitle }, 'Photos')
      ),
      React.createElement('div', { style: { padding: 16 } },
        React.createElement(window.PhotoCapture, {
          photos: project.photos || [],
          onAddPhoto: function(photo) {
            setProject(Object.assign({}, project, { photos: (project.photos || []).concat([photo]) }));
          },
          onRemovePhoto: function(id) {
            setProject(Object.assign({}, project, { photos: (project.photos || []).filter(function(p) { return p.id !== id; }) }));
          },
        })
      )
    );
  }

  // TOTALS
  if (view === 'totals') {
    var byCategory = {};
    project.rooms.forEach(function(room) {
      Object.keys(room.groups).forEach(function(groupName) {
        var g = room.groups[groupName];
        if (!g.noActionNeeded) {
          g.items.forEach(function(i) {
            if (i.qty > 0) {
              var key = room.label + ' → ' + groupName;
              byCategory[key] = (byCategory[key] || 0) + (i.overrideCost !== null ? i.overrideCost : i.unitCost) * i.qty;
            }
          });
        }
      });
    });

    return React.createElement('div', { style: styles.shell },
      React.createElement('div', { style: styles.header },
        React.createElement('button', { onClick: goToRooms, style: styles.backBtn }, '‹'),
        React.createElement('span', { style: styles.headerTitle }, 'Estimate summary')
      ),
      React.createElement('div', { style: { padding: 20, display: 'flex', flexDirection: 'column', gap: 16 } },
        // Big total
        React.createElement('div', { style: { textAlign: 'center', padding: '16px 0' } },
          React.createElement('div', { style: { fontSize: 13, fontWeight: 600, letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--text-secondary)' } }, 'Total estimated repair cost'),
          React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 42, color: 'var(--accent-primary)', lineHeight: 'var(--leading-tight)' } }, '$' + grandTotal.toLocaleString())
        ),
        // Breakdown
        React.createElement('div', { style: { border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' } },
          Object.keys(byCategory).length === 0 ?
            React.createElement('div', { style: { padding: 16, fontSize: 14, color: 'var(--text-muted)' } }, 'No items entered yet.') :
            Object.entries(byCategory).map(function(entry) {
              return React.createElement('div', {
                key: entry[0],
                style: { display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: 14 }
              },
                React.createElement('span', { style: { color: 'var(--text-secondary)' } }, entry[0]),
                React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' } }, '$' + entry[1].toLocaleString())
              );
            })
        ),
        // Progress
        React.createElement('div', { style: { padding: '12px 16px', background: 'var(--bg-surface-warm)', borderRadius: 'var(--radius-md)' } },
          React.createElement('div', { style: { fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 } }, 'Walkthrough progress'),
          React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--text-primary)' } }, progress.pct + '% complete'),
          React.createElement('div', { style: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 } }, progress.completed + ' of ' + progress.total + ' groups reviewed')
        )
      )
    );
  }

  return React.createElement('div', null, 'Unknown view');
}

// Simple field input helper
function FieldInput({ label, type, placeholder, value, onChange }) {
  return React.createElement('label', { style: { display: 'flex', flexDirection: 'column', gap: 6, flex: 1 } },
    label ? React.createElement('span', { style: { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 'var(--tracking-wide)', fontFamily: 'var(--font-body)' } }, label) : null,
    React.createElement('input', {
      type: type || 'text', placeholder: placeholder, value: value || '',
      onChange: function(e) { onChange(e.target.value); },
      style: {
        height: 48, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
        padding: '0 14px', fontFamily: 'var(--font-body)', fontSize: 16,
        background: 'var(--bg-surface)', color: 'var(--text-primary)',
      }
    })
  );
}

window.EstimatorApp = EstimatorApp;
