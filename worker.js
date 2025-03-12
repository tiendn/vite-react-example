addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    const url = new URL(request.url);
    const user = url.searchParams.get('user') || 'Unknown';
    const amount = url.searchParams.get('amount') || '0';
  
    // Generate a simple SVG image
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
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  }