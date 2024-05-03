addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === "POST") {
    // Handle file upload
    const data = await request.formData();
    const file = data.get('file');
    const id = new Date().getTime().toString();

    // Assuming 'bucket' is your R2 bucket instance
    await bucket.put(id, file.stream());

    return new Response(JSON.stringify({ id }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else if (request.url.includes('/download/')) {
    // Handle file download
    const id = request.url.split('/download/')[1];
    const file = await bucket.get(id);
    if (!file) return new Response('File not found', { status: 404 });

    return new Response(file.body, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${id}"`,
      },
    });
  }

  return new Response('Invalid request', { status: 400 });
}
