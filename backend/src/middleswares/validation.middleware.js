import ApiError from "../helpers/apiError.js";

export const validate = (schema, target = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || target,
        message: issue.message,
      }));

      const message = errors[0]?.message || "Invalid request data";

      return next(
        new ApiError(
          400,
          message,
          "VALIDATION_ERROR",
          errors
        )
      );
    }

    req.validatedData = result.data;
    next();
  };
};
