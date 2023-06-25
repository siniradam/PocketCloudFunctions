import { pbMethods, pbUser } from "./middlewares/types";

declare global {
  namespace Express {
    export interface Request {
      pb: pbMethods;
      user?: pbUser;
    }
  }
}
