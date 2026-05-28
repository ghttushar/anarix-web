import { ReactNode } from "react";

export interface TabletColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  align?: "left" | "right";
  sticky?: boolean;
  sortable?: boolean;
  /** Tailwind width class, e.g. "w-40". */
  widthClass?: string;
}

export type SortDirection = "asc" | "desc" | null;

export interface SortState {
  columnId: string | null;
  direction: SortDirection;
}
