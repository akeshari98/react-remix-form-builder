// Single-page app routing fix for GitHub Pages
(function() {
  // If we're redirected with a ?path= parameter, navigate to that path
  const searchParams = new URLSearchParams(window.location.search);
  const path = searchParams.get('path');
  
  if (path) {
    // Remove the path from the query string and navigate to the path
    searchParams.delete('path');
    
    const newUrl = window.location.pathname + 
      (searchParams.toString() ? '?' + searchParams.toString() : '') + 
      window.location.hash;
      
    window.history.replaceState(null, null, newUrl);
    
    // Handle the internal navigation using Remix's routing
    if (window.__remixRouterNavigate) {
      window.__remixRouterNavigate(path);
    } else {
      // Fallback if Remix router is not available
      window.history.pushState(null, null, path);
    }
  }
})();
