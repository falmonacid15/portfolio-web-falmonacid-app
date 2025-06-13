"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
  Tooltip,
  Pagination,
  Chip,
  Spinner,
  Input,
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

export type ValidKeyTypes =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | []
  | object;

export type BaseRowValue = ValidKeyTypes | { [key: string]: ValidKeyTypes };

export interface BaseRow {
  id: string | number;
  [key: string]: BaseRowValue;
}

export interface Column<T> {
  key: keyof T | "actions";
  label: string;
}

export interface DataTableProps<T extends BaseRow> {
  columns: Column<T>[];
  rows: T[];
  itemsPerPage?: number;
  onEdit?: (row: T) => void;
  onView?: (row: T) => void;
  onViewLabel?: string;
  onDelete?: (row: T) => void;
  actionButton?: () => void;
  actionButtonLabel?: string;
  actionButtonIcon?: string;
  totalCount?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  setSearchQuery?: (query: string) => void;
  searchQuery?: string;
  searchable?: boolean;
  squareImages?: boolean;
}

export function DataTable<T extends BaseRow>({
  columns,
  rows,
  itemsPerPage = 5,
  onEdit,
  onView,
  onViewLabel = "Ver",
  onDelete,
  actionButton,
  actionButtonLabel = "Nuevo registro",
  actionButtonIcon = "lucide:plus",
  totalCount,
  page = 1,
  onPageChange,
  isLoading = false,
  searchable = false,
  searchQuery,
  setSearchQuery,
  squareImages = false,
}: DataTableProps<T>) {
  const [localPage, setLocalPage] = useState(1);

  const isServerPagination = !!onPageChange;

  const currentPage = isServerPagination ? page : localPage;

  const handlePageChange = (page: number) => {
    if (isServerPagination) {
      onPageChange(page);
    } else {
      setLocalPage(page);
    }
  };

  const totalItems = totalCount ?? rows.length;
  const pages = Math.ceil(totalItems / itemsPerPage);

  const currentRows = isServerPagination
    ? rows
    : rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatValue = (value: unknown): string => {
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    if (value === null || value === undefined) {
      return "";
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const renderCell = (item: T, columnKey: keyof T | "actions") => {
    if (columnKey === "actions") {
      return (
        <div className="flex gap-2">
          {onView && (
            <Tooltip content={onViewLabel}>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onView(item)}
              >
                <Icon icon="lucide:eye" className="text-lg" />
              </Button>
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip content="Edit">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onEdit(item)}
              >
                <Icon icon="lucide:edit" className="text-lg" />
              </Button>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip content="Delete">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => onDelete(item)}
              >
                <Icon icon="lucide:trash" className="text-lg" />
              </Button>
            </Tooltip>
          )}
        </div>
      );
    }
    if (columnKey === "icon") {
      return <Icon icon={item.icon as string} className="w-6 h-6" />;
    }
    if (columnKey === "image") {
      return (
        <Avatar
          alt="image"
          radius={squareImages ? "sm" : "full"}
          src={item.image as string}
          size="lg"
        />
      );
    }
    if (columnKey === "mainImage") {
      return (
        <Avatar
          alt="image"
          radius={squareImages ? "sm" : "full"}
          src={item.mainImage as string}
          size="lg"
        />
      );
    }
    if (columnKey === "createdAt") {
      return <span>{new Date(item.createdAt as string).toLocaleString()}</span>;
    }
    if (columnKey === "updatedAt") {
      return <span>{new Date(item.updatedAt as string).toLocaleString()}</span>;
    }
    if (columnKey === "isActive") {
      return (
        <Chip
          color={item.isActive ? "success" : "danger"}
          className="flex items-center gap-2"
        >
          <span className="font-bold">{item.hasDemo ? "Si" : "No"}</span>
        </Chip>
      );
    }
    if (columnKey === "description" || columnKey === "shortDescription") {
      return (
        <p className="text-sm text-foreground/80 line-clamp-3 w-full">
          {formatValue(item.description || item.shortDescription)}
        </p>
      );
    }
    if (columnKey === "hasDemo") {
      return (
        <Chip
          color={item.hasDemo ? "success" : "danger"}
          className="flex items-center gap-2"
          size="sm"
        >
          <span className="font-bold">
            {item.hasDemo ? "Si tiene" : "No tiene"}
          </span>
        </Chip>
      );
    }
    if (columnKey === "hasRepo") {
      return (
        <Chip
          color={item.hasRepo ? "success" : "danger"}
          className="flex items-center gap-2"
          size="sm"
        >
          <span className="font-bold">
            {item.hasDemo ? "Si tiene" : "No tiene"}
          </span>
        </Chip>
      );
    }
    if (columnKey === "isFeatured") {
      return (
        <Chip
          color={item.hasRepo ? "success" : "danger"}
          className="flex items-center gap-2 "
          size="sm"
        >
          <span className="font-bold">{item.hasDemo ? "Si" : "No"}</span>
        </Chip>
      );
    }
    if (typeof columnKey === "string" && columnKey.includes(".")) {
      const keys = columnKey.split(".");
      let value: BaseRowValue = item;

      for (const key of keys) {
        if (value === null || value === undefined) return "";
        value = (value as { [key: string]: BaseRowValue })[key];
      }

      return formatValue(value);
    }

    const value = getKeyValue(item, columnKey as string);
    return formatValue(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <Table
        aria-label="Custom data table"
        layout="auto"
        isStriped
        bottomContent={
          pages > 1 ? (
            <div className="flex justify-center">
              <Pagination
                total={pages}
                page={currentPage}
                onChange={handlePageChange}
                isDisabled={isLoading}
                showControls
              />
            </div>
          ) : null
        }
        topContent={
          <div className="flex justify-between">
            {actionButton && (
              <Button
                onPress={actionButton}
                startContent={
                  <Icon icon={actionButtonIcon} className="w-6 h-6" />
                }
                color="primary"
                isDisabled={isLoading}
              >
                {actionButtonLabel}
              </Button>
            )}
            {searchable && (
              <Input
                placeholder="Buscar"
                className="w-1/4"
                isDisabled={isLoading}
                value={searchQuery}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                startContent={<Icon icon="lucide:search" className="w-6 h-6" />}
                isClearable
                onClear={() => setSearchQuery?.("")}
              />
            )}
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key.toString()}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={currentRows}
          loadingState={isLoading ? "loading" : "idle"}
          loadingContent={<Spinner variant="wave" size="lg" />}
          emptyContent={isLoading ? null : "No hay registros para mostrar"}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell
                  className={
                    columnKey === "actions" ? "w-[15%] text-right" : "flex-1"
                  }
                >
                  {renderCell(item, columnKey as keyof T | "actions")}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
