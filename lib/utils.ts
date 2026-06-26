import { twMerge } from "tailwind-merge";

type ClassDictionary = Record<string, boolean | undefined | null>;
type ClassValue =
  | string
  | number
  | undefined
  | null
  | false
  | ClassDictionary
  | ClassValue[];

/** clsx-lite : strings, nombres, tableaux imbriqués et objets `{ classe: condition }`. */
function toClassString(input: ClassValue): string {
  if (!input) return "";
  if (typeof input === "string" || typeof input === "number") return String(input);
  if (Array.isArray(input)) return input.map(toClassString).filter(Boolean).join(" ");
  return Object.keys(input)
    .filter((key) => input[key])
    .join(" ");
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(inputs.map(toClassString).filter(Boolean).join(" "));
}
