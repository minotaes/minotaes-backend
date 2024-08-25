import { Request, Response } from "express";
import { type AnyZodObject, type z, type ZodObject } from "zod";

import { validateSchema } from "./index.js";
import { HTTPError } from "../../lib/http-error/index.js";

export const requestHandler =
  <
    Body extends AnyZodObject,
    Params extends AnyZodObject,
    Query extends AnyZodObject,
  >(
    schema: ZodObject<{
      params?: Params;
      query?: Query;
      body?: Body;
    }>,
    controller: (request: {
      params: z.infer<Params>;
      query: z.infer<Query>;
      body: z.infer<Body>;
    }) => Promise<{
      status: number;
      body: any;
    }>,
  ) =>
  (req: Request, res: Response) => {
    const evalRequest = validateSchema(schema)({
      params: req.params,
      query: req.query,
      body: req.body,
    });

    if (!evalRequest.success) {
      res.status(400).json({
        message: "Request is not valid",
        details: evalRequest.details,
      });

      return;
    }

    controller({
      params: evalRequest.data.params,
      query: evalRequest.data.query,
      body: evalRequest.data.body,
    })
      .then((response) => {
        res.status(response.status).json(response.body);
      })
      .catch((err) => {
        if (!(err instanceof HTTPError)) {
          res.status(500).json({
            message: "Something went wrong, please try again later",
            details: {},
          });

          return;
        }

        res.status(err.status).json({
          message: err.message,
          details: err.details,
        });
      });
  };
