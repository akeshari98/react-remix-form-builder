// GitHub Pages SPA routing fix - updated to prevent redirect loops
(function() {
  // Only run this script once to prevent infinite redirects
  if (window.spaRedirectProcessed) return;
  window.spaRedirectProcessed = true;
  
  console.log('SPA redirect script running');
  
  // Parse the current URL's query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const path = searchParams.get('path');
  
  // Check if we're in a redirect with the path parameter and it's not empty
  if (path) {
    console.log('Found path param:', path);
    
    // Clean up the URL by removing the path parameter
    searchParams.delete('path');
    const cleanSearch = searchParams.toString() ? '?' + searchParams.toString() : '';
    
    // Build the new URL with the base path of the GitHub Pages site
    const repoName = '/react-remix-form-builder';
    let targetPath = path;
    
    // Ensure path starts with a slash if it doesn't already
    if (!targetPath.startsWith('/')) {
      targetPath = '/' + targetPath;
    }
    
    // Construct the full path including repo name (for GitHub Pages)
    const fullPath = repoName + targetPath;
    
    console.log('Redirecting to:', fullPath);
    
    // Update the URL without causing a page reload
    window.history.replaceState(null, null, fullPath + cleanSearch + window.location.hash);
    
    // Force a refresh if we've been stuck in a redirect loop
    if (sessionStorage.getItem('redirectAttempts') > 2) {
      sessionStorage.removeItem('redirectAttempts');
      window.location.href = repoName;
      return;
    }
    
    // Increment redirect attempts counter
    const attempts = parseInt(sessionStorage.getItem('redirectAttempts') || '0');
    sessionStorage.setItem('redirectAttempts', attempts + 1);
  } else {
    // Reset redirect attempts if we're not in a redirect
    sessionStorage.removeItem('redirectAttempts');
  }
})();
