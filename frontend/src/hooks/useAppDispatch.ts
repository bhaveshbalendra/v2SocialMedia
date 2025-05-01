import type { AppDispatch } from "@/store/store"; // Import the AppDispatch type from your store
import { useDispatch } from "react-redux";

// Use throughout your app instead of plain `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>();
