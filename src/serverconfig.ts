// # Configuration
export const config = {
  freeCpuSlots: 10,
  maxRestarts: 2,
  functionsPath: "/functions",
  ratelimit: {
    keyPrefix: "express",
    points: 10,
    duration: 5,
  },
};
