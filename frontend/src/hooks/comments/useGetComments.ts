import { useGetPostCommentsQuery } from "@/store/apis/commentApi";
import { setComment } from "@/store/slices/postSlice";
import { useEffect } from "react";
import { useAppDispatch } from "../redux/useAppDispatch";

const useGetComments = (postId: string, nextCursor?: string) => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetPostCommentsQuery({ postId, nextCursor });

  useEffect(() => {
    if (data?.success) {
      dispatch(
        setComment({
          comments: data.comments,
          postId,
          pagination: data.pagination,
        })
      );
    }
  }, [data, dispatch, postId]);

  return { isLoading };
};
export default useGetComments;
