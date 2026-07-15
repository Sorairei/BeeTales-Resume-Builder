import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const [owner = "", repository = ""] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
const isUserSite = repository.toLowerCase() === `${owner.toLowerCase()}.github.io`;
const pagesBase = process.env.GITHUB_ACTIONS === "true" && repository && !isUserSite ? `/${repository}/` : "/";

export default defineConfig({
  plugins: [react()],
  base: pagesBase,
});
