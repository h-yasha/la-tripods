import AddIcon from "@mui/icons-material/Add";
import {
  Autocomplete,
  Box,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import React, { useMemo, useState } from "react";
import { SiRedhat } from "react-icons/si";
import {
  GiArmoredPants,
  GiCrossedSwords,
  GiHand,
  GiShoulderArmor,
  GiSpikedShoulderArmor,
} from "react-icons/gi";
import {
  BiDownArrow,
  BiEdit,
  BiMinus,
  BiSave,
  BiTrash,
  BiUpArrow,
} from "react-icons/bi";

import Image from "next/image";

import { LostArkClassId, classList } from "../constants";
import { useEquipments, playerClassAtom, useClassSkills } from "../jotai";
import { EquipmentTypes, TripodLevels } from "../types";

const EquipmentTypesIcon: {
  // eslint-disable-next-line no-unused-vars
  [key in typeof EquipmentTypes[number]]: JSX.Element;
} = {
  Helmet: <SiRedhat size={60} />,
  Shoulder: <GiSpikedShoulderArmor size={60} />,
  Armor: <GiShoulderArmor size={60} />,
  Pant: <GiArmoredPants size={60} />,
  Glove: <GiHand size={60} />,
  Weapon: <GiCrossedSwords size={60} />,
};

const EquipmentTypesIconMenuItem = Object.entries(EquipmentTypesIcon).map(
  ([key, value]) => (
    <MenuItem value={key} key={key}>
      {value}
    </MenuItem>
  )
);

const EquipmentDisplay: React.FC<{ uuid: string }> = ({ uuid }) => {
  const equipments = useEquipments();

  const item = equipments.value[uuid];

  const render = useMemo(() => {
    console.time(`EquipmentDisplay Rendering - ${uuid}`);
    const r = (
      <Card>
        <Stack p={2} direction="column" spacing={2}>
          <Stack direction="row" spacing={2}>
            <Stack sx={{ flex: "grow", flexBasis: "6rem" }} alignItems="center">
              <Stack direction="row" justifyContent="space-between">
                {EquipmentTypesIcon[item.type]}
              </Stack>
              <Typography>{item.label}</Typography>
              <Box sx={{ flex: 1 }} />
              <Stack alignItems="center">
                <IconButton>
                  <BiUpArrow />
                </IconButton>
                <Box>
                  <IconButton onClick={() => equipments.toggleEdit(uuid)}>
                    <BiEdit />
                  </IconButton>
                  <IconButton onClick={() => equipments.deleteEquipment(uuid)}>
                    <BiTrash />
                  </IconButton>
                </Box>
                <IconButton>
                  <BiDownArrow />
                </IconButton>
              </Stack>
              <Box sx={{ flex: 1 }} />
            </Stack>

            <Stack
              spacing={0.75}
              width="100%"
              // divider={<Divider sx={{ borderWidth: "0.25rem" }} />}
            >
              {Object.entries(item.tripods).map(([tripodUuid, value]) => (
                <Card
                  sx={{ backgroundColor: "#777777", pb: 2 }}
                  key={tripodUuid}
                >
                  <Card
                    sx={{
                      backgroundColor: "#BBBBBB",
                      borderStyle: "solid",
                      borderColor: "darkblue",
                      borderWidth: 4,
                      borderRadius: 0,
                      py: 0.5,
                    }}
                  >
                    <Typography color="blue" textAlign="center">
                      {value.skill}
                    </Typography>
                  </Card>
                  <Stack height="75px" direction="row" mt={1} px={1}>
                    <Box
                      sx={{
                        height: "37.5px",
                        width: "37.5px",
                        backgroundColor: "black",
                        alignSelf: "center",
                        borderStyle: "solid",
                        borderColor: "white",
                        borderWidth: 3,
                      }}
                    />
                    <Box
                      sx={{
                        height: "75px",
                        width: "75px",
                        backgroundColor: "black",
                        alignSelf: "center",
                        borderRadius: 9999,
                        borderStyle: "solid",
                        borderColor: "white",
                        borderWidth: 3,
                      }}
                    />
                    <Stack direction="column" ml={3} alignSelf="center">
                      <Typography color="yellow">Lv. {value.level}</Typography>
                      <Typography
                        color="white"
                        fontSize={24}
                        fontWeight={500}
                        sx={{ textShadow: "2px 2px 0 black" }}
                      >
                        {value.tripod}
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Stack>
          <Typography fontSize={10} alignSelf="end" mt={2}>
            {uuid}
          </Typography>
        </Stack>
      </Card>
    );
    console.timeEnd(`EquipmentDisplay Rendering - ${uuid}`);
    return r;
  }, [equipments, item.label, item.tripods, item.type, uuid]);

  return render;
};

const EquipmentEdit: React.FC<{ uuid: string }> = ({ uuid }) => {
  const equipments = useEquipments();
  const classSkills = useClassSkills();

  const item = equipments.value[uuid];

  const render = useMemo(() => {
    let content = <CircularProgress />;
    if (classSkills.length)
      content = (
        <Stack p={2} direction="column" spacing={2}>
          <Stack direction="row" spacing={2}>
            <Stack sx={{ flexBasis: "12rem" }} alignItems="center">
              <Stack direction="row" justifyContent="space-between">
                <Select
                  value={item.type}
                  onChange={(event) =>
                    equipments.updateInEquipment(
                      uuid,
                      "type",
                      event.target.value as any
                    )
                  }
                >
                  {EquipmentTypesIconMenuItem}
                </Select>
              </Stack>
              <TextField
                sx={{ mt: 1 }}
                value={item.label}
                onChange={(event) =>
                  equipments.updateInEquipment(
                    uuid,
                    "label",
                    event.target.value
                  )
                }
                size="small"
              />
              <Box sx={{ flex: 1 }} />
              <Stack alignItems="center">
                <IconButton>
                  <BiUpArrow />
                </IconButton>
                <Box>
                  <IconButton onClick={() => equipments.toggleEdit(uuid)}>
                    <BiSave />
                  </IconButton>
                  <IconButton onClick={() => equipments.deleteEquipment(uuid)}>
                    <BiTrash />
                  </IconButton>
                </Box>
                <IconButton>
                  <BiDownArrow />
                </IconButton>
              </Stack>
              <Box sx={{ flex: 1 }} />
            </Stack>

            <Stack
              spacing={0.75}
              width="100%"
              // divider={<Divider sx={{ borderWidth: "0.25rem" }} />}
            >
              {Object.entries(item.tripods).map(([tripodUuid, value]) => (
                <Card
                  sx={{ backgroundColor: "#777777", pb: 3 }}
                  key={tripodUuid}
                >
                  <Card sx={{ backgroundColor: "#BBBBBB" }}>
                    <Autocomplete
                      options={Object.keys(classSkills.skills)}
                      loading={!classSkills.length}
                      size="small"
                      autoComplete
                      autoHighlight
                      autoSelect
                      disableClearable
                      value={value.skill}
                      onChange={(event, newValue) => {
                        equipments.updateInTripod(
                          uuid,
                          tripodUuid,
                          "skill",
                          newValue
                        );
                      }}
                      renderInput={(props) => <TextField {...props} />}
                      getOptionLabel={(option) =>
                        classSkills.skills[option].name || "????"
                      }
                      renderOption={(props, option) => (
                        <MenuItem {...props}>
                          {classSkills.skills[option].iconPath && (
                            <Image
                              src={classSkills.skills[option].iconPath}
                              height={48}
                              width={48}
                            />
                          )}
                          <Typography>
                            {classSkills.skills[option].name}
                          </Typography>
                        </MenuItem>
                      )}
                    />
                  </Card>
                  <Stack height="75px" direction="row" mt={2} px={1}>
                    <Box
                      sx={{
                        minHeight: "37.5px",
                        minWidth: "37.5px",
                        maxHeight: "37.5px",
                        maxWidth: "37.5px",
                        backgroundColor: "black",
                        alignSelf: "center",
                        borderStyle: "solid",
                        borderColor: "white",
                        borderWidth: 3,
                      }}
                    >
                      {value.skill &&
                        classSkills.skills[value.skill].iconPath && (
                          <Image
                            width={37.5}
                            height={37.5}
                            src={classSkills.skills[value.skill].iconPath}
                          />
                        )}
                    </Box>
                    <Box
                      sx={{
                        minHeight: "75px",
                        minWidth: "75px",
                        maxHeight: "75px",
                        maxWidth: "75px",
                        backgroundColor: "black",
                        alignSelf: "center",
                        borderRadius: "9999px",
                        borderStyle: "solid",
                        borderColor: "white",
                        borderWidth: 3,
                      }}
                    >
                      {value.skill &&
                        value.tripod &&
                        classSkills.skills[value.skill].tripods[value.tripod]
                          ?.icon && (
                          <Image
                            width={75}
                            height={75}
                            src={
                              classSkills.skills[value.skill].tripods[
                                value.tripod
                              ]?.icon
                            }
                          />
                        )}
                    </Box>
                    <Stack
                      direction="column"
                      ml={3}
                      alignSelf="center"
                      spacing={1}
                      width="100%"
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography color="yellow">Lv.</Typography>
                        <Autocomplete
                          options={TripodLevels}
                          autoComplete
                          autoHighlight
                          autoSelect
                          disableClearable
                          value={value.level}
                          size="small"
                          onChange={(event, newValue) =>
                            equipments.updateInTripod(
                              uuid,
                              tripodUuid,
                              "level",
                              newValue
                            )
                          }
                          renderInput={(inputProps) => (
                            <TextField
                              {...inputProps}
                              inputProps={{
                                ...inputProps.inputProps,
                                sx: { color: "yellow" },
                              }}
                            />
                          )}
                        />
                      </Stack>
                      <Autocomplete
                        options={
                          value.skill
                            ? Object.keys(
                                classSkills.skills[value.skill].tripods
                              ) ?? []
                            : []
                        }
                        size="small"
                        value={value.tripod}
                        onChange={(event, newValue) =>
                          equipments.updateInTripod(
                            uuid,
                            tripodUuid,
                            "tripod",
                            newValue
                          )
                        }
                        autoComplete
                        autoHighlight
                        autoSelect
                        disableClearable
                        renderInput={(inputProps) => (
                          <TextField
                            {...inputProps}
                            sx={{
                              color: "white",
                              fontSize: 24,
                              fontWeight: 500,
                            }}
                          />
                        )}
                      />
                    </Stack>
                  </Stack>
                </Card>
              ))}
              {Object.keys(item.tripods).length < 3 && (
                <IconButton
                  sx={{ alignSelf: "center" }}
                  onClick={() => equipments.addTripod(uuid)}
                >
                  <AddIcon fontSize="large" />
                </IconButton>
              )}
            </Stack>
          </Stack>
          <Typography fontSize={10} alignSelf="end" mt={2}>
            {uuid}
          </Typography>
        </Stack>
      );

    return <Card>{content}</Card>;
  }, [item.label, item.tripods, item.type, classSkills.length]);

  return render;
};

const EquipmentComponent: React.FC<{ uuid: string }> = ({ uuid }) => {
  const { getEquipment } = useEquipments();

  const item = getEquipment(uuid);

  const render = useMemo(() => {
    // console.time(`EquipmentComponent - ${uuid}`);
    const r = item.edit ? (
      <EquipmentEdit key={uuid} uuid={uuid} />
    ) : (
      <EquipmentDisplay key={uuid} uuid={uuid} />
    );
    // console.timeEnd(`EquipmentComponent - ${uuid}`);
    return r;
  }, [item.edit]);

  return render;
};

const Filter: React.FC = () => {
  const equipments = useEquipments();
  const classSkills = useClassSkills();

  if (!classSkills.length) return <CircularProgress />;

  return (
    <Card sx={{ p: 2, pt: 1 }}>
      <Stack gap={2}>
        <Typography fontSize={18} textAlign="center">
          Filter
        </Typography>
        <Autocomplete
          sx={{ flex: 1 }}
          options={["And", "Or"] as const}
          loading={!classSkills.length}
          size="small"
          autoComplete
          autoHighlight
          autoSelect
          disableClearable
          value={equipments.filterCondition}
          onChange={(event, newValue) => {
            equipments.setFilterCondition(newValue);
          }}
          renderInput={(props) => (
            <TextField {...props} label="Filter Condition" />
          )}
        />

        {Object.entries(equipments.filters).map(([uuid, filter]) => (
          <Stack flexDirection="row" gap={2} key={uuid}>
            <Autocomplete
              sx={{ flex: 1 }}
              options={Object.keys(classSkills.skills)}
              loading={!classSkills.length}
              size="small"
              autoComplete
              autoHighlight
              autoSelect
              disableClearable
              value={filter.filterSkill}
              onChange={(event, newValue) => {
                // TODO: not this
                // eslint-disable-next-line no-param-reassign
                equipments.updateInFilter(uuid, "filterSkill", newValue);
              }}
              renderInput={(props) => <TextField label="Skill" {...props} />}
              getOptionLabel={(option) => classSkills.skills[option].name}
              renderOption={(props, option) => (
                <MenuItem {...props}>
                  {classSkills.skills[option].iconPath && (
                    <Image
                      src={classSkills.skills[option].iconPath}
                      height={48}
                      width={48}
                    />
                  )}
                  <Typography>{classSkills.skills[option].name}</Typography>
                </MenuItem>
              )}
            />

            <Autocomplete
              sx={{ flex: 1 }}
              options={
                filter.filterSkill
                  ? Object.keys(
                      classSkills.skills[filter.filterSkill].tripods
                    ) ?? []
                  : []
              }
              size="small"
              value={filter.filterTripod}
              onChange={(event, newValue) =>
                equipments.updateInFilter(uuid, "filterTripod", newValue)
              }
              autoComplete
              autoHighlight
              autoSelect
              disableClearable
              renderInput={(inputProps) => (
                <TextField {...inputProps} label="Tripod" />
              )}
            />

            <Autocomplete
              sx={{ width: 96 }}
              options={TripodLevels}
              autoComplete
              autoHighlight
              autoSelect
              disableClearable
              value={filter.filterLevel}
              size="small"
              onChange={(event, newValue) =>
                equipments.updateInFilter(uuid, "filterLevel", newValue)
              }
              renderInput={(inputProps) => (
                <TextField {...inputProps} label="Level" />
              )}
            />
            <IconButton
              onClick={() => {
                equipments.removeFilter(uuid);
              }}
            >
              <BiMinus />
            </IconButton>
          </Stack>
        ))}
        <Chip
          sx={{ alignSelf: "center" }}
          icon={<AddIcon />}
          label="Add"
          onClick={() => {
            equipments.updateFilter(crypto.randomUUID(), {
              filterSkill: undefined,
              filterTripod: undefined,
            });
          }}
        />
      </Stack>
    </Card>
  );
};

const Index: React.FC = () => {
  // console.time("Index rendering");
  const [playerClass, setPlayerClass] = useAtom(playerClassAtom);
  const equipments = useEquipments();

  const equipmentsElements = useMemo(
    () =>
      typeof window !== "undefined"
        ? Object.keys(equipments.value).map((uuid) => (
            <EquipmentComponent key={uuid} uuid={uuid} />
          ))
        : [],

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [equipments.length]
  );

  const render = (
    <Stack p={1} direction="column" spacing={2}>
      <Typography px={4} my={2} fontSize={32} fontWeight="bold">
        Lost Ark - Tripods
      </Typography>
      <Autocomplete
        options={classList}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        value={playerClass}
        onChange={(event, value) =>
          value && typeof value === "object" && setPlayerClass(value)
        }
        renderInput={(props) => (
          <TextField
            {...props}
            InputProps={{
              ...props.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Image
                    width={48}
                    height={48}
                    src={`https://lostarkcodex.com/images/skillbuilder/icon_class_${
                      LostArkClassId[playerClass.value]
                    }.webp`}
                  />
                </InputAdornment>
              ),
            }}
          />
        )}
        renderOption={(props, { label, value }) => (
          <MenuItem {...props}>
            <Stack flexDirection="row" alignItems="center">
              <Image
                width={48}
                height={48}
                src={`https://lostarkcodex.com/images/skillbuilder/icon_class_${LostArkClassId[value]}.webp`}
              />
              <Typography>{label}</Typography>
            </Stack>
          </MenuItem>
        )}
      />
      <Filter />
      <IconButton
        sx={{ mt: 2, alignSelf: "center" }}
        onClick={equipments.addEmptySlot}
      >
        <AddIcon />
      </IconButton>
      {equipmentsElements}
    </Stack>
  );

  // console.timeEnd("Index rendering");
  return render;
};

export default Index;
