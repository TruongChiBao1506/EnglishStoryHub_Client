import api from '../utils/api';
import { Story, StoriesResponse, StoryResponse, StoryLikeResponse, ApiResponse, StoryCreateResponse } from '../types';

export const storyService = {
  getStories: async (params?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    search?: string;
    sortBy?: string;
  }): Promise<StoriesResponse> => {
    const response = await api.get('/stories', { params });
    return response.data;
  },

  getStoryById: async (id: string): Promise<StoryResponse> => {
    const response = await api.get(`/stories/${id}`);
    return response.data;
  },

  createStory: async (storyData: {
    title: string;
    content: string;
    excerpt: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
  }): Promise<StoryCreateResponse> => {
    const response = await api.post('/stories', storyData);
    return response.data;
  },

  updateStory: async (id: string, storyData: Partial<Story>): Promise<ApiResponse<Story>> => {
    const response = await api.put(`/stories/${id}`, storyData);
    return response.data;
  },

  deleteStory: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/stories/${id}`);
    return response.data;
  },

  likeStory: async (id: string): Promise<StoryLikeResponse> => {
    const response = await api.post(`/stories/${id}/like`);
    return response.data;
  },

  getFeaturedStories: async (): Promise<StoriesResponse> => {
    const response = await api.get('/stories?featured=true');
    return response.data;
  }
};
