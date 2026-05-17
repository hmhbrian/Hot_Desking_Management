import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Shadcn/UI utility - merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to Vietnamese locale
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Format time HH:mm
export function formatTime(timeStr: string): string {
  return timeStr.substring(0, 5);
}

// Format datetime
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Get today as YYYY-MM-DD string
export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}
