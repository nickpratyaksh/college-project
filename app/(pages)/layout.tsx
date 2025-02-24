"use client";

import axios from "axios";

export default function layout({ children }: { children: React.ReactNode }) {
  axios.defaults.baseURL = "http://localhost:11434";
  // axios.defaults.headers["Authorization"] =
  //   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM0ZTZhYmM2LTEwOTktNDY5Yi04ZmM3LTUwZDI4MTc0NjFiYyJ9.1VviTugu_MzU4IL1TPakGlgaKaFh_I40fvIq9fPWgyw";
  axios.defaults.headers["Content-Type"] = "application/json";

  return <>{children}</>;
}
