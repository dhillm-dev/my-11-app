import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
export {
  cn as c,
  delay as d,
  generateId as g
};
