"use client";

import { firebaseConfig } from "@/firebase/firebaseConfig";
import axios from "axios";
import { initializeApp } from "firebase/app";

export default function layout({ children }: { children: React.ReactNode }) {
  axios.defaults.baseURL = "http://localhost:11434";
  axios.defaults.headers["Content-Type"] = "application/json";

  initializeApp(firebaseConfig);

  return <>{children}</>;
}
