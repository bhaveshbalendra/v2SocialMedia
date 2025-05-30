import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      {/* Stories skeleton */}
      <div className="flex gap-4 overflow-x-auto">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="w-12 h-3 mt-1 rounded-full" />
            </div>
          ))}
      </div>

      {/* Post skeletons */}
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="shadow">
            <CardHeader className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-24 h-4 rounded-full" />
                <Skeleton className="w-16 h-3 rounded-full" />
              </div>
              <div className="ml-auto">
                <Skeleton className="w-20 h-3 rounded-full" />
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <Skeleton className="w-3/4 h-5 rounded-full" />
              <Skeleton className="w-full h-3 rounded-full" />
              <Skeleton className="w-full h-48 rounded-md" />
              <div className="flex flex-wrap gap-2">
                {Array(3)
                  .fill(0)
                  .map((_, j) => (
                    <Skeleton key={j} className="w-12 h-4 rounded-full" />
                  ))}
              </div>
              <Skeleton className="w-full h-3 rounded-full" />
              <Skeleton className="w-3/4 h-3 rounded-full" />
            </CardContent>

            <CardFooter className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                {Array(4)
                  .fill(0)
                  .map((_, j) => (
                    <Skeleton key={j} className="w-8 h-8 rounded-full" />
                  ))}
              </div>
              <Skeleton className="w-16 h-4 rounded-full" />
            </CardFooter>
          </Card>
        ))}
    </div>
  );
};

export default PostSkeleton;
