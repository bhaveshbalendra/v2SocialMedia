import SuggestedUsers from "@/components/suggestions/SuggestedUsers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import { PATH } from "@/routes/pathConstants";
import { Link } from "react-router";

const RightSidebar = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="w-full space-y-4 p-4">
      {isAuthenticated ? (
        <SuggestedUsers />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Welcome to Social Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Join our community to discover amazing people and connect with
              friends.
            </p>
            <div className="space-y-2">
              <Link to={PATH.SIGNUP}>
                <Button className="w-full">Sign up</Button>
              </Link>
              <Link to={PATH.LOGIN}>
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RightSidebar;
