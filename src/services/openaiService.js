import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Helper function to check API key and model access
const checkAPIAccess = async () => {
  try {
    const response = await openai.models.list();
    console.log('Available models:', response.data.map(model => model.id));
    return response.data;
  } catch (error) {
    console.error('API Key validation error:', error);
    throw new Error('Failed to validate API key. Please check if your API key is valid.');
  }
};

// Helper function to add delay between API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeSkinImage = async (imageBase64, symptomsData) => {
  try {
    // First check API access
    console.log('Checking API access...');
    const availableModels = await checkAPIAccess();
    console.log('Available models:', availableModels);

    // Check if the image data is valid
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      throw new Error('Invalid image data provided');
    }

    // First, get a detailed description of the image
    console.log('Getting image description...');
    const descriptionResponse = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "You are an expert at describing medical images, particularly skin conditions. Provide a detailed, objective description of what you see in the image, focusing on any visible skin conditions, their characteristics, and patterns. Be specific about colors, shapes, sizes, and any other distinguishing features."
        },
        {
          role: "user",
          content: `Please analyze this base64 encoded image and provide a detailed description of any visible skin conditions. Focus on:\n1. Color and texture\n2. Size and shape\n3. Location and distribution\n4. Any visible patterns or characteristics\n\nImage data: ${imageBase64}`
        }
      ],
      max_tokens: 1000
    });

    // Add a delay to prevent rate limiting - Increased delay
    await delay(3000);

    const imageDescription = descriptionResponse.choices[0].message.content;
    console.log('Image description received:', imageDescription);

    // Now analyze the description and symptoms
    console.log('Analyzing image description and symptoms...');
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "You are a dermatology expert. Based on the given description of a skin condition and the provided symptoms, provide a detailed analysis. Format the output using markdown for clarity and readability, including headings, bullet points, and bold text. List potential diagnoses, indicating the most likely one if possible. Also, include likely causes, recommended next steps, and when to seek medical attention. If more information is needed for a more accurate diagnosis, clearly state what additional details would be helpful."
        },
        {
          role: "user",
          content: `Based on this description of a skin condition and the following reported symptoms, please provide a detailed analysis, formatted in markdown:\n\nImage Description:\n${imageDescription}\n\nReported Symptoms:\nPrimary Symptom: ${symptomsData.primary || 'Not specified'}\nSecondary Symptom: ${symptomsData.secondary || 'Not specified'}\nDuration: ${symptomsData.duration || 'Not specified'}\nAdditional Notes: ${symptomsData.notes || 'Not specified'}`
        }
      ],
      max_tokens: 1000
    });

    return analysisResponse.choices[0].message.content;
  } catch (error) {
    console.error('Detailed error information:', {
      name: error.name,
      message: error.message,
      status: error.status,
      response: error.response?.data,
      stack: error.stack
    });

    if (error.status === 429) {
      throw new Error(
        'Rate limit exceeded. Please:\n' +
        '1. Wait a few minutes before trying again\n' +
        '2. Check your API usage limits\n' +
        '3. Consider upgrading your plan if you need more requests\n\n' +
        `Error details: ${error.message}`
      );
    }

    if (error.status === 401) {
      throw new Error(
        'Authentication error. Please check:\n' +
        '1. Your API key is correct\n' +
        '2. Your API key is properly set in the .env file\n' +
        '3. Your API key has not expired\n\n' +
        `Error details: ${error.message}`
      );
    }

    throw new Error(
      'Error analyzing image. Details:\n' +
      `- Error type: ${error.name}\n` +
      `- Message: ${error.message}\n\n` +
      'Please try again or contact support if the issue persists.'
    );
  }
};

export const analyzeSymptoms = async (symptomsData) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "You are a dermatology expert. Analyze the given symptoms and provide a detailed diagnosis of potential skin conditions. Format the output using markdown for clarity and readability, including headings, bullet points, and bold text. List potential diagnoses, indicating the most likely one if possible. Also, include likely causes, recommended next steps, and when to seek medical attention. If more information is needed for a more accurate diagnosis, clearly state what additional details would be helpful."
        },
        {
          role: "user",
          content: `Please analyze the following reported symptoms and provide a detailed diagnosis, formatted in markdown:\n\nPrimary Symptom: ${symptomsData.primary || 'Not specified'}\nSecondary Symptom: ${symptomsData.secondary || 'Not specified'}\nDuration: ${symptomsData.duration || 'Not specified'}\nAdditional Notes: ${symptomsData.notes || 'Not specified'}`
        }
      ],
      max_tokens: 500
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing symptoms:', {
      name: error.name,
      message: error.message,
      status: error.status,
      response: error.response?.data
    });
    throw error;
  }
}; 