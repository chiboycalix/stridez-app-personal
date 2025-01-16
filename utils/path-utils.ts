import { ROUTES } from "@/constants/routes";

const getAllRoutes = (obj: any): string[] => {
  return Object.values(obj).reduce((acc: string[], value) => {
    if (typeof value === "string") {
      acc.push(value.split("?")[0]);
    } else if (typeof value === "object" && value !== null) {
      acc.push(...getAllRoutes(value));
    }
    return acc;
  }, []);
};

export const LAYOUT_PATHS = [
  ...getAllRoutes(ROUTES),
  "/schedule/details/*",
  "/profile/*",
  "/posts/*",
  "/courses/*",
  "/course/*",
  "/streaming/*",
  "/classroom/*",
  "/video-conferencing/*",
].filter((path) => !path.startsWith("/auth"));

export const shouldUseMainLayout = (pathname: string): boolean => {
  return LAYOUT_PATHS.some((pattern) => {
    const regexPattern =
      pattern.replace(/\*/g, ".*").replace(/\//g, "\\/") + "$";
    const regex = new RegExp(`^${regexPattern}`);
    return regex.test(pathname);
  });
};
