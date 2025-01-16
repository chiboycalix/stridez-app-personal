export type UserProfile = {
  id: number;
  username: string;
  followers: number;
  following: number;
};

export type Course = {
  id: number;
  title: string;
  description?: string;
  type: string;
  meta: {
    totalCount: number;
  };
};

export type Post = {
  id: number;
  mediaResource?: { mimeType: string; url: string }[];
};

export type MyLearning = { id: string; title: string };
