// pages/api/recommendations.ts
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { NextApiRequest, NextApiResponse } from 'next';
import { init } from "@launchdarkly/node-server-sdk";
import { initAi } from "@launchdarkly/server-sdk-ai";

// Initialize LaunchDarkly server-side SDK
console.log('Initializing LaunchDarkly SDK with key:', process.env.LAUNCHDARKLY_SDK_KEY ? 'Key exists' : 'No key found');
const ldClient = init(process.env.LAUNCHDARKLY_SDK_KEY || '');
await ldClient.waitForInitialization();
const aiClient = initAi(ldClient);

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const startTime = Date.now();
  console.log('API handler started');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { query } = req.body;
    console.log('Received request:', { query });

    // Get AI Config from LaunchDarkly
    console.log('Getting AI Config from LaunchDarkly');
    try {
      const user = {
        kind: 'user',
        key: 'anonymous',
        anonymous: true
      };
      console.log('Using LaunchDarkly user context:', user);

      const aiConfig = await aiClient.config('retail-chatbot', user, {
        enabled: true,
        model: {
          name: "amazon.nova-pro-1.0",
          parameters: {
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1
          }
        },
        messages: []
      });
      // Avoid circular structure error by logging only model and messages
      console.log('Model from AI Config:', aiConfig?.model);
      console.log('Messages from AI Config:', aiConfig?.messages);
      console.log('Model name from AI Config:', aiConfig?.model?.name);

      if (!aiConfig) {
        console.error('No AI configuration returned from LaunchDarkly');
        throw new Error('No AI configuration found in LaunchDarkly');
      }

      // Use the model and parameters from AI Config
      const modelId = aiConfig.model?.name;
      if (!modelId) {
        throw new Error('No model specified in AI configuration');
      }

      const parameters = aiConfig.model?.parameters || {
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1
      };

      // Prepare the prompt for Bedrock using AI Config messages
      // Filter out system messages and only keep user messages
      const messages = (aiConfig.messages || [])
        .filter(msg => msg.role === 'user')
        .map(msg => ({
          role: msg.role,
          content: [{ text: msg.content }]  // Convert all messages to Nova Pro format
        }))
        .concat([{ 
          role: 'user', 
          content: [{ text: query }]
        }]);

      // Prepare the prompt based on the model
      let prompt;
      if (modelId.startsWith('amazon.nova')) {
        // Nova Pro format
        prompt = {
          messages: messages,
          system: [{
            text: "You are a friendly and helpful Nike retail assistant. Your goal is to help customers find the right products based on their needs and preferences. You should:\n" +
              "\n" +
              "- Ask clarifying questions to understand their needs (e.g., \"What activities will you be using these shoes for?\")\n" +
              "- Provide specific product recommendations from our catalog\n" +
              "- Explain the key features and benefits of recommended products\n" +
              "- Be conversational and approachable\n" +
              "- Focus on comfort, style, and value\n" +
              "- Suggest complementary items when relevant\n" +
              "- Keep responses concise and easy to understand\n" +
              "\n" +
              "When recommending products, consider:\n" +
              "- You are representing the Nike brand and in no way should you suggest or refer to a competitor's product. Limit all responses to Nike or subsidiary products.\n" +
              "- The customer's stated needs\n" +
              "- Popular and well-reviewed items\n" +
              "- Current trends in casual and athletic wear\n" +
              "- Price points and value\n" +
              "- Seasonal appropriateness\n" +
              "\n" +
              "Remember to maintain a helpful, friendly tone and focus on making the shopping experience enjoyable and straightforward."
          }],
          temperature: parameters.temperature,
          max_tokens: parameters.max_tokens,
          top_p: parameters.top_p
        };
      } else {
        // Claude format
        prompt = {
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: parameters.max_tokens,
          messages: messages,
          temperature: parameters.temperature,
          top_p: parameters.top_p,
          stop_sequences: ["\n\nHuman:"]
        };
      }

      // Call Bedrock with the configured model
      const command = new InvokeModelCommand({
        modelId: modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(prompt)
      });

      console.log('Calling Bedrock API with command:', JSON.stringify(command, null, 2));
      const response = await bedrockClient.send(command);
      console.log('Received Bedrock response:', response);

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      console.log('Parsed response body:', responseBody);

      // Handle response based on model
      let aiResponse;
      if (modelId.startsWith('amazon.nova')) {
        // Nova Pro response format
        if (!responseBody.output?.message?.content?.[0]?.text) {
          throw new Error('Invalid response format from Bedrock API');
        }
        aiResponse = responseBody.output.message.content[0].text;
      } else {
        // Claude response format
        if (!responseBody.content || !responseBody.content[0] || !responseBody.content[0].text) {
          throw new Error('Invalid response format from Bedrock API');
        }
        aiResponse = responseBody.content[0].text;
      }

      // Return the response
      res.status(200).json({
        message: aiResponse,
        responseTime: Date.now() - startTime
      });
    } catch (ldError: any) {
      console.error('LaunchDarkly error:', ldError);
      throw new Error(`LaunchDarkly error: ${ldError.message}`);
    }
  } catch (error: any) {
    console.error('Error in recommendations:', error);
    
    return res.status(500).json({ 
      error: 'Failed to get recommendations',
      details: error.message,
      code: error.code
    });
  }
}
