// Spark Homes — Photo Capture Component

function PhotoCapture({ photos, onAddPhoto, onRemovePhoto }) {
  var fileRef = React.useRef(null);

  function handleFile(e) {
    var files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach(function(file) {
      var reader = new FileReader();
      reader.onload = function(ev) {
        var photo = {
          id: 'ph_' + Math.random().toString(36).slice(2, 10),
          dataUrl: ev.target.result,
          name: file.name,
          timestamp: Date.now(),
          serialNumber: null,
        };
        // Attempt serial number parse from filename or EXIF (basic heuristic)
        var snMatch = file.name.match(/[A-Z]{2,4}[\s\-]?\d{6,}/i);
        if (snMatch) photo.serialNumber = snMatch[0];
        onAddPhoto(photo);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
    // Capture button
    React.createElement('button', {
      onClick: function() { fileRef.current && fileRef.current.click(); },
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        minHeight: 48, border: '2px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)',
        background: 'var(--bg-surface)', cursor: 'pointer', fontFamily: 'var(--font-body)',
        fontSize: 14, fontWeight: 600, color: 'var(--accent-primary)',
      }
    }, '📷  Capture photo'),
    React.createElement('input', {
      ref: fileRef, type: 'file', accept: 'image/*', capture: 'environment',
      multiple: true, onChange: handleFile,
      style: { display: 'none' },
    }),
    // Thumbnails grid
    photos && photos.length > 0 ? React.createElement('div', {
      style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }
    },
      photos.map(function(photo) {
        return React.createElement('div', {
          key: photo.id,
          style: { position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', aspectRatio: '1', background: 'var(--bg-surface-sunken)' }
        },
          React.createElement('img', {
            src: photo.dataUrl, alt: photo.name,
            style: { width: '100%', height: '100%', objectFit: 'cover' },
          }),
          // Remove button
          React.createElement('button', {
            onClick: function() { onRemovePhoto(photo.id); },
            style: {
              position: 'absolute', top: 4, right: 4, width: 24, height: 24,
              borderRadius: '50%', border: 'none', background: 'rgba(58,53,50,0.7)',
              color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }
          }, '✕'),
          // Serial number badge
          photo.serialNumber ? React.createElement('div', {
            style: {
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'rgba(58,53,50,0.8)', color: 'var(--color-cream)',
              fontSize: 10, padding: '3px 6px', fontFamily: 'var(--font-display)',
              fontWeight: 600,
            }
          }, 'S/N: ' + photo.serialNumber) : null
        );
      })
    ) : null
  );
}

window.PhotoCapture = PhotoCapture;
