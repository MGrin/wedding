import type { ReactNode } from "react";

export type Section = {
  id: string;
  title: string;
  content: ReactNode;
};

export type PageId = "landing" | "guestList";

export type PageData = {
  id: PageId;
  sections: Section[];
};

export const WEDDING_DATE = new Date("2026-05-16T00:00:00");

export type Guest = {
  id: number;
  title: string;
  titleRu?: string;
  names: string[];
  namesRu?: string[];
  children: string[];
  childrenRu?: string[];
  languages: string[];
  country: string;
  countryRu?: string;
  details: string;
  detailsRu?: string;
  photo?: string;
};
