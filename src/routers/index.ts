import { router as trpcRouter } from "@trpc/server";
import classRouter from "./class";

const router = trpcRouter().merge("class.", classRouter);

export default router;
