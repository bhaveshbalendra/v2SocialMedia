import { useFetchConversationsQuery } from "@/store/apis/chatApi";
import { setConversations } from "@/store/slices/chatSlice";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useAppDispatch } from "../redux/useAppDispatch";
import { useAppSelector } from "../redux/useAppSelector";

const useGetConversations = () => {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  const { data, isLoading, isError } = useFetchConversationsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data?.conversations) {
      console.log(data);
      dispatch(setConversations(data.conversations));
    }
  }, [data, dispatch]);

  return { isLoading, isError };
};

export default useGetConversations;
