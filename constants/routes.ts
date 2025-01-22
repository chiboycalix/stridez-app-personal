export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/auth?tab=signin",
  SIGN_UP: "/auth?tab=signup",
  FORGOT_PASSWORD: "/auth/forgot-password",
  SETUP_PROFILE: "/setup",
  SELECT_INTERESTS: "/select-interests",
  VALIDATE_OTP: (email: string) => `/auth/validate-otp?email=${email}`,

  LIVE: "/live",
  SCHEDULE: "/schedule",
  SCHEDULE_DETAILS: (id: string) => `/schedule/details/${id}`,
  UPLOADS: "/uploads",
  PROFILE: (id: string) => `/profile/${id}`,
  POSTS: (id: string) => `/posts/${id}`,

  COURSES: "/courses",
  COURSE_DETAILS: (id: string) => `/courses/${id}`,
  COURSE: (id: string) => `/course/${id}`,

  STREAMING: (id: string) => `/streaming/${id}`,
  VIDEO_CONFERENCING: {
    MEETING: "/meeting",
    MEETING_CHANNEL: (channelName: string) => `/meeting/${channelName}`,
    SCHEDULE: "/meeting/schedule",
    LIVE: "/meeting/live",
    LEAVE_MEETING: "/meeting/leave-meeting",
  },

  MARKETPLACE: "/market-place",

  CLASSROOM: {
    OVERVIEW: "/classroom/overview",
    COURSES: "/classroom/courses",
    TRAINEE: "/classroom/trainee",
    MESSAGING: "/classroom/messaging",
    COMMUNITIES: "/classroom/communities",
    ANALYTICS: "/classroom/analytics",
    MY_LEARNING: "/classroom/my-learning",
  },
};
