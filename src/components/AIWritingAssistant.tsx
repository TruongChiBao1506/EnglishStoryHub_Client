import React, { useState } from 'react';
import { aiService, AIFeedback } from '../services/aiService';

interface AIWritingAssistantProps {
  content: string;
  onContentChange: (content: string) => void;
}

const AIWritingAssistant: React.FC<AIWritingAssistantProps> = ({
  content,
  onContentChange,
}) => {
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [checking, setChecking] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleCheckContent = async () => {
    if (!content.trim()) return;

    setChecking(true);
    try {
      const response = await aiService.checkStoryContent(content);
      if (response.success && response.data) {
        setFeedback(response.data);
        setShowFeedback(true);
      }
    } catch (error) {
      console.error('AI check failed:', error);
    } finally {
      setChecking(false);
    }
  };

  const applySuggestion = (original: string, corrected: string) => {
    const newContent = content.replace(original, corrected);
    onContentChange(newContent);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-semibold text-gray-900">AI Writing Assistant</h3>
        </div>
        <button
          onClick={handleCheckContent}
          disabled={checking || !content.trim()}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {checking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>Check Grammar & Style</span>
            </>
          )}
        </button>
      </div>

      {showFeedback && feedback && (
        <div className="space-y-4">
          {/* Overall Score */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Writing Score:</span>
            <div className="flex items-center space-x-2">
              <div className={`text-2xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                {feedback.overallScore}/100
              </div>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(feedback.overallScore / 20) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Corrections */}
          {feedback.corrections.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Suggested Corrections:</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {feedback.corrections.map((correction, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            correction.type === 'grammar' ? 'bg-red-100 text-red-800' :
                            correction.type === 'spelling' ? 'bg-orange-100 text-orange-800' :
                            correction.type === 'vocabulary' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {correction.type}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-red-600 line-through">{correction.original}</span>
                          <span className="mx-2">→</span>
                          <span className="text-green-600 font-medium">{correction.corrected}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{correction.explanation}</p>
                      </div>
                      <button
                        onClick={() => applySuggestion(correction.original, correction.corrected)}
                        className="ml-3 text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* General Suggestions */}
          {feedback.suggestions.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Writing Tips:</h4>
              <ul className="space-y-2">
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <span className="text-blue-500 mt-1">💡</span>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Difficulty Assessment */}
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Difficulty Level:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                feedback.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                feedback.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {feedback.difficulty}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWritingAssistant;
