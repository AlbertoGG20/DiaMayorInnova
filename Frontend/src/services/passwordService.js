import axios from 'axios';
import { API_BASE_URL } from '../config';

const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/password/forgot`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al procesar la solicitud' };
  }
};

const resetPassword = async (token, password, passwordConfirmation) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/password`, {
      user: {
        reset_password_token: token,
        password: password,
        password_confirmation: passwordConfirmation
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al procesar la solicitud' };
  }
};

export const passwordService = {
  forgotPassword,
  resetPassword
}; 