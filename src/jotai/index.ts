import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

import trpc from "@/utils/trpc";
import { Equipment, Equipments, Filter, Tripod } from "@/types";
import { InferQueryOutput } from "@/types/trpc";
import { LostArkClassId, classList } from "@/constants";

export const playerClassAtom = atomWithStorage<typeof classList[number]>(
  "playerClass",
  classList[0]
);

export const equipmentsAtom = atomWithStorage<Equipments>(
  "equipments",
  {},
  { ...createJSONStorage(() => localStorage), delayInit: true }
);

const generateEmptyTripod = (): Equipment["tripods"] => ({
  [crypto.randomUUID()]: {
    skill: undefined,
    tripod: undefined,
    level: "1",
  },
});

const generateEmptyEquipment = (): Equipment => ({
  label: "Storage #1",
  type: "Helmet",
  tripods: {},
  edit: true,
});

export const useEquipments = () => {
  const [value, setValue] = useAtom(equipmentsAtom);

  const addEmptySlot = () =>
    setValue({ ...value, [crypto.randomUUID()]: generateEmptyEquipment() });

  const addTripod = (uuid: string) => {
    const tempValue = _.cloneDeep(value);
    tempValue[uuid].tripods = {
      ...tempValue[uuid].tripods,
      ...generateEmptyTripod(),
    };
    setValue(tempValue);
  };

  const updateTripod = (
    itemUuid: string,
    tripodUuid: string,
    tripodValue: Equipment["tripods"][string]
  ) => {
    const tempValue = _.cloneDeep(value);
    tempValue[itemUuid].tripods[tripodUuid] = tripodValue;
    setValue(tempValue);
  };

  /* TODO:
  ? extends types to be more 'strict'.
    ItemUuid extends keyof Equipments,
    TripodUuid extends keyof Equipments[ItemUuid]["tripods"],
    Tripod extends Equipments[ItemUuid]["tripods"][TripodUuid],
    Key extends keyof Tripod
   */

  const updateInTripod = <K extends keyof Tripod>(
    itemUuid: string,
    tripodUuid: string,
    key: K,
    _value: Tripod[K]
  ) => {
    const tempValue = _.cloneDeep(value);
    tempValue[itemUuid].tripods[tripodUuid][key] = _value;
    setValue(tempValue);
  };

  const updateEquipment = (uuid: string, newValue: Equipment) => {
    const tempValue = _.cloneDeep(value);
    tempValue[uuid] = newValue;
    setValue(tempValue);
  };

  const updateInEquipment = <T extends keyof Equipment>(
    uuid: string,
    key: T,
    newValue: Equipment[T]
  ) => {
    const tempValue = _.cloneDeep(value);
    tempValue[uuid][key] = newValue;
    setValue(tempValue);
  };

  const deleteEquipment = (uuid: string) => {
    const tempValue = _.cloneDeep(value);
    delete tempValue[uuid];
    setValue(tempValue);
  };

  const toggleEdit = (uuid: string) => {
    const tempValue = _.cloneDeep(value);
    tempValue[uuid].edit = !tempValue[uuid].edit;
    setValue(tempValue);
  };

  const length = useMemo(() => Object.keys(value).length, [value]);

  const getEquipment = (uuid: keyof Equipments) => value[uuid];

  /* Filter */
  const [filters, setFilters] = useState<{ [uuid: string]: Filter }>({});
  const [filterCondition, setFilterCondition] = useState<"And" | "Or">("And");

  const updateFilter = (uuid: string, newValue: Filter) => {
    const tempValue = _.cloneDeep(filters);
    tempValue[uuid] = newValue;
    setFilters(tempValue);
  };
  const updateInFilter = <T extends keyof Filter>(
    uuid: string,
    key: T,
    newValue: Filter[T]
  ) => {
    const tempValue = _.cloneDeep(filters);
    tempValue[uuid][key] = newValue;
    setFilters(tempValue);
  };
  const removeFilter = (uuid: string) => {
    const tempValue = _.cloneDeep(filters);
    delete tempValue[uuid];
    setFilters(tempValue);
  };

  const match = (filter: Filter, tripod: Tripod) =>
    filter.filterSkill === tripod.skill &&
    filter.filterTripod === tripod.tripod &&
    (!filter.filterLevel || filter.filterLevel <= tripod.level);

  const matchFiltersToEquipment = (uuid: keyof Equipments) => {
    const equipment = getEquipment(uuid);
    const tripods = Object.values(equipment.tripods);

    const filtersValue = Object.values(filters).filter(
      ({ filterSkill, filterTripod }) => filterSkill && filterTripod
    );

    if (!filtersValue.length) return equipment;

    switch (filterCondition) {
      case "And": // ALL must match
        return filtersValue?.every((filter) =>
          tripods.every((tripod) => match(filter, tripod))
        );
      // break;
      case "Or": // ANY must much
        return filtersValue?.some((filter) =>
          tripods.some((tripod) => match(filter, tripod))
        );
      // break;
      default:
        throw Error("unknown filter condition");
    }
  };

  const filtered = useMemo(() => {
    if (value && Object.values(filters).some((filter) => filter)) {
      const a = Object.keys(value).filter(matchFiltersToEquipment);
      console.log({ a });
      return a;
    }
    console.log({ a: Object.keys(value) });
    return Object.keys(value);
  }, [value, filters, filterCondition]);
  /* End */

  return {
    addEmptySlot,
    value,
    setValue,
    updateEquipment,
    updateInEquipment,
    updateInTripod,
    updateTripod,
    deleteEquipment,
    addTripod,
    toggleEdit,
    length,
    getEquipment,

    filtered,
    filters,
    // setFilters,
    updateFilter,
    updateInFilter,
    removeFilter,
    filterCondition,
    setFilterCondition,
  };
};

export const useClassSkills = () => {
  const [playerClass] = useAtom(playerClassAtom);
  const [skills, setSkills] = useState<InferQueryOutput<"class.local">>({});

  const length = useMemo(() => Object.keys(skills).length, [skills]);

  const get = trpc.useQuery(["class.local", LostArkClassId[playerClass.value]]);

  useEffect(() => {
    if (get.data) setSkills(get.data);
    else setSkills({});
  }, [get.data]);

  return { skills, length };
};

export default undefined;
