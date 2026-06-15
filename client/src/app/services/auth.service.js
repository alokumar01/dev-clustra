import { api } from "@/lib/api/axios";

export async function loginWithAxios(credentials) {
  try {
    const response = await api.post("/auth/login", credentials);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// sign up 
export async function signupWithAxios(credentials) {
  try {
    const response = await api.post("/auth/signup", credentials);
    console.log("signup data: ", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

//resend verification email 
export async function resendVerificationEmail(email) {
  try {
    const response = await api.post("/auth/resend-email", { 
      email: email,
    });
    // console.log("resend-mail data: ", response.data);
    return response.data;
  } catch (error) {

    throw error;
  }
}

// VERIFY EMAIL
export async function verifyVerificationEmail(token) {
  try {

    const response = await api.get("/auth/verify-email", {
      params: { token }
    })

    return response.data;

  } catch (error) {
    throw error;
  }
}

// FORGOT PASSWORD
export async function forgotPassword(email) {
  try {

    const response = await api.post("/auth/forgot-password", {
      email: email,
    });

    return response.data;

  } catch (error) {
    throw error;
  }
}

// RESET PASSWORD
export async function resetPassword(token, newPassword) {
  try {
    
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword
    })

    return response.data;

  } catch (error) {
    throw error;
  }
}

// SERVER FETCH CURRENT USER (SERVER COMPONENT)


// Update profile avatar
export async function updateAvatar(formData) {
  try {

    const response = await api.patch("/user/update-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;

  } catch (error) {
    throw error;
  }
}

// Update profile

export async function updateProfile({ username, bio }) {
  try {

    const response = await api.patch("/auth/update-profile", {
      username: username,
      bio: bio
    })

    return response.data;

  } catch (error) {
    throw error;
  }
}