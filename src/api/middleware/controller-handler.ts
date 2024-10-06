import {
  type RequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { HTTPError } from "../../lib/http-error/index.js";
import { authenticate } from "./authenticate.js";
import { type User as UserR } from "../resources/users/repository.js";

interface RequestSchema {
  params: any;
  query: any;
  body: any;
}

enum SuccessHTTPStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTI_STATUS = 207,
}

type Controller<R, Auth, User extends Array<keyof UserR>> = (props: {
  user: Auth extends true ? { [key in User[number]]: UserR[key] } : undefined;
  attrs: R;
  deps: ProjectDependencies;
}) => Promise<{
  status: SuccessHTTPStatus;
  body: any;
}>;

interface Options<R, Auth, User> {
  test?: (
    req: RequestSchema,
  ) =>
    | { success: true; data: R }
    | { success: false; details: Record<string, any> };
  auth?: Auth;
  user?: Auth extends true ? User : undefined;
}

export const controllerHandler =
  <R, A extends true, User extends Array<keyof UserR>>(
    options: Options<R, A, User>,
    controller: Controller<R, A, User>,
  ) =>
  (deps: ProjectDependencies) =>
    (async (req: Request, res: Response, next: NextFunction) => {
      let user: any;

      // AUTHENTICATION
      if (options.auth === true) {
        const authResult = authenticate(req);
        if (!authResult.success) {
          res.status(401).json({
            message: authResult.message,
            details: authResult.details,
          });

          return;
        }

        user = await deps.models.user
          .findOne({
            where: { userId: authResult.data },
            attributes: options.user,
          })
          .catch(() => undefined);
      }

      const reqResult = options.test?.(req) ?? {
        success: true,
        data: null as R,
      };

      if (!reqResult.success) {
        res.status(400).json({
          message: "Request is not valid",
          details: reqResult.details,
        });

        return;
      }

      controller({
        user,
        attrs: reqResult.data,
        deps,
      })
        .then((response) => {
          res.status(response.status).json(response.body);
        })
        .catch((err) => {
          if (!(err instanceof HTTPError)) {
            console.error(err);

            res.status(500).json({
              message: "Something went wrong, please try again later",
              details: {},
            });

            return;
          }

          // TODO: not send err to client
          res.status(err.status).json({
            message: err.message,
            details: err.details,
          });
        });
    }) as RequestHandler;
