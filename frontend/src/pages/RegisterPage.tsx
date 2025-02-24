import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useAuth } from "../context/auth_context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { User } from "../models/User";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles: string[];
  }) => {
    setLoading(true);
    const regData = new User(
      values.firstName,
      values.lastName,
      values.email,
      values.password,
      values.roles
    );
    try {
      await AuthService.register(regData);
    } catch (error) {
      message.error("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-4">
      <Card className="w-full max-w-sm shadow-md rounded-xl p-6 bg-white">
        <div className="text-center mb-6">
          <Title level={2} className="text-blue-600 font-bold">
            Create an Account
          </Title>
          <Text className="text-gray-500">Join Edura today!</Text>
        </div>

        <Form layout="vertical" onFinish={handleRegister} className="space-y-4">
          <Form.Item
            label={
              <span className="font-medium text-gray-700">First Name</span>
            }
            name="firstName"
            rules={[
              { required: true, message: "Please enter your first name!" },
            ]}
          >
            <Input placeholder="Enter your first name" size="large" />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700">Last Name</span>}
            name="lastName"
            rules={[
              { required: true, message: "Please enter your last name!" },
            ]}
          >
            <Input placeholder="Enter your last name" size="large" />
          </Form.Item>

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
            rules={[
              { required: true, message: "Please enter a password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password placeholder="Enter a password" size="large" />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-medium text-gray-700">
                Confirm Password
              </span>
            }
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm password" size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Register
          </Button>
        </Form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-500 font-medium hover:underline"
          >
            Login here
          </a>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
