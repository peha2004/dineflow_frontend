import axios from "axios";

const API_URL = "http://localhost:5000/api/tables";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getTables = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createTable = async (data: any) => {
  const res = await axios.post(
    API_URL,
    data,
    getAuthHeader()
  );
  return res.data;
};

export const updateTable = async (
  id: string,
  data: any
) => {
  const res = await axios.put(
    `${API_URL}/${id}`,
    data,
    getAuthHeader()
  );

  return res.data;
};

export const deleteTable = async (
  id: string
) => {
  const res = await axios.delete(
    `${API_URL}/${id}`,
    getAuthHeader()
  );

  return res.data;
};