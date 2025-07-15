import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useMarkAllAsReadMutation } from "@/store/apis/notificationApi";
import { setMarkAllAsRead } from "@/store/slices/notificationSlice";

const useMarkReadNotification = () => {
  const [markAllAsRead, { isLoading, error }] = useMarkAllAsReadMutation();
  const dispatch = useAppDispatch();

  const markAllNotificationsAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      dispatch(setMarkAllAsRead());
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  return { isLoading, error, markAllNotificationsAsRead };
};

export default useMarkReadNotification;
