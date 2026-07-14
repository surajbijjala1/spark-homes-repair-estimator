ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(window.EstimatorApp));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
