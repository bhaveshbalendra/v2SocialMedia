import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "@/store/store"; // Import the RootState type from your store

// Use throughout your app instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
