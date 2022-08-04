import React from "react";

export type FCProps<T = {}> = { children?: React.ReactNode } & T;

export type Option<T = string, P = {}> = {
  label: string;
  value: T;
} & P;

export type ReadonlyOption<T = string, P = {}> = {
  readonly label: string;
  readonly value: T;
} & Readonly<P>;

export const EquipmentTypes = [
  "Helmet",
  "Shoulder",
  "Armor",
  "Pant",
  "Glove",
  "Weapon",
] as const;

export const TripodLevels = ["1", "2", "3", "4", "5"] as const;

export interface Tripod {
  skill: string | undefined;
  tripod: string | undefined;
  level: typeof TripodLevels[number];
}

export interface Equipment {
  label: string;
  type: typeof EquipmentTypes[number];
  tripods: {
    [key: string]: Tripod;
  };

  edit: boolean;
}

export interface Equipments {
  [key: string]: Equipment;
}

export interface PapunikaClassData {
  data: {
    id: string;
    classId: string;
    name: string;
    maxLevel: `${number}`;
    iconPath: string;
    mana: string[];
    cooldown: `${number}`[];
    effectList: string;
    description: string[];
    isAwakening: "0" | "1";
    patchLevel: string;
    tripodList: {
      // eslint-disable-next-line no-unused-vars
      [tripodListIndex in `tripodList${number}`]: {
        // eslint-disable-next-line no-unused-vars
        [key in `${number}`]: {
          name: string;
          icon: string;
          descriptionPvE: string[];
          descriptionPvP: string[];
        };
      };
    };
  }[];
}

export interface Filter {
  filterSkill?: Tripod["skill"];
  filterTripod?: Tripod["tripod"];
  filterLevel?: Tripod["level"];
}
