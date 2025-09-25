import type { Config } from "@react-router/dev/config";

export default {
  // Otherwise Error: Could not find (...) "app/root.tsx"
  appDirectory: "src/app",

  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
} satisfies Config;
