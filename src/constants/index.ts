export const classList = [
  {
    label: "Berserker",
    value: "berserker",
  },
  {
    label: "Destroyer",
    value: "destroyer",
  },
  {
    label: "Gunlancer",
    value: "gunlancer",
  },
  {
    label: "Paladin",
    value: "paladin",
  },
  {
    label: "Arcanist",
    value: "arcanist",
  },
  {
    label: "Summoner",
    value: "summoner",
  },
  {
    label: "Bard",
    value: "bard",
  },
  {
    label: "Sorceress",
    value: "sorceress",
  },
  {
    label: "Wardancer",
    value: "wardancer",
  },
  {
    label: "Scrapper",
    value: "scrapper",
  },
  {
    label: "Soulfist",
    value: "soulfist",
  },
  {
    label: "Glaivier",
    value: "glaivier",
  },
  {
    label: "Striker",
    value: "striker",
  },
  {
    label: "Death Blade",
    value: "deathBlade",
  },
  {
    label: "Shadow Hunter",
    value: "shadowHunter",
  },
  {
    label: "Reaper",
    value: "reaper",
  },
  {
    label: "Sharp Shooter",
    value: "sharpShooter",
  },
  {
    label: "Deadeye",
    value: "deadeye",
  },
  {
    label: "Artillerist",
    value: "artillerist",
  },
  {
    label: "Machinist",
    value: "machinist",
  },
  {
    label: "Gunslinger",
    value: "gunslinger",
  },
  // {
  //   label: "Artist",
  //   value: "Artist",
  // },
] as const;

export type ClassMapper<T = string> = {
  readonly // eslint-disable-next-line no-unused-vars
  [key in typeof classList[number]["value"]]: T;
};

export const LostArkClassId = {
  berserker: 102,
  destroyer: 103,
  gunlancer: 104,
  paladin: 105,
  arcanist: 202,
  summoner: 203,
  bard: 204,
  sorceress: 205,
  wardancer: 302,
  scrapper: 303,
  soulfist: 304,
  glaivier: 305,
  striker: 312,
  deathBlade: 402,
  shadowHunter: 403,
  reaper: 404,
  sharpShooter: 502,
  deadeye: 503,
  artillerist: 504,
  machinist: 505,
  gunslinger: 512,
  // Artist: 602,
} as const;

export const equipmentTypes: string[] = [
  "Helmet",
  "Shoulder",
  "Armor",
  "Pants",
  "Gloves",
  "Weapon",
];
