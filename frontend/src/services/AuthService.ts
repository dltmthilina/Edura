import { User } from "../models/User";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

class AuthService {
  async register(userData: User) {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  }

  async login(loginData: { email: string; password: string }) {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  }
}

export default new AuthService();
