import  { z } from "zod"

// SIGNUP VALIDATION SCHEMA
export const registerSchema = z.object({
    username: z.string().trim()
        .min(3, {
            message: "Username must be at least 3 characters long."
        })
        .max(18, {
            message: "Username cannot exceed 18 characters."
        }),
    email: z.string().trim()
        .email({
            message: "Please enter a valid email address."
        }),
    password: z.string()
        .min(6, {
            message: "Password must be at least 6 characters long."
        })
});

// VERIFY EMAIL VALIDATION SCHEMA
export const verifyEmailSchema = z.object({
    token: z.string().trim().nonempty({
        message: "Verification token is required."
    })
});

// RESEND EMAIL VALIDATION SCHEMA
export const resendEmailSchema = z.object({
    email: z.string().trim().email({
        message: "Please enter a valid email address."
    })
});

// LOGIN VALIDATION SCHEMA
export const loginSchema = z.object({
    email: z.string().trim()
    .email({
        message: "Please enter a valid email address."
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long."
    }),
});

// UPDATE PROFILE VALIDATION SCHEMA
export const updateProfileSchema = z.object({
    username: z.string().trim()
        .min(3, {
            message: "Username must be at least 3 characters long."
        })
        .max(18, {
            message: "Username cannot exceed 18 characters."
        }),
        bio: z.string().trim()
            .max(160, {
                message: "Bio cannot exceed 160 characters."
            })

})

// CHANGE PASSWORD VALIDATION SCHEMA
export const changePasswordSchema = z.object({
    oldPassword: z.string().min(6, {
        message: "Old password must be at least 6 characters long."
    }),
    newPassword: z.string().min(6, {
        message: "New password must be at least 6 characters long."
    })
})

// FORGOT PASSWORD VALIDATION SCHEMA
export const forgotPasswordSchema = z.object({
    email: z.string().trim()
        .email({
            message: "Please enter a valid email address."
        })
})

// RESET PASSWORD VALIDATION SCHEMA
export const resetPasswordSchema = z.object({
    token: z.string().trim().nonempty({
        message: "Reset token is required."
    }),
    newPassword: z.string().min(6, {
        message: "New password must be at least 6 characters long."
    })
})
