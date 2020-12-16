import { Platform } from "react-native";

export const isHtmlPlatform = () =>
  ["windows", "macos", "web"].includes(Platform.OS);
