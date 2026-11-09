import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  if (response.data.token) {
    localStorage.setItem("rentsure_token", response.data.token);
    localStorage.setItem(
      "rentsure_user",
      JSON.stringify(response.data.user)
    );
  }

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("rentsure_token");
  localStorage.removeItem("rentsure_user");
};