/** Simulates network latency for dummy API calls */
export function apiDelay(ms = 280): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
