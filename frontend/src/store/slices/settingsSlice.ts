import { Settings } from "@/types/settings.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  profile: {
    username: string;
    email: string;
    password: string;
    isPremium: boolean;
  };
  privacyAndSecurity: {
    isPrivate: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
  };
  accountManagement: {
    user: string;
  };
  connectedAppsAndIntegrations: {
    thirdPartyAppConnection: string;
  };
  paymentAndBilling: {
    history: string[];
  };
  theme: "light" | "dark" | "system";
}

const initialState: SettingsState = {
  profile: {
    username: "",
    email: "",
    password: "",
    isPremium: false,
  },
  privacyAndSecurity: {
    isPrivate: false,
  },
  notifications: {
    email: true,
    push: true,
  },
  accountManagement: {
    user: "",
  },
  connectedAppsAndIntegrations: {
    thirdPartyAppConnection: "",
  },
  paymentAndBilling: {
    history: [],
  },
  theme: "system",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setPrivacy: (state, action: PayloadAction<boolean>) => {
      state.privacyAndSecurity.isPrivate = action.payload;
    },
    setNotificationEmail: (state, action: PayloadAction<boolean>) => {
      state.notifications.email = action.payload;
    },
    setNotificationPush: (state, action: PayloadAction<boolean>) => {
      state.notifications.push = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
    },
    updateProfile: (
      state,
      action: PayloadAction<Partial<SettingsState["profile"]>>
    ) => {
      state.profile = { ...state.profile, ...action.payload };
    },

    setSettings: (state, action: PayloadAction<Settings>) => {
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        error: null,
      };
    },
    resetSettings: (state) => {
      return { ...initialState, theme: state.theme };
    },
  },
});

export const {
  setPrivacy,
  setNotificationEmail,
  setNotificationPush,
  setTheme,
  updateProfile,

  setSettings,
  resetSettings,
} = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
