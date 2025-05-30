import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { setTheme } from "@/store/slices/uiSlice";

export const useToggleTheme = () => {
  const dispatch = useAppDispatch();
  function toggle() {
    const theme = localStorage.getItem("theme");
    const toggle = theme === "dark" ? "light" : "dark";
    dispatch(setTheme(toggle));
  }

  return { toggle };
};
