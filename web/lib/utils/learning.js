// Calculate confidence score based on user preferences
export function calculateConfidence(preferences, option, type) {
  if (!preferences || !preferences[type] || !option) {
    return 0.5; // Default medium confidence
  }

  const typePrefs = preferences[type];
  // Convert Mongoose Map to plain object if needed
  const plainPrefs = typePrefs instanceof Map
    ? Object.fromEntries(typePrefs)
    : typePrefs;
  const rawScore = plainPrefs[option];
  const score = Number.isFinite(rawScore) ? rawScore : null;

  if (score === null) {
    return 0.5; // Default medium confidence when no preference exists
  }

  // Normalize: assume max score of 10 for 100% confidence
  return Math.min(score / 10, 1);
}

// Update preferences based on feedback
export function updatePreferences(preferences, type, chosenOption, rating) {
  if (!preferences[type]) {
    preferences[type] = {};
  }
  
  const weight = rating / 5; // Convert 1-5 rating to 0.2-1.0
  const currentScore = preferences[type][chosenOption] || 0;
  
  // Add weighted score
  preferences[type][chosenOption] = currentScore + weight;
  
  return preferences;
}

// Get top options based on preferences
export function getTopOptions(preferences, type, count = 3) {
  if (!preferences[type]) {
    return [];
  }

  // Convert Mongoose Map to plain object to avoid internal properties
  const typePrefs = preferences[type];
  const plainPrefs = typePrefs instanceof Map
    ? Object.fromEntries(typePrefs)
    : typePrefs;

  return Object.entries(plainPrefs)
    .filter(([key]) => !key.startsWith('$')) // Filter out Mongoose internal properties
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([option]) => option);
}

// Blend AI suggestion with user preferences
export function blendOptions(aiSuggestion, fallbackOptions, userTopOptions, maxOptions = 4) {
  const options = new Set();
  
  // Always include AI suggestion if available
  if (aiSuggestion) {
    options.add(aiSuggestion);
  }
  
  // Add user's top preferences
  for (const opt of userTopOptions) {
    if (options.size >= maxOptions) break;
    options.add(opt);
  }
  
  // Fill with fallback options
  for (const opt of fallbackOptions) {
    if (options.size >= maxOptions) break;
    options.add(opt);
  }
  
  return Array.from(options);
}
