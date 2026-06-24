
export interface AnalyticsEntry {
  id: string;
  postId: string;
  platform: string;
  timestamp: string; // ISO date string
  likes: number;
  comments: number;
  shares: number;
  views?: number; // For video posts
  clicks?: number; // For link posts
}

export interface PostPerformance {
  postId: string;
  platform: string;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalViews?: number;
  totalClicks?: number;
  engagementRate: number;
  recommendations: string[];
}
