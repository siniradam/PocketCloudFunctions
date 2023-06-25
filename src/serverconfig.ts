// # Configuration
export const config = {
  // If you have 12 cores, when freeCpuSlots 10, it will spawn 2 processes.
  freeCpuSlots: 10,

  // If process fails n times tries to restart it.
  maxRestarts: 2,

  // Path of the endpoints index. Most likely you shouldn't change.
  functionsPath: "/functions",

  // process.env.PORT > config.port > 3000
  port: 3000,

  // Configuration for rate limiter.
  ratelimit: {
    // Request count
    points: 10,
    // Seconds
    duration: 5,
  },
};
