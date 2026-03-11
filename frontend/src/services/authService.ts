import API from "./API";

export const login = (data:any) => {
  return API.post("/auth/login", data);
};