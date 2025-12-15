import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://ai-chatbot-api-ten.vercel.app/api",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      api.dispatch(logOut());
      return result;
    }

    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "POST", body: { refreshToken } },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { accessToken } = refreshResult.data;
      const user = api.getState().auth.user;
      api.dispatch(setCredentials({ user, token: accessToken, refreshToken }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Project",
    "Blog",
    "Contact",
    "Query",
    "Skill",
    "Note",
    "QuickLink",
    "Training",
    "ActivityLog",
    "Stat",
    "ChatUser",
    "ChatHistory",
    "CodeLog",
    "Task",
    "Goal",
    "Expense",
    "Library",
    "PromptStorage",
    "Setting",
    "About",
  ],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    // Users
    getUsers: builder.query({
      query: () => "/users",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User", id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    // Projects
    getProjects: builder.query({
      query: () => "/projects",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Project", id })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),
    createProject: builder.mutation({
      query: (data) => ({
        url: "/projects",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),

    // Blogs
    getBlogs: builder.query({
      query: () => "/blogs",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Blog", id })),
              { type: "Blog", id: "LIST" },
            ]
          : [{ type: "Blog", id: "LIST" }],
    }),
    getBlog: builder.query({
      query: (id) => `/blogs/${id}`,
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),
    createBlog: builder.mutation({
      query: (data) => ({
        url: "/blogs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),
    updateBlog: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/blogs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
      ],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
      ],
    }),

    // Contacts
    getContacts: builder.query({
      query: () => "/contact",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Contact", id })),
              { type: "Contact", id: "LIST" },
            ]
          : [{ type: "Contact", id: "LIST" }],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Contact", id },
        { type: "Contact", id: "LIST" },
      ],
    }),

    // User Queries
    getUserQueries: builder.query({
      query: () => "/queries",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Query", id })),
              { type: "Query", id: "LIST" },
            ]
          : [{ type: "Query", id: "LIST" }],
    }),
    deleteUserQuery: builder.mutation({
      query: (id) => ({
        url: `/queries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Query", id },
        { type: "Query", id: "LIST" },
      ],
    }),

    // Skills
    getSkills: builder.query({
      query: () => "/skills",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Skill", id })),
              { type: "Skill", id: "LIST" },
            ]
          : [{ type: "Skill", id: "LIST" }],
    }),
    createSkill: builder.mutation({
      query: (data) => ({
        url: "/skills",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Skill", id: "LIST" }],
    }),
    updateSkill: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/skills/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Skill", id },
        { type: "Skill", id: "LIST" },
      ],
    }),
    deleteSkill: builder.mutation({
      query: (id) => ({
        url: `/skills/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Skill", id },
        { type: "Skill", id: "LIST" },
      ],
    }),

    // Notes
    getNotes: builder.query({
      query: () => "/notes",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Note", id })),
              { type: "Note", id: "LIST" },
            ]
          : [{ type: "Note", id: "LIST" }],
    }),
    createNote: builder.mutation({
      query: (data) => ({
        url: "/notes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),
    updateNote: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/notes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Note", id },
        { type: "Note", id: "LIST" },
      ],
    }),
    deleteNote: builder.mutation({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Note", id },
        { type: "Note", id: "LIST" },
      ],
    }),

    // QuickLinks
    getQuickLinks: builder.query({
      query: () => "/quicklinks",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "QuickLink", id })),
              { type: "QuickLink", id: "LIST" },
            ]
          : [{ type: "QuickLink", id: "LIST" }],
    }),
    createQuickLink: builder.mutation({
      query: (data) => ({
        url: "/quicklinks",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "QuickLink", id: "LIST" }],
    }),
    updateQuickLink: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/quicklinks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "QuickLink", id },
        { type: "QuickLink", id: "LIST" },
      ],
    }),
    deleteQuickLink: builder.mutation({
      query: (id) => ({
        url: `/quicklinks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "QuickLink", id },
        { type: "QuickLink", id: "LIST" },
      ],
    }),

    // Training
    getTrainings: builder.query({
      query: () => "/train",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Training", id })),
              { type: "Training", id: "LIST" },
            ]
          : [{ type: "Training", id: "LIST" }],
    }),
    getTraining: builder.query({
      query: (id) => `/train/${id}`,
      providesTags: (result, error, id) => [{ type: "Training", id }],
    }),
    createTraining: builder.mutation({
      query: (data) => ({
        url: "/train",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Training", id: "LIST" }],
    }),
    updateTraining: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/train/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Training", id },
        { type: "Training", id: "LIST" },
      ],
    }),
    deleteTraining: builder.mutation({
      query: (id) => ({
        url: `/train/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Training", id },
        { type: "Training", id: "LIST" },
      ],
    }),

    // Chat
    createChat: builder.mutation({
      query: (data) => ({
        url: "/chat",
        method: "POST",
        body: data,
      }),
    }),

    // Activity Logs
    getActivityLogs: builder.query({
      query: () => "/activity-logs",
      providesTags: ["ActivityLog"],
    }),

    // Stats
    getStats: builder.query({
      query: () => "/stats",
      providesTags: ["Stat"],
    }),

    // Chat Users
    getChatUsers: builder.query({
      query: () => "/chat/users",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "ChatUser", id })),
              { type: "ChatUser", id: "LIST" },
            ]
          : [{ type: "ChatUser", id: "LIST" }],
    }),
    deleteChatUser: builder.mutation({
      query: (id) => ({
        url: `/chat/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ChatUser", id },
        { type: "ChatUser", id: "LIST" },
      ],
    }),

    // Chat History
    getChatHistories: builder.query({
      query: () => "/chat/histories",
      providesTags: ["ChatHistory"],
    }),
    deleteChatHistory: builder.mutation({
      query: ({ userId, chatId }) => ({
        url: `/chat/history/${userId}/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ChatHistory"],
    }),

    // Code Logs
    getCodeLogs: builder.query({
      query: () => "/code-log",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "CodeLog", id })),
              { type: "CodeLog", id: "LIST" },
            ]
          : [{ type: "CodeLog", id: "LIST" }],
    }),
    getCodeLog: builder.query({
      query: (id) => `/code-log/${id}`,
      providesTags: (result, error, id) => [{ type: "CodeLog", id }],
    }),
    createCodeLog: builder.mutation({
      query: (data) => ({
        url: "/code-log",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "CodeLog", id: "LIST" }],
    }),
    updateCodeLog: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/code-log/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "CodeLog", id },
        { type: "CodeLog", id: "LIST" },
      ],
    }),
    deleteCodeLog: builder.mutation({
      query: (id) => ({
        url: `/code-log/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "CodeLog", id },
        { type: "CodeLog", id: "LIST" },
      ],
    }),

    // Tasks
    getTasks: builder.query({
      query: () => "/tasks",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Task", id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),
    createTask: builder.mutation({
      query: (data) => ({
        url: "/tasks",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),

    // Goals
    getGoals: builder.query({
      query: () => "/goals",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Goal", id })),
              { type: "Goal", id: "LIST" },
            ]
          : [{ type: "Goal", id: "LIST" }],
    }),
    createGoal: builder.mutation({
      query: (data) => ({
        url: "/goals",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Goal", id: "LIST" }],
    }),
    updateGoal: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/goals/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Goal", id },
        { type: "Goal", id: "LIST" },
      ],
    }),
    deleteGoal: builder.mutation({
      query: (id) => ({
        url: `/goals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Goal", id },
        { type: "Goal", id: "LIST" },
      ],
    }),
    createKeyResult: builder.mutation({
      query: ({ goalId, ...data }) => ({
        url: `/goals/${goalId}/key-results`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { goalId }) => [
        { type: "Goal", id: goalId },
      ],
    }),
    updateKeyResult: builder.mutation({
      query: ({ goalId, krId, ...data }) => ({
        url: `/goals/${goalId}/key-results/${krId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { goalId }) => [
        { type: "Goal", id: goalId },
      ],
    }),
    deleteKeyResult: builder.mutation({
      query: ({ goalId, krId }) => ({
        url: `/goals/${goalId}/key-results/${krId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { goalId }) => [
        { type: "Goal", id: goalId },
      ],
    }),

    // Expenses
    getExpenses: builder.query({
      query: () => "/expenses",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Expense", id })),
              { type: "Expense", id: "LIST" },
            ]
          : [{ type: "Expense", id: "LIST" }],
    }),
    createExpense: builder.mutation({
      query: (data) => ({
        url: "/expenses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Expense", id: "LIST" }],
    }),
    updateExpense: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/expenses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Expense", id },
        { type: "Expense", id: "LIST" },
      ],
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Expense", id },
        { type: "Expense", id: "LIST" },
      ],
    }),

    // Library
    getLibraries: builder.query({
      query: () => "/library",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Library", id })),
              { type: "Library", id: "LIST" },
            ]
          : [{ type: "Library", id: "LIST" }],
    }),
    createLibrary: builder.mutation({
      query: (data) => ({
        url: "/library",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Library", id: "LIST" }],
    }),
    updateLibrary: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/library/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Library", id },
        { type: "Library", id: "LIST" },
      ],
    }),
    deleteLibrary: builder.mutation({
      query: (id) => ({
        url: `/library/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Library", id },
        { type: "Library", id: "LIST" },
      ],
    }),

    // Prompt Storage
    getPromptStorages: builder.query({
      query: () => "/prompt-storage",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PromptStorage", id })),
              { type: "PromptStorage", id: "LIST" },
            ]
          : [{ type: "PromptStorage", id: "LIST" }],
    }),
    getPromptStorage: builder.query({
      query: (id) => `/prompt-storage/${id}`,
      providesTags: (result, error, id) => [{ type: "PromptStorage", id }],
    }),
    createPromptStorage: builder.mutation({
      query: (data) => ({
        url: "/prompt-storage",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "PromptStorage", id: "LIST" }],
    }),
    updatePromptStorage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/prompt-storage/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PromptStorage", id },
        { type: "PromptStorage", id: "LIST" },
      ],
    }),
    deletePromptStorage: builder.mutation({
      query: (id) => ({
        url: `/prompt-storage/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "PromptStorage", id },
        { type: "PromptStorage", id: "LIST" },
      ],
    }),

    // Settings
    getSettings: builder.query({
      query: () => "/settings",
      providesTags: ["Setting"],
    }),
    updateSettings: builder.mutation({
      query: (data) => ({
        url: "/settings",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Setting"],
    }),

    // About
    getAbouts: builder.query({
      query: () => "/about",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "About", id })),
              { type: "About", id: "LIST" },
            ]
          : [{ type: "About", id: "LIST" }],
    }),
    createAbout: builder.mutation({
      query: (data) => ({
        url: "/about",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "About", id: "LIST" }],
    }),
    updateAbout: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/about/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "About", id },
        { type: "About", id: "LIST" },
      ],
    }),
    deleteAbout: builder.mutation({
      query: (id) => ({
        url: `/about/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "About", id },
        { type: "About", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetContactsQuery,
  useDeleteContactMutation,
  useGetUserQueriesQuery,
  useDeleteUserQueryMutation,
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useGetQuickLinksQuery,
  useCreateQuickLinkMutation,
  useUpdateQuickLinkMutation,
  useDeleteQuickLinkMutation,
  useGetTrainingsQuery,
  useGetTrainingQuery,
  useCreateTrainingMutation,
  useUpdateTrainingMutation,
  useDeleteTrainingMutation,
  useCreateChatMutation,
  useGetActivityLogsQuery,
  useGetStatsQuery,
  useGetChatUsersQuery,
  useDeleteChatUserMutation,
  useGetChatHistoriesQuery,
  useDeleteChatHistoryMutation,
  useGetCodeLogsQuery,
  useGetCodeLogQuery,
  useCreateCodeLogMutation,
  useUpdateCodeLogMutation,
  useDeleteCodeLogMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetGoalsQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
  useCreateKeyResultMutation,
  useUpdateKeyResultMutation,
  useDeleteKeyResultMutation,
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetLibrariesQuery,
  useCreateLibraryMutation,
  useUpdateLibraryMutation,
  useDeleteLibraryMutation,
  useGetPromptStoragesQuery,
  useGetPromptStorageQuery,
  useCreatePromptStorageMutation,
  useUpdatePromptStorageMutation,
  useDeletePromptStorageMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetAboutsQuery,
  useCreateAboutMutation,
  useUpdateAboutMutation,
  useDeleteAboutMutation,
} = apiSlice;
