import { type NextFunction, type Request, type Response } from "express";
import { HTTPError } from "../../lib/http-error/index.js";

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

type Controller<R> = (props: {
  attrs: R;
  deps: ProjectDependencies;
}) => Promise<{
  status: SuccessHTTPStatus;
  body: any;
}>;

interface Options<R> {
  test?: (
    req: RequestSchema,
  ) =>
    | { success: true; data: R }
    | { success: false; details: Record<string, any> };
}

export const controllerHandler =
  <R>(options: Options<R>, controller: Controller<R>) =>
  (deps: ProjectDependencies) =>
  (req: Request, res: Response, next: NextFunction) => {
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
  };
