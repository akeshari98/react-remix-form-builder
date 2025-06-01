// GitHub Pages router script
(function() {
  console.log('GitHub Pages router initializing');
  
  // Only run on GitHub Pages
  if (window.location.hostname !== 'akeshari98.github.io') {
    console.log('Not on GitHub Pages, skipping router');
    return;
  }
  
  // Get repository base path
  const basePath = '/react-remix-form-builder';
  
  // If we're on a path other than the base path, make sure it exists in the router
  const path = window.location.pathname;
  
  // For deeper routes, we'll need to redirect to the root and let Remix handle routing
  if (path !== basePath && path !== basePath + '/') {
    console.log('Redirecting to app root for client-side routing');
    window.location.href = basePath + '/';
  }
})();
