import Feeds from "@/components/layout/Feeds";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  // useGetAuthenticatedFeedQuery,
  useGetPublicFeedQuery,
} from "@/store/apis/feedApi";

const HomePage = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Conditional fetching based on auth status
  const { data: publicData, isLoading: publicLoading } = useGetPublicFeedQuery(
    undefined,
    {
      skip: isAuthenticated,
    }
  );
  // const { data: authData, isLoading: authLoading } =
  //   useGetAuthenticatedFeedQuery(undefined, {
  //     skip: !isAuthenticated,
  //   });

  // Determine which data to show
  const feedData = isAuthenticated ? publicData : publicData;
  const isLoading = isAuthenticated ? publicLoading : publicLoading;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isAuthenticated ? "Your Feed" : "Public Media"}
      </h1>
      <Feeds posts={feedData?.posts ?? []} isLoading={isLoading} />
    </div>
  );
};

export default HomePage;
