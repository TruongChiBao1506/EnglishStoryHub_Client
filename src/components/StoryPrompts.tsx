import React, { useState, useEffect, useCallback } from 'react';
import { aiService } from '../services/aiService';

interface StoryPromptsProps {
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  onPromptSelect: (prompt: string) => void;
}

const StoryPrompts: React.FC<StoryPromptsProps> = ({ userLevel, onPromptSelect }) => {
  const [prompts, setPrompts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingStarter, setGeneratingStarter] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);

  const generatePrompts = useCallback(async (customTopic?: string) => {
    setLoading(true);
    try {
      const response = await aiService.generateStoryPrompts(userLevel, customTopic || topic);
      if (response.success && response.data) {
        setPrompts(response.data);
        setShowPrompts(true);
      }
    } catch (error) {
      console.error('Failed to generate prompts:', error);
    } finally {
      setLoading(false);
    }
  }, [userLevel, topic]);

  useEffect(() => {
    generatePrompts();
  }, [generatePrompts]);

  const handleGenerateWithTopic = () => {
    generatePrompts(topic);
  };

  const handleUsePrompt = async (prompt: string, index: number) => {
    setGeneratingStarter(`${index}`);
    try {
      const response = await aiService.generateStoryStarter(prompt, userLevel);
      if (response.success && response.data) {
        onPromptSelect(response.data);
      } else {
        // Fallback to original prompt
        onPromptSelect(prompt);
      }
    } catch (error) {
      console.error('Failed to generate story starter:', error);
      // Fallback to original prompt
      onPromptSelect(prompt);
    } finally {
      setGeneratingStarter(null);
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">💡</span>
          <h3 className="text-lg font-semibold text-gray-900">Story Inspiration</h3>
        </div>
        <button
          onClick={() => setShowPrompts(!showPrompts)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showPrompts ? 'Hide' : 'Get Ideas'}
        </button>
      </div>

      {showPrompts && (
        <div className="space-y-4">
          {/* Topic Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic for custom prompts (optional)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={handleGenerateWithTopic}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {/* Prompts */}
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Generating story ideas...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 text-sm">
                  Story ideas for {userLevel} level:
                </h4>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  ✨ Click "Use This" to get AI-generated story starters
                </div>
              </div>
              {prompts.map((prompt, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-800 flex-1">{prompt}</p>
                    <button
                      onClick={() => handleUsePrompt(prompt, index)}
                      disabled={generatingStarter === `${index}`}
                      className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[60px]"
                    >
                      {generatingStarter === `${index}` ? (
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>...</span>
                        </div>
                      ) : (
                        'Use This'
                      )}
                    </button>
                  </div>
                  {generatingStarter === `${index}` && (
                    <p className="text-xs text-blue-600 mt-2 italic">
                      ✨ Generating personalized story starter for you...
                    </p>
                  )}
                </div>
              ))}
              
              <button
                onClick={() => generatePrompts()}
                className="w-full text-sm text-blue-600 hover:text-blue-800 py-2 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50"
              >
                🎲 Generate More Ideas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoryPrompts;
