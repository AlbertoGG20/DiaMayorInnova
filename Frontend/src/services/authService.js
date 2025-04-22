import http from "../http-common";
import axios from "axios";
import { API_BASE_URL } from "../config";

const authService = {
  validateToken: (token) =>
    http.post(`${API_BASE_URL}/validate_token`, {}, {
      headers: { "AUTH-TOKEN": token },
    }).then((response) => {
      return response;
    })
      .catch((error) => {
        console.error("Error al validar token:", error);
        throw error;
      }),

  signIn: (credentials, token = "") => {
    if (!credentials && !token) {
      throw new Error("Se requiere credentials o token para autenticarse.");
    }
    return axios.post(`${API_BASE_URL}/sign_in`, {}, {
      headers: {
        "Authorization": credentials ? `Basic ${credentials}` : token,
      }
    });
  },

  logOut: (token) =>
    http.delete(`${API_BASE_URL}/log_out`, {
      headers: {
        "Content-Type": "application/json",
        "AUTH-TOKEN": token,
      },
    }),
};

export default authService;
