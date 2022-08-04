import DataTable, { ColumnDefinition, Rows } from "@/components/DataTable";
import { useEquipments } from "@/jotai";
import { Equipment } from "@/types";
import { Card, Typography } from "@mui/material";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { NextPage } from "next";

const TableView: NextPage = () => {
  const equipments = useEquipments();

  interface Row {
    uuid: string;
    label: Equipment["label"];
    type: Equipment["type"];
    skill: Equipment["tripods"][number]["skill"];
    tripod: Equipment["tripods"][number]["tripod"];
    level: Equipment["tripods"][number]["level"];
  }

  const columns: ColumnDefinition<Row>[] = [
    { field: "uuid", label: "Id", width: 300 },
    {
      field: "label",
      label: "Label",
      width: 200,
    },
    {
      field: "type",
      label: "Type",
    },
    {
      field: "skill",
      label: "Skill",
    },
    {
      field: "tripod",
      label: "Tripod",
    },
    {
      field: "level",
      label: "Level",
    },
  ];

  const rows: Rows<Row> = Object.entries(equipments.value)
    .map(([uuid, equipment]) => ({
      uuid,
      label: equipment.label,
    }))
    .flat();

  console.log(rows);

  return (
    <Card sx={{ height: "100vh", my: 2, p: 1 }}>
      <Typography>Table</Typography>
      <DataTable rows={rows} columns={columns} />
      {/* <DataGrid columns={columns} rows={rows} getRowId={(row) => row.uuid} /> */}
    </Card>
  );
};

export default TableView;
