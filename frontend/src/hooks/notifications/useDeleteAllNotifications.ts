import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { useDeleteAllNotificationsMutation } from "@/store/apis/notificationApi";
import { clearNotifications } from "@/store/slices/notificationSlice";
import { toast } from "sonner";

const useDeleteAllNotifications = () => {
  const [deleteAllNotifications, { isLoading, error }] =
    useDeleteAllNotificationsMutation();
  const dispatch = useAppDispatch();

  const handleDeleteAllNotifications = async () => {
    try {
      await deleteAllNotifications().unwrap();
      dispatch(clearNotifications());
      toast.success("All notifications deleted successfully");
    } catch (err) {
      console.error("Failed to delete all notifications:", err);
      toast.error("Failed to delete all notifications");
    }
  };

  return { isLoading, error, handleDeleteAllNotifications };
};

export default useDeleteAllNotifications;

