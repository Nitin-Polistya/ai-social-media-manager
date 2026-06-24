
export interface ScheduledPost {
  id: string;
  platform: string;
  caption: string;
  hashtags: string[];
  cta: string;
  imageUrl?: string;
  scheduledDate: string; // ISO date string
  status: "scheduled" | "posted" | "failed";
}

export interface SchedulePostRequest {
  platform: string;
  caption: string;
  hashtags: string[];
  cta: string;
  imageUrl?: string;
  scheduledDate: string;
}
