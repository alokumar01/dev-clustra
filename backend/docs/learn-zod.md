# Learn Zod for This Project

These notes are written for our backend project, not for learning every advanced Zod feature.

As a final year BTech CSE student, your goal is simple:

- Understand why validation is needed.
- Know where validation files live.
- Know how request data flows from frontend to controller.
- Know how to write schemas for common API inputs.
- Know how to connect schemas with Express middleware.

---

## 1. What Is Zod?

Zod is a JavaScript validation library.

It checks whether incoming data is correct before your controller and service use it.

Example:

```js
import { z } from "zod";

const emailSchema = z.string().trim().email();

const result = emailSchema.safeParse("  aalok@gmail.com  ");

console.log(result.success); // true
console.log(result.data);    // "aalok@gmail.com"
```

Think like this:

```txt
User sends data
      |
      v
Zod checks data
      |
      +-- invalid -> send 400 error
      |
      +-- valid -> controller runs
```

Zod is useful because frontend/client data cannot be trusted.

---

## 2. Why Do We Need Validation?

For signup, your backend expects this:

```json
{
  "username": "aalok",
  "email": "aalok@gmail.com",
  "password": "password123"
}
```

But a client can send anything:

```json
{
  "username": 123,
  "email": true,
  "password": []
}
```

Without validation:

- Controller becomes full of `if` checks.
- Service receives wrong data.
- Database errors can happen.
- Bugs become harder to debug.
- API error responses become inconsistent.

With Zod:

- Schema handles input checking.
- Controller stays clean.
- Service receives trusted data.
- Error handling becomes easier.

Important backend rule:

```txt
Never trust req.body directly.
Validate it before using it.
```

---

## 3. Your Project Folder Structure

Your backend is module-based.

Important files for Zod:

```txt
backend/src
|
+-- app.js
+-- routes
|   +-- v1.routes.js
|
+-- middleswares
|   +-- validation.middleware.js
|   +-- error.middleware.js
|
+-- modules
    +-- auth
        +-- auth.routes.js
        +-- auth.controller.js
        +-- auth.service.js
        +-- auth.model.js
        +-- auth.validation.js
```

Meaning of each file:

```txt
auth.validation.js
  Here you write Zod schemas.

validation.middleware.js
  Here you create reusable Express middleware that runs any schema.

auth.routes.js
  Here you attach validation before controller.

auth.controller.js
  Here you read validated data and call service.

auth.service.js
  Here business logic runs.

auth.model.js
  Here database schema/model lives.
```

For a good backend structure, each module should have its own validation file:

```txt
modules/auth/auth.validation.js
modules/user/user.validation.js
modules/message/message.validation.js
modules/conversation/conversation.validation.js
```

---

## 4. Request Flow in Your Project

Example route:

```txt
POST /api/v1/auth/signup
```

Actual project flow:

```txt
Client / Frontend
      |
      v
backend/src/app.js
      |
      | app.use("/api/v1", v1Routes)
      v
backend/src/routes/v1.routes.js
      |
      | router.use("/auth", authRoutes)
      v
backend/src/modules/auth/auth.routes.js
      |
      | router.post("/signup", limiter, validate(registerSchema), signupController)
      v
backend/src/middleswares/validation.middleware.js
      |
      | registerSchema checks req.body
      v
backend/src/modules/auth/auth.controller.js
      |
      | signupController reads username, email, password
      v
backend/src/modules/auth/auth.service.js
      |
      | signupService creates user / sends email / business logic
      v
backend/src/modules/auth/auth.model.js
      |
      | MongoDB user document
      v
Response goes back to client
```

If validation fails:

```txt
Client
  |
  v
Route
  |
  v
Validation Middleware
  |
  +-- Zod error
        |
        v
     error.middleware.js
        |
        v
     400 response
```

So the controller should run only when data is valid.

---

## 5. What Is a Zod Schema?

A schema is a rulebook for data.

For signup:

```txt
username -> must be string, minimum 3 chars, maximum 18 chars
email    -> must be valid email
password -> must be string, minimum 6 chars
```

In Zod:

```js
import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().trim().min(3).max(18),
  email: z.string().trim().email(),
  password: z.string().min(6),
});
```

This means request body must be an object like:

```json
{
  "username": "aalok",
  "email": "aalok@gmail.com",
  "password": "secret123"
}
```

---

## 6. Common Zod Methods You Should Know

You do not need to learn everything at once. For this project, know these first:

```js
z.string()
```

Value must be a string.

```js
z.string().trim()
```

Removes extra spaces from start and end.

```js
z.string().email()
```

Value must be a valid email.

```js
z.string().min(6)
```

String must have at least 6 characters.

```js
z.string().max(18)
```

String must have maximum 18 characters.

```js
z.object({ ... })
```

Used when request body is an object.

```js
z.enum(["admin", "user"])
```

Used when value must be one option from a fixed list.

```js
z.string().optional()
```

Field is not required.

---

## 7. Your Auth Validation Example

In your file:

```txt
backend/src/modules/auth/auth.validation.js
```

You can keep auth schemas like this:

```js
import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().trim().min(3).max(18),
  email: z.string().trim().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});
```

### Register Schema Meaning

```js
username: z.string().trim().min(3).max(18)
```

This means:

- `username` must be text.
- Extra spaces are removed.
- Minimum length is 3.
- Maximum length is 18.

```js
email: z.string().trim().email()
```

This means:

- `email` must be text.
- Extra spaces are removed.
- It must look like a valid email.

```js
password: z.string().min(6)
```

This means:

- `password` must be text.
- Minimum length is 6.

---

## 8. `parse` vs `safeParse`

Zod gives two common ways to validate.

### `parse`

```js
const data = registerSchema.parse(req.body);
```

If data is valid, it returns clean data.

If data is invalid, it throws an error.

### `safeParse`

```js
const result = registerSchema.safeParse(req.body);

if (!result.success) {
  console.log(result.error);
}
```

If data is valid:

```js
{
  success: true,
  data: validatedData
}
```

If data is invalid:

```js
{
  success: false,
  error: zodError
}
```

For Express middleware, `safeParse` is usually easier because you can manually send or forward a clean error.

---

## 9. Validation Middleware

Instead of writing validation inside every controller, create one reusable middleware.

File:

```txt
backend/src/middleswares/validation.middleware.js
```

Example:

```js
import ApiError from "../helpers/apiError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");

      return next(new ApiError(400, message, "VALIDATION_ERROR"));
    }

    req.body = result.data;
    next();
  };
};
```

What this middleware does:

```txt
1. Receives a schema.
2. Checks req.body using schema.safeParse().
3. If invalid, sends error to error middleware.
4. If valid, replaces req.body with cleaned data.
5. Calls next() so controller can run.
```

Important line:

```js
req.body = result.data;
```

Why?

Because Zod may clean the data.

Example:

```txt
"  aalok@gmail.com  "
```

becomes:

```txt
"aalok@gmail.com"
```

So your controller receives clean data.

---

## 10. How to Use Validation in Routes

File:

```txt
backend/src/modules/auth/auth.routes.js
```

Example:

```js
import express from "express";
import limiter from "../../config/rateLimit.js";
import { validate } from "../../middleswares/validation.middleware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { signupController, loginController } from "./auth.controller.js";

const router = express.Router();

router.post("/signup", limiter, validate(registerSchema), signupController);
router.post("/login", limiter, validate(loginSchema), loginController);

export default router;
```

Read this line carefully:

```js
router.post("/signup", limiter, validate(registerSchema), signupController);
```

Execution order:

```txt
1. limiter
2. validate(registerSchema)
3. signupController
```

If validation fails, `signupController` will not run.

---

## 11. Controller Before and After Zod

Before Zod, controller may need manual checks:

```js
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and Password are required");
    }

    const result = await loginService({ email, password });

    res.status(200).json({
      success: true,
      message: "Login Successful!",
    });
  } catch (error) {
    next(error);
  }
};
```

After Zod validation in route:

```js
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await loginService({ email, password });

    res.status(200).json({
      success: true,
      message: "Login Successful!",
    });
  } catch (error) {
    next(error);
  }
};
```

Why can we remove the manual `if (!email || !password)`?

Because `validate(loginSchema)` already checked it before the controller.

---

## 12. Real Signup Example

Request:

```http
POST /api/v1/auth/signup
Content-Type: application/json
```

Body:

```json
{
  "username": "  aalok  ",
  "email": "  aalok@gmail.com  ",
  "password": "secret123"
}
```

Zod output after validation:

```json
{
  "username": "aalok",
  "email": "aalok@gmail.com",
  "password": "secret123"
}
```

Then controller gets:

```js
const { username, email, password } = req.body;
```

Then service gets:

```js
await signupService({ username, email, password });
```

This is the clean flow.

---

## 13. Real Login Example

Request:

```http
POST /api/v1/auth/login
Content-Type: application/json
```

Body:

```json
{
  "email": "aalok@gmail.com",
  "password": "secret123"
}
```

Route:

```js
router.post("/login", limiter, validate(loginSchema), loginController);
```

Flow:

```txt
loginSchema validates req.body
      |
      v
loginController extracts email and password
      |
      v
loginService checks user and password
      |
      v
controller sets accessToken and refreshToken cookies
      |
      v
response sent to user
```

---

## 14. Validating Other Request Parts

Most beginner examples validate only `req.body`.

But APIs can receive data from:

```txt
req.body    -> POST/PATCH JSON data
req.query   -> URL query values
req.params  -> route parameters
req.cookies -> cookie values
```

Examples from your auth module:

```txt
signup          -> req.body
login           -> req.body
verify-email    -> req.query.token
reset-password  -> req.body.token and req.body.newPassword
```

For now, focus mostly on `req.body`. Later you can make middleware support `body`, `query`, and `params`.

Example advanced version:

```js
export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(new ApiError(400, "Invalid request data", "VALIDATION_ERROR"));
    }

    req[source] = result.data;
    next();
  };
};
```

Usage:

```js
router.get("/verify-email", limiter, validate(verifyEmailSchema, "query"), verifyEmailController);
```

---

## 15. More Schemas You May Need

For this project, these auth schemas are useful.

```js
export const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
});
```

```js
export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1),
  newPassword: z.string().min(6),
});
```

```js
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});
```

```js
export const updateProfileSchema = z.object({
  username: z.string().trim().min(3).max(18).optional(),
  bio: z.string().trim().max(160).optional(),
});
```

Important thought:

```txt
Required field -> normal Zod rule
Optional field -> add .optional()
```

Example:

```js
username: z.string().trim().min(3).max(18)
```

This is required.

```js
username: z.string().trim().min(3).max(18).optional()
```

This is optional.

---

## 16. Where Validation Should Not Go

Do not put Zod validation everywhere randomly.

Good:

```txt
auth.validation.js
validation.middleware.js
auth.routes.js
```

Avoid:

```txt
Putting many validation if-checks inside controller.
Putting Zod schemas inside service files.
Putting auth validation inside app.js.
Repeating same schema in many files.
```

Simple rule:

```txt
Schema lives in module validation file.
Middleware runs schema.
Route connects middleware and controller.
Controller assumes request data is already valid.
```

---

## 17. What You Should Know Till Now

As a final year student building this project, you should be comfortable with:

- What Zod is.
- Why backend validation is required.
- How to create `z.object`.
- How to validate strings, emails, min/max length.
- Difference between `parse` and `safeParse`.
- How middleware works in Express.
- How to attach validation middleware before controller.
- How request flows through your project.
- Why controller becomes cleaner after validation.

You do not need deep advanced Zod topics right now:

- Complex transformations.
- Custom async validation.
- Discriminated unions.
- TypeScript inference.
- Very advanced error formatting.

Learn those later when your project actually needs them.

---

## 18. Important Zod Revision List for This Project

This is the quick list you should revise before using Zod in your backend.

| Zod / Concept | Use in your project |
| --- | --- |
| `import { z } from "zod"` | Imports Zod so you can create validation schemas. |
| `z.object({ ... })` | Validates complete request body objects like signup, login, reset password. |
| `z.string()` | Checks that a field is text, like `username`, `email`, `password`, `token`, `bio`. |
| `.trim()` | Removes extra spaces from user input before controller receives it. |
| `.email()` | Checks that email fields contain a valid email format. |
| `.min(number)` | Sets minimum length, useful for password and username. |
| `.max(number)` | Sets maximum length, useful for username and bio. |
| `.optional()` | Makes a field optional, useful for update profile where user may send only `username` or only `bio`. |
| `z.enum([...])` | Allows only fixed values, useful later for roles like `user`, `admin`, `moderator`. |
| `.parse(data)` | Validates data and throws error if invalid. Good to know, but less comfortable for middleware. |
| `.safeParse(data)` | Validates data and returns `success: true/false`. Best for Express validation middleware. |
| `result.success` | Tells whether validation passed or failed after `safeParse`. |
| `result.data` | Clean validated data returned by Zod when validation succeeds. |
| `result.error.issues` | List of validation errors when validation fails. Useful for creating error messages. |
| `req.body = result.data` | Replaces raw body with clean validated body before controller runs. |
| `validate(schema)` | Your reusable middleware idea: receives a schema and validates request data. |
| `next(error)` | Sends validation error to global error middleware. |
| `req.body` | Used for POST/PATCH data like signup, login, reset password. |
| `req.query` | Used for URL query values like `/verify-email?token=...`. |
| `req.params` | Used for route values like `/users/:id`, if you add such routes later. |

### Project Examples

Signup needs:

```js
username: z.string().trim().min(3).max(18)
email: z.string().trim().email()
password: z.string().min(6)
```

Login needs:

```js
email: z.string().trim().email()
password: z.string().min(6)
```

Reset password needs:

```js
token: z.string().trim().min(1)
newPassword: z.string().min(6)
```

Update profile needs:

```js
username: z.string().trim().min(3).max(18).optional()
bio: z.string().trim().max(160).optional()
```

Most important combo for your project:

```js
const result = schema.safeParse(req.body);

if (!result.success) {
  return next(new ApiError(400, "Invalid request data", "VALIDATION_ERROR"));
}

req.body = result.data;
next();
```

Remember:

```txt
Schema checks data.
safeParse gives result.
result.data gives clean data.
Controller uses only clean data.
```

---

## 19. Quick Revision

Zod schema:

```js
export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});
```

Validation middleware:

```js
router.post("/login", limiter, validate(loginSchema), loginController);
```

Flow:

```txt
Client request
  -> app.js
  -> v1.routes.js
  -> auth.routes.js
  -> validate(loginSchema)
  -> loginController
  -> loginService
  -> auth.model.js / database
  -> response
```

Main idea:

```txt
Zod protects your backend by checking request data before business logic runs.
```
