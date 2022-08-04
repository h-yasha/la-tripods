/* eslint-disable no-underscore-dangle */
import path from "path";
import axios from "axios";
import urlJoin from "url-join";
import { existsSync } from "fs";
import { mkdir, stat, writeFile } from "fs/promises";
import { cloneDeep } from "lodash";
import { PapunikaClassData } from "@/types";
import { LostArkClassId } from "@/constants";
import { AsyncPool } from "@/utils/asyncPool";

import { getClassSkills } from "./classData";

const ASSETS_DIR = "../public/assets";

const PAPUNIKA_ASSETS_BASE = "https://papunika.com/assets/";

const pool = new AsyncPool(250);

const saveImageAsset = async (url: string) => {
  console.log("Downloading:", url);
  const fileName = url.split("/").at(-1);
  if (!fileName) throw new Error(`${url}: Invalid fileName`);

  const fileDirPath = path.join(__dirname, ASSETS_DIR, "images");
  const filePath = path.join(fileDirPath, fileName);
  const responseHead = await axios.head(url);

  if (responseHead.headers["Content-Length"]) {
    if (existsSync(filePath)) {
      const fileStat = await stat(filePath);
      if (fileStat.size === +responseHead.headers["Content-Length"]) {
        console.log(" - ", fileName, "Exists");
        return;
      }
    }
  }

  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  if (response.data) {
    await mkdir(fileDirPath, { recursive: true });
    writeFile(filePath, response.data);
  } else throw new Error(`${fileName} fetch failed`);
};

class PapunikaClassDataThing {
  classId: number;

  state: PapunikaClassData["data"] | null = null;

  constructor(
    classId: PapunikaClassDataThing["classId"],
    state?: PapunikaClassDataThing["state"]
  ) {
    this.classId = classId;
    if (state) this.state = cloneDeep(state);
  }

  async fetch() {
    this.state = (await getClassSkills(this.classId.toString())).data;

    return this;
  }

  withoutAwakening() {
    if (!this.state) throw Error("");

    const newState = this.state.filter(({ isAwakening }) => !+isAwakening);
    return new PapunikaClassDataThing(this.classId, newState);
  }

  async fetchImages() {
    if (!this.state) throw new Error("");

    // eslint-disable-next-line no-restricted-syntax
    for (const skill of this.state) {
      const skillIcon = urlJoin(PAPUNIKA_ASSETS_BASE, skill.iconPath);

      const tripodsIcon = Object.values(skill.tripodList)
        .map((tripodList) =>
          Object.values(tripodList)
            .filter(({ icon }) => !!icon)
            .map(({ icon }) => urlJoin(PAPUNIKA_ASSETS_BASE, icon))
        )
        .flat();

      // download
      pool.add(() => saveImageAsset(skillIcon));
      tripodsIcon.forEach((icon) => pool.add(() => saveImageAsset(icon)));
    }
  }

  saveObjectifiedSkills() {
    if (!this.state) throw new Error(`${this.classId} state is missing`);

    const skills = Object.fromEntries(
      this.state.map((skill) => [
        skill.id,
        {
          name: skill.name,
          iconPath: `/assets/images/${skill.iconPath.split("/").at(-1)}`,
          tripods: Object.assign(
            {},
            ...Object.values(skill.tripodList)
              .map((tripodList) =>
                Object.fromEntries(
                  Object.values(tripodList).map((tripod) => [
                    tripod.name,
                    {
                      icon: `/assets/images/${tripod.icon.split("/").at(-1)}`,
                      ranks: tripod.descriptionPvE.length,
                    },
                  ])
                )
              )
              .flat()
          ),
        },
      ])
    );

    writeFile(
      path.join(__dirname, ASSETS_DIR, `${this.classId.toString()}.json`),
      JSON.stringify(skills)
    );

    return this;
  }
}

const main = async () => {
  const LostArkClasses = Object.entries(LostArkClassId);

  LostArkClasses.forEach(async ([, classId]) => {
    if (+classId === 602) return;
    const instance = await new PapunikaClassDataThing(classId).fetch();
    await instance.saveObjectifiedSkills(); // .fetchImages();
  });
};

main();

export default main;
