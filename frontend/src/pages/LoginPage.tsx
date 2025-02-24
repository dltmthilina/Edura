import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await AuthService.login(values);
      if (res.status === 200) {
        console.log(res.data.token);
        login(res.data.token);
      }
    } catch (error) {
      message.error("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-4">
      <Card className="w-full max-w-sm shadow-md rounded-xl p-6 bg-white">
        <div className="text-center mb-6">
          <Title level={2} className="text-blue-600 font-bold">
            Welcome to Edura
          </Title>
          <Text className="text-gray-500">Sign in to continue</Text>
        </div>

        <Form layout="vertical" onFinish={handleLogin} className="space-y-4">
          <Form.Item
            label={<span className="font-medium text-gray-700">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email address!" },
            ]}
          >
            <Input placeholder="Enter your email" size="large" />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter your password" size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Login
          </Button>
        </Form>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-500 font-medium hover:underline"
          >
            Register here
          </a>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
