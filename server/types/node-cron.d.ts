declare module 'node-cron' {
  /**
   * Schedules a cron job.
   * @param schedule The cron pattern to use
   * @param callback The function to execute at the specified time
   * @param options Optional configuration for the scheduled job
   */
  export function schedule(
    schedule: string,
    callback: () => void,
    options?: {
      scheduled?: boolean;
      timezone?: string;
    }
  ): {
    start: () => void;
    stop: () => void;
  };

  /**
   * Validates a cron pattern.
   * @param schedule The cron pattern to validate
   * @returns True if the pattern is valid
   */
  export function validate(schedule: string): boolean;
}