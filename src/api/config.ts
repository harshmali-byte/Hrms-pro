import { Platform } from "react-native";

/** Override with EXPO_PUBLIC_API_URL (e.g. http://192.168.1.5:3001 for a physical device). */
function defaultHost(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3001";
  }
  return "http://localhost:3001";
}

export const API_BASE = `${defaultHost()}/api`;
