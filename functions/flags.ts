export async function startEvent() {
  try {
    const result = await fetch(
      `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`
        },
        body: JSON.stringify({
          items: [{
            operation: 'update',
            key: 'started',
            value: true
          }]
        })
      }).then(res => res.json())

    return Response.json(result)
  }
  catch (error) {
    console.error(error)
    return Response.json({ status: 500, body: { error: 'Failed to start event' } })
  }
}
