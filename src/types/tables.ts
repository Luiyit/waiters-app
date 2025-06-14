import type { Model } from "@/types/global";

export interface NewTable {
  name: string;
  area: string;
  isActive: boolean;
}

export interface Table extends NewTable, Model {}
