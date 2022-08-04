import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "../pages/api/trpc/[trpc]";

export default createReactQueryHooks<AppRouter>();
