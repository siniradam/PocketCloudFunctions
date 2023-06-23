import { pbMethods, pbUser } from "./hooks/types";

declare global {
  namespace Express {
    export interface Request {
      pb: pbMethods;
      user?: pbUser;
    }
  }
}
