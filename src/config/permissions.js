// Define allowed routes per role
export const rolePermissions = {
  superAdmin: "all",
  admin: {
    exclude: ["/users"],
  },
  user: {
    allow: [
      "/dashboard",
      "/profile",
      "/settings",
      "/tasks",
      "/library",
      "/code-log",
      "/prompt-storage",
      "/md-to-pdf",
      "/rich-text-editor",
      "/json-formatter",
      "/expense-tracker",
      "/notes",
      "/quicklinks",
      "/pomodoro-timer",
      "/goal-setting",
      "/about",
      "/projects",
      "/blogs",
      "/skills",
      "/training",
      "/contact",
      "/queries",
      "/chat",
    ],
  },
};
