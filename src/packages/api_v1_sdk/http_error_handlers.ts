import { LogVerbosity } from "../../utilities/logger/logger";
import { ConsoleLogger } from "../../utilities/logger/loggers";

interface AxiosError {
    response: {
      status: number;
    };
  }
  
  export function handleAxiosResponseErrors(error: AxiosError) {
    ConsoleLogger(LogVerbosity.error).error("Axios Error", error);
    throw error;
  }