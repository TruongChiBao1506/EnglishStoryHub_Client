import api from '../utils/api';
import { 
  UserStats, 
  LeaderboardResponse, 
  Achievement
} from '../types';

// Get current user's stats
export const getUserStats = async (): Promise<UserStats> => {
  const response = await api.get('/user-stats/my-stats');
  return response.data.data;
};

// Get user's achievements
export const getUserAchievements = async (): Promise<{
  achievements: Achievement[];
  totalAchievements: number;
  totalPointsFromAchievements: number;
  categories: {
    writing: number;
    social: number;
    milestone: number;
    special: number;
  };
}> => {
  const response = await api.get('/user-stats/my-achievements');
  return response.data.data;
};

// Get leaderboard
export const getLeaderboard = async (
  page: number = 1, 
  limit: number = 10
): Promise<LeaderboardResponse['data']> => {
  const response = await api.get(`/user-stats/leaderboard?page=${page}&limit=${limit}`);
  return response.data.data;
};

// Get public user stats (for viewing other users)
export const getPublicUserStats = async (userId: string): Promise<UserStats> => {
  const response = await api.get(`/user-stats/profile/${userId}/stats`);
  return response.data.data;
};

const statsService = {
  getUserStats,
  getUserAchievements,
  getLeaderboard,
  getPublicUserStats,
};

export default statsService;
