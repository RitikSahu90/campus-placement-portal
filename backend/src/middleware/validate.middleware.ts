import { NextFunction, Request, Response } from "express";

type Validator = (value: unknown) => boolean;

export function validateBody(rules: Record<string, Validator | Validator[]>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const missingOrInvalid = Object.entries(rules)
      .filter(([key, validators]) => {
        const validatorList = Array.isArray(validators) ? validators : [validators];
        return !validatorList.every((validator) => validator(req.body[key]));
      })
      .map(([key]) => key);

    if (missingOrInvalid.length > 0) {
      const error = new Error(`Invalid request fields: ${missingOrInvalid.join(", ")}`);
      (error as Error & { statusCode?: number }).statusCode = 400;
      return next(error);
    }

    return next();
  };
}

export const isRequiredString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

export const isEmail = (value: unknown) =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isRole = (value: unknown) =>
  value === "student" || value === "recruiter" || value === "admin";

export const isOptionalString = (value: unknown) =>
  value === undefined || value === null || typeof value === "string";

export const isNumberLike = (value: unknown) =>
  typeof value === "number" || (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value)));
