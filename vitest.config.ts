import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    {
      name: "mock-styles",
      transform(_code: string, id: string) {
        if (/\.(css|scss|sass)(\?.*)?$/.test(id)) {
          return { code: "export default {}", map: null };
        }
      },
    },
  ],
  test: {
    globals: false,
    environment: "jsdom",
    include: ["**/*.{test,spec}.{js,ts}"],
  },
});
