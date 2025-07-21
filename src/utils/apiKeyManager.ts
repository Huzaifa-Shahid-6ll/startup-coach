
// API Key management for different models
export const getApiKey = (modelType?: 'model1' | 'model2' | 'model3') => {
  switch (modelType) {
    case 'model1':
      return localStorage.getItem('OPENROUTER_API_KEY_MODEL1') || localStorage.getItem('VITE_OPENROUTER_API_KEY');
    case 'model2':
      return localStorage.getItem('OPENROUTER_API_KEY_MODEL2') || localStorage.getItem('VITE_OPENROUTER_API_KEY');
    case 'model3':
      return localStorage.getItem('OPENROUTER_API_KEY_MODEL3') || localStorage.getItem('VITE_OPENROUTER_API_KEY');
    default:
      // Fallback to primary key
      return localStorage.getItem('VITE_OPENROUTER_API_KEY') || localStorage.getItem('OPENROUTER_API_KEY_MODEL1');
  }
};

export const hasAnyApiKey = () => {
  return !!(
    localStorage.getItem('VITE_OPENROUTER_API_KEY') ||
    localStorage.getItem('OPENROUTER_API_KEY_MODEL1') ||
    localStorage.getItem('OPENROUTER_API_KEY_MODEL2') ||
    localStorage.getItem('OPENROUTER_API_KEY_MODEL3')
  );
};
