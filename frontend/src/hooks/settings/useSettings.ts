import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { useGetUserSettingsQuery } from "@/store/apis/settingsApi";
import { setSettings } from "@/store/slices/settingsSlice";
import { useEffect } from "react";

const useSettings = () => {
  const { data, isLoading, error } = useGetUserSettingsQuery();
  const dispatch = useAppDispatch();
  const userSettings = useAppSelector((state) => state.settings);
  useEffect(() => {
    if (data) {
      dispatch(setSettings(data.settings));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return { userSettings, isLoading, error };
};

export default useSettings;
