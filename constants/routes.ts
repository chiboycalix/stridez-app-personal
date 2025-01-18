export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/auth?tab=signin",
  SIGN_UP: "/auth?tab=signup",
  FORGOT_PASSWORD: "/auth/forgot-password",
  SETUP_PROFILE: "/setup-profile",
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
    ROOT: "/video-conferencing",
    WAITING_ROOM: "/video-conferencing/waiting-room",
    WAITING_ROOM_CHANNEL: (channelName: string) =>
      `/video-conferencing/waiting-room/${channelName}`,
    SCHEDULE: "/video-conferencing/schedule",
    LIVE: "/video-conferencing/live",
    LEAVE_MEETING: "/video-conferencing/leave-meeting",
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
