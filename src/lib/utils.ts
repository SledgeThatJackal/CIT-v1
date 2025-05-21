import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import pkg from "../../package.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const appVersion = pkg.version;
