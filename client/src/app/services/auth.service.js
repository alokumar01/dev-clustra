import { api } from "@/lib/api/axios";

export async function loginWithAxios(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

export async function signupWithAxios(credentials) {
  const response = await api.post("/auth/signup", credentials);
  return response.data;
}

export async function resendVerificationEmail(email) {
  const response = await api.post("/auth/resend-email", { email });
  return response.data;
}

export async function verifyVerificationEmail(token) {
  const response = await api.get("/auth/verify-email", {
    params: { token },
  });
  return response.data;
}

export async function forgotPassword(email) {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}

export async function resetPassword(token, newPassword) {
  const response = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data;
}

export async function updateAvatar(formData) {
  const response = await api.patch("/user/update-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function updateProfile({ username, bio }) {
  const response = await api.patch("/auth/update-profile", {
    username,
    bio,
  });
  return response.data;
}

export async function searchUser(query) {
  const response = await api.get("/user/search", {
    params: { query },
  });
  return response.data;
}

export async function checkUsername(username) {
  const response = await api.get("/user/check-username", {
    params: { username },
  });
  return response.data;
}
