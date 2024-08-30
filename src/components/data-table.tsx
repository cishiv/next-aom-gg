"use client";

import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { useRouter } from "next/navigation";
import { LeaderboardType } from "@/types/LeaderBoard";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onPaginationChange: any;
  pageCount: number;
  pagination: PaginationState;
  leaderboardType: string;
  onLeaderboardTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  onPaginationChange,
  pageCount,
  pagination,
  leaderboardType,
  onLeaderboardTypeChange,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    onPaginationChange,
    state: { pagination, columnFilters },
    pageCount,
  });

  const handleRowClick = (row: any) => {
    const route = `/profile/${row.original.profile_id}`;
    router.push(route);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <select
            value={leaderboardType}
            onChange={onLeaderboardTypeChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value={LeaderboardType["1v1Supremacy"]}>1v1 Supremacy</option>
            <option value={LeaderboardType.TeamSupremacy}>Team Supremacy</option>
            <option value={LeaderboardType.Deathmatch}>Deathmath</option>
            <option value={LeaderboardType.TeamDeathmatch}>Team Deathmatch</option>
          </select>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(row)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <DataTablePagination table={table} />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}
