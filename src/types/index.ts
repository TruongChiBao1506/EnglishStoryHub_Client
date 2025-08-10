// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  isActive: boolean;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Story types
export interface Story {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: User;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  likes: string[];
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  language: string;
  estimatedReadTime: number;
  createdAt: string;
  updatedAt: string;
}

// Comment types
export interface Comment {
  _id: string;
  content: string;
  author: User;
  story: string;
  likes: string[];
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface StoriesResponse {
  success: boolean;
  stories: Story[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalStories: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface StoryResponse {
  success: boolean;
  story: Story;
  message?: string;
  error?: string;
}

export interface StoryLikeResponse {
  success: boolean;
  message: string;
  likesCount: number;
  hasLiked: boolean;
  error?: string;
}

// Points & Achievement types
export interface Achievement {
  _id: string;
  user: string;
  achievementId: string;
  title: string;
  description: string;
  badge: string;
  pointsAwarded: number;
  category: 'writing' | 'social' | 'milestone' | 'special';
  unlockedAt: string;
}

export interface LevelInfo {
  level: 'beginner' | 'intermediate' | 'advanced';
  name: string;
  badge: string;
  min: number;
  max: number;
  points: number;
  color: string;
  nextLevel?: {
    level: string;
    name: string;
    pointsNeeded: number;
  };
}

export interface UserStats {
  user: {
    username: string;
    avatar?: string;
    bio?: string;
    level: string;
    points: number;
  };
  rank: number;
  levelInfo: LevelInfo;
  stats: {
    storiesPublished: number;
    totalLikes: number;
    totalViews: number;
    commentsPosted?: number;
    memberSince?: string;
  };
  achievements?: {
    achievements: Achievement[];
    totalAchievements: number;
    totalPointsFromAchievements: number;
    categories: {
      writing: number;
      social: number;
      milestone: number;
      special: number;
    };
  };
  recentAchievements?: Achievement[];
}

export interface LeaderboardUser {
  _id: string;
  username: string;
  avatar?: string;
  points: number;
  level: string;
  rank: number;
  levelInfo: LevelInfo;
  createdAt: string;
}

export interface LeaderboardResponse {
  success: boolean;
  data: {
    leaderboard: LeaderboardUser[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalUsers: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface StoryCreateResponse {
  success: boolean;
  message: string;
  data: {
    story: Story;
    pointsEarned: number;
    newAchievements: {
      title: string;
      badge: string;
      points: number;
    }[];
    levelUp?: {
      from: string;
      to: string;
      badge: string;
      name: string;
    };
    userStats: {
      totalPoints: number;
      level: string;
      levelName: string;
      nextLevel?: {
        level: string;
        name: string;
        pointsNeeded: number;
      };
    };
  };
}
