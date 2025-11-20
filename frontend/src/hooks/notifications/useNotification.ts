import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { useGetNotificationsQuery } from "@/store/apis/notificationApi";
import { setNotifications } from "@/store/slices/notificationSlice";
import { useEffect } from "react";

const useNotification = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data, isLoading, error } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const dispatch = useAppDispatch();

  const { notifications, unreadCount } = useAppSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    if (data) {
      dispatch(setNotifications(data.notifications));
    }
  }, [data, dispatch]);

  return { notifications, unreadCount, isLoading, error };
};

export default useNotification;
