export const PATH = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/:username",
  EDIT_PROFILE: "/:username/edit",
  FORGET_PASSWORD: "/forget-password",
  MESSAGES: "/direct/inbox",
  SETTINGS: "/settings",
  BOOKMARKS: "/bookmarks",
};

// Helper function to generate dynamic routes
export const generateRoute = (
  route: string,
  params: Record<string, string>
) => {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return path;
};
