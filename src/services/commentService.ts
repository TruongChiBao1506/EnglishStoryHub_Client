import api from '../utils/api';
import { Comment, ApiResponse } from '../types';

export const commentService = {
  getStoryComments: async (storyId: string): Promise<ApiResponse<Comment[]>> => {
    const response = await api.get(`/comments/story/${storyId}`);
    return response.data;
  },

  createComment: async (storyId: string, content: string): Promise<ApiResponse<Comment>> => {
    const response = await api.post(`/comments/story/${storyId}`, { content });
    return response.data;
  },

  updateComment: async (commentId: string, content: string): Promise<ApiResponse<Comment>> => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  likeComment: async (commentId: string): Promise<ApiResponse<Comment>> => {
    const response = await api.post(`/comments/${commentId}/like`);
    return response.data;
  }
};
