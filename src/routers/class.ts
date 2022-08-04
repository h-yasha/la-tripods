import { router as trpcRouter } from "@trpc/server";
import { z } from "zod";
import { LostArkClassId } from "@/constants";
import axios from "axios";
import { PapunikaClassData } from "@/types";

const classRouter = trpcRouter().query("", {
  input: z.nativeEnum(LostArkClassId),
  resolve: async ({ input }) => {
    const response = await axios.get<PapunikaClassData>(
      `https://papunika.com/wp-content/themes/squadforce-child/loaplanner/php/requests/skills/${input.toString()}`,
      {
        headers: {
          referer: "https://papunika.com/planner/",
        },
      }
    );
    console.log(response);
    return response.data;
  },
});

export interface Tripod {
  icon: string;
  ranks: number;
}

export interface ClassSkills {
  name: string;
  iconPath: string;
  tripods: { [key: string]: Tripod };
}

const localClassRouter = trpcRouter().query("local", {
  input: z.nativeEnum(LostArkClassId),
  resolve: async ({ input }) =>
    import(`../../public/assets/${input}.json`) as Promise<
      Record<string, ClassSkills>
    >,
});

export default trpcRouter().merge("", classRouter).merge("", localClassRouter);
