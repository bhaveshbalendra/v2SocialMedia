// src/pages/HomePage.tsx
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  useGetAuthenticatedFeedQuery,
  useGetPublicFeedQuery,
} from "@/store/apis/feedApi.ts";

const HomePage = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // // Conditional fetching based on auth status
  // const { data: publicData, isLoading: publicLoading } = useGetPublicFeedQuery(
  //   undefined,
  //   { skip: isAuthenticated }
  // );

  // const { data: authData, isLoading: authLoading } =
  //   useGetAuthenticatedFeedQuery(undefined, { skip: !isAuthenticated });

  // // Determine which data to show
  // const mediaData = isAuthenticated ? authData : publicData;
  // const isLoading = isAuthenticated ? authLoading : publicLoading;

  // if (isLoading) return <div>Loading media...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isAuthenticated ? "Your Feed" : "Public Media"}
      </h1>
      <div className="grid grid-cols-3 gap-4"></div>
    </div>
  );
};

export default HomePage;
