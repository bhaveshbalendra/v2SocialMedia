import { createSlice } from "@reduxjs/toolkit";

interface IUIState {
  theme: "light" | "dark" | "system";
}

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (
    savedTheme &&
    (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")
  ) {
    return savedTheme;
  }
};

const initialState = {
  theme: getInitialTheme(),
  sidebarOpen: false,
  isLoading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
  },
});

export const { setTheme } = uiSlice.actions;
export default uiSlice.reducer;
