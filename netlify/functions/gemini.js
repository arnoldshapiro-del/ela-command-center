// Netlify Serverless Function for Gemini 3 Flash API
// API key is stored securely in Netlify environment variables

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get API key from Netlify environment variable (secure!)
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured. Please add GEMINI_API_KEY to Netlify environment variables.' })
    };
  }

  try {
    // Parse the request body
    const { prompt, systemPrompt, model, thinkingLevel } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    // Use Gemini 3 Flash by default
    const modelId = model || 'gemini-3-flash-preview';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

    // Build request body
    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
      ]
    };

    // Add thinking level for Gemini 3 models
    if (modelId.includes('gemini-3') && thinkingLevel) {
      requestBody.generationConfig.thinking_level = thinkingLevel;
    }

    // Add system instruction if provided
    if (systemPrompt) {
      requestBody.systemInstruction = { parts: [{ text: systemPrompt }] };
    }

    // Make the API call
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || 'Gemini API error' })
      };
    }

    // Extract the response text
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          text: data.candidates[0].content.parts[0].text,
          model: modelId
        })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No response from Gemini' })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error: ' + error.message })
    };
  }
};
