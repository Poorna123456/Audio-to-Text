export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const formData = await req.formData();
    
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return new Response(
        JSON.stringify({ error: { message: "Server configuration error: Missing GROQ_API_KEY environment variable." } }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Forward the formData to Groq
    const groqResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: formData,
    });

    const result = await groqResponse.json();
    
    return new Response(JSON.stringify(result), {
      status: groqResponse.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: { message: error.message || "Failed to process audio on the server" } }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
