import axios from "axios";

export type DataSource = "mock" | "api";

const normalizeDataSource = (value: string | undefined): DataSource => {
  return value?.toLowerCase() === "mock" ? "mock" : "api";
};

export const DATA_SOURCE: DataSource = normalizeDataSource(
  import.meta.env.VITE_DATA_SOURCE,
);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3200/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
