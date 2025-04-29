import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export class TimeoutError extends Error {
  constructor(message?: string) {
    super(message || 'The operation timed out.');
    this.name = 'TimeoutError';
  }
}

export async function timeout<T>(
  ms: number = 60000, // Default timeout of 60 seconds
  promise: Promise<T>
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new TimeoutError()), ms);
  });

  return Promise.race<T>([
    promise,
    timeoutPromise,
  ]);
}
