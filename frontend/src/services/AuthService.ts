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

  async login() {}
}

export default new AuthService();
