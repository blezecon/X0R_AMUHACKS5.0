import axios from 'axios';
import { getDecryptedApiKey } from './auth.js';

const FALLBACK_MEALS = [
  'Pizza', 'Salad', 'Burger', 'Sushi', 'Pasta', 
  'Tacos', 'Sandwich', 'Soup', 'Stir Fry', 'Curry'
];

const FALLBACK_TASKS = [
  'Exercise for 30 minutes', 'Read 10 pages', 'Meditate for 10 minutes',
  'Clean one room', 'Call a friend', 'Write in journal',
  'Learn something new', 'Plan tomorrow', 'Organize desk', 'Take a walk'
];

function getPrompt(type, context, userPreferences) {
  const prefsString = Object.entries(userPreferences || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([opt, score]) => `${opt} (${(score * 100).toFixed(0)}%)`)
    .join(', ') || 'None yet';

  if (type === 'meal') {
    return `You are a helpful meal recommendation assistant. 

Context:
- Weather: ${context.weather || 'neutral'}
- Time: ${context.time || 'current'}

User's top preferences: ${prefsString}

Suggest ONE meal option that:
1. Fits the weather context
2. Aligns with user preferences if available
3. Is specific and actionable
4. Reduces decision fatigue

Respond with ONLY the meal name, nothing else.`;
  } else {
    return `You are a helpful productivity assistant.

Context:
- Time: ${context.time || 'current'}
- Weather: ${context.weather || 'neutral'}

User's top preferences: ${prefsString}

Suggest ONE daily task that:
1. Boosts productivity or well-being
2. Takes 10-30 minutes
3. Is specific and actionable
4. Reduces decision fatigue

Respond with ONLY the task description, nothing else.`;
  }
}

export async function getAISuggestion(userId, type, context, userPreferences, preferredProvider = 'openrouter') {
  try {
    const provider = preferredProvider || 'openrouter';
    const apiKey = await getDecryptedApiKey(userId, provider);
    
    if (!apiKey) {
      console.log('No API key found for user, using fallback');
      return null;
    }

    const prompt = getPrompt(type, context, userPreferences);

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Decision Fatigue Reducer'
        },
        timeout: 10000
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      const suggestion = response.data.choices[0].message.content.trim();
      // Clean up the response - remove quotes and extra whitespace
      return suggestion.replace(/^["']|["']$/g, '').trim();
    }

    return null;
  } catch (error) {
    console.error('AI suggestion error:', error.message);
    return null;
  }
}

export function getFallbackOptions(type) {
  if (type === 'meal') {
    return FALLBACK_MEALS;
  } else if (type === 'task') {
    return FALLBACK_TASKS;
  }
  return [];
}

export async function getGroqSuggestion(userId, type, context, userPreferences) {
  // Stub for Groq implementation
  console.log('Groq provider stub called');
  return null;
}

export async function getAnthropicSuggestion(userId, type, context, userPreferences) {
  // Stub for Anthropic implementation
  console.log('Anthropic provider stub called');
  return null;
}
