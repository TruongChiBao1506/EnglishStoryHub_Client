import api from '../utils/api';
import { ApiResponse } from '../types';

export interface AIFeedback {
  corrections: Array<{
    original: string;
    corrected: string;
    explanation: string;
    type: 'grammar' | 'spelling' | 'vocabulary' | 'style';
  }>;
  overallScore: number;
  suggestions: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const aiService = {
  // Generate story starter content based on prompt
  generateStoryStarter: async (
    prompt: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<ApiResponse<string>> => {
    try {
      const response = await api.post('/ai/story-starter', {
        prompt,
        userLevel
      });
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to generate story starter:', error);
      
      // Fallback to mock data if API fails
      const fallbackStarters = {
        beginner: `Let me tell you about ${prompt}. It is something that I think about often. This story begins on a normal day when something interesting happened.`,
        intermediate: `When I think about ${prompt}, many thoughts come to mind. This particular experience taught me something valuable about life and the way people interact with each other.`,
        advanced: `The complexity of ${prompt} offers numerous avenues for exploration. As I contemplate this multifaceted topic, I'm drawn to examine not only its surface implications but also its deeper philosophical underpinnings.`
      };
      
      return {
        success: true,
        data: fallbackStarters[userLevel] || fallbackStarters.beginner
      };
    }
  },
  // AI Grammar and style checker for stories
  checkStoryContent: async (content: string): Promise<ApiResponse<AIFeedback>> => {
    try {
      const response = await api.post('/ai/check-story', { content });
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('AI check failed:', error);
      
      // Fallback mock response for development
      return {
        success: true,
        data: {
          corrections: [
            {
              original: 'I am go to school',
              corrected: 'I am going to school',
              explanation: 'Use present continuous tense with -ing form',
              type: 'grammar',
            },
          ],
          overallScore: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
          suggestions: [
            'Great story! Consider adding more descriptive adjectives to make it more engaging.',
            'Try varying your sentence structure for better flow.',
            'Your vocabulary is appropriate for the difficulty level.',
          ],
          difficulty: 'intermediate',
        },
      };
    }
  },

  // AI-powered story suggestions based on user level
  generateStoryPrompts: async (
    userLevel: 'beginner' | 'intermediate' | 'advanced',
    topic?: string
  ): Promise<ApiResponse<string[]>> => {
    try {
      const params = new URLSearchParams({
        userLevel,
        ...(topic && { topic })
      });
      
      const response = await api.get(`/ai/story-prompts?${params}`);
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('AI prompt generation failed:', error);
      
      // Fallback to mock prompts if API fails
      const fallbackPrompts = {
        beginner: [
          'Write about your daily routine at school or work',
          'Describe your favorite food and why you like it',
          'Tell a story about a friendly animal you met',
          'Write about your best friend and what makes them special',
          'Describe a fun day you spent with your family'
        ],
        intermediate: [
          'Write about a memorable travel experience you had',
          'Describe a challenging situation you overcame',
          'Tell a story about an unexpected friendship',
          'Write about a time when you helped someone',
          'Describe your dream job and why you want it'
        ],
        advanced: [
          'Explore the concept of time travel in a short story',
          'Write about the ethical implications of artificial intelligence',
          'Create a story that examines human nature through conflict',
          'Discuss the impact of social media on modern relationships',
          'Write about the consequences of climate change on future generations'
        ],
      };

      return {
        success: true,
        data: fallbackPrompts[userLevel] || fallbackPrompts.beginner,
      };
    }
  },

  // AI vocabulary suggestions based on story content
  suggestVocabulary: async (
    story: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<ApiResponse<Array<{ word: string; definition: string; example: string }>>> => {
    try {
      const response = await api.post('/ai/vocabulary', { story, userLevel });
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('AI vocabulary suggestion failed:', error);
      
      // Mock vocabulary suggestions based on user level
      const vocabularyByLevel = {
        beginner: [
          {
            word: 'happy',
            definition: 'feeling or showing pleasure',
            example: 'I am happy to see you.',
          },
          {
            word: 'beautiful',
            definition: 'pleasing to look at; attractive',
            example: 'The sunset is beautiful today.',
          },
          {
            word: 'interesting',
            definition: 'arousing curiosity or interest',
            example: 'This book is very interesting.',
          },
        ],
        intermediate: [
          {
            word: 'magnificent',
            definition: 'extremely beautiful, elaborate, or impressive',
            example: 'The view from the mountain top was magnificent.',
          },
          {
            word: 'persevere',
            definition: 'continue in a course of action even in the face of difficulty',
            example: 'She decided to persevere despite the challenges.',
          },
          {
            word: 'remarkable',
            definition: 'worthy of attention; striking',
            example: 'His improvement in English has been remarkable.',
          },
        ],
        advanced: [
          {
            word: 'serendipitous',
            definition: 'occurring or discovered by chance in a happy way',
            example: 'Their meeting was serendipitous and changed both their lives.',
          },
          {
            word: 'quintessential',
            definition: 'representing the most perfect example of a quality',
            example: 'Paris is the quintessential romantic city.',
          },
          {
            word: 'ubiquitous',
            definition: 'present, appearing, or found everywhere',
            example: 'Smartphones have become ubiquitous in modern society.',
          },
        ],
      };
      
      return {
        success: true,
        data: vocabularyByLevel[userLevel] || vocabularyByLevel.beginner,
      };
    }
  },
};
