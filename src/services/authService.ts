import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {

  const response = await axios.post(
    `${API_URL}/register`,
    data
  );

  return response.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {

  const response = await axios.post(
    `${API_URL}/login`,
    data
  );

  return response.data;
};