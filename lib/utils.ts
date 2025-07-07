<<<<<<< HEAD
import { type ClassValue, clsx } from "clsx"
=======
import { clsx, type ClassValue } from "clsx"
>>>>>>> c1b4b79 (Complete user authentication flows, UI, and SQL schema for Favor app)
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
<<<<<<< HEAD

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}
=======
>>>>>>> c1b4b79 (Complete user authentication flows, UI, and SQL schema for Favor app)
