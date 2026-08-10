/**
 * Only logs to the console in development mode.
 */
export const devlog = (message?: any, ...optionalParams: any[]) => {
  return (
    process.env.NODE_ENV === "development" &&
    console.log(message, ...optionalParams)
  );
};
