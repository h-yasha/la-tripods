import path from "path";
import axios from "axios";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { PapunikaClassData } from "@/types";

export const getClassSkills = async (classId: string) => {
  const tempPath = path.join(__dirname, ".temp");
  const tempFilePath = path.join(tempPath, classId);
  const tempExists = existsSync(tempFilePath);

  if (tempExists)
    return JSON.parse(
      readFileSync(tempFilePath).toString("utf-8")
    ) as PapunikaClassData;

  const response = await axios.get<PapunikaClassData>(
    `https://papunika.com/wp-content/themes/squadforce-child/loaplanner/php/requests/skills/${classId}`,
    {
      headers: {
        referer: "https://papunika.com/planner/",
      },
    }
  );

  mkdirSync(tempPath, { recursive: true });
  writeFileSync(tempFilePath, JSON.stringify(response.data));

  return response.data;
};

export default undefined;
