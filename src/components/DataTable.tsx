import { Card, Grid, Stack, Typography } from "@mui/material";
import React from "react";

type ValidRowModel = {
  [key: string]: any;
};

export type Rows<R extends ValidRowModel = any> = Readonly<R>[];

export interface ColumnDefinition<R extends ValidRowModel = any> {
  field: keyof R;
  label: string;
  description?: string;
  width?: number;
  flex?: number;
  minWidth?: number;
  maxWidth?: number;
  valueGetter?: (params: R) => string;
  valueSetter?: (params: { value: any; row: R }) => R;
  valueFormatter?: (params: {
    id: string;
    field: keyof R;
    value: any;
  }) => string;
  valueParser?: (value: undefined | any, params?: {}) => any;
  renderCell?: (params: any) => React.ReactNode;
  renderEditCell?: (params: any) => React.ReactNode;
}

type DataTableProps<R extends ValidRowModel = any> = {
  rows: Rows<R>;
  columns: ColumnDefinition<R>[];
};

const DataTable: React.FC<DataTableProps> = ({ rows, columns }) => (
  <Grid sx={{ flex: 1 }} container>
    <Grid item>
      <Typography> {JSON.stringify(rows)} </Typography>
    </Grid>
  </Grid>
);

export default DataTable;
