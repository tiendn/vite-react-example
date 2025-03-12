addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;
  
    // Handle image generation requests
    if (path === '/image') {
      return handleImageRequest(url);
    }
  
    // Handle metadata requests
    const userMatch = path.match(/\/user\/([^\/]+)/);
    if (userMatch) {
      return handleMetadataRequest(url, userMatch[1]);
    }
  
    return new Response('Not found', { status: 404 });
  }
  
  async function handleImageRequest(url) {
    const user = url.searchParams.get('user') || 'Unknown';
    const amount = url.searchParams.get('amount') || '0';
  
    const svg = `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1DA1F2" />
        <text x="20" y="100" font-size="30" fill="white">User: ${user}</text>
        <text x="20" y="140" font-size="30" fill="white">Amount: $${amount}</text>
      </svg>
    `;
  
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
  
  async function handleMetadataRequest(url, userId) {
    const amount = url.searchParams.get('amount') || '100';
    
    // Generate the URLs for metadata
    const imageUrl = `https://meta.yourdomain.com/image?user=${userId}&amount=${amount}`;
    const appUrl = `https://app.yourdomain.com/user/${userId}?amount=${amount}`;
  
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User ${userId} - $${amount}</title>
        
        <!-- OpenGraph Meta Tags -->
        <meta property="og:title" content="User ${userId} - $${amount}">
        <meta property="og:description" content="This user has an amount of $${amount}.">
        <meta property="og:image" content="${imageUrl}">
        <meta property="og:url" content="${appUrl}">
        <meta property="og:type" content="profile">
        
        <!-- Twitter Card Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="User ${userId} - $${amount}">
        <meta name="twitter:description" content="This user has an amount of $${amount}.">
        <meta name="twitter:image" content="${imageUrl}">
        
        <!-- Redirect to the actual app -->
        <meta http-equiv="refresh" content="0;url=${appUrl}">
      </head>
      <body>
        <p>Redirecting to application...</p>
        <script>window.location.href = "${appUrl}";</script>
      </body>
      </html>
    `;
  
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }