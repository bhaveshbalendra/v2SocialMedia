import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const users = [
  {
    name: "Bhavesh",
    src: "https://avatar.iran.liara.run/public/boy",
  },
  {
    name: "Aisha",
    src: "https://avatar.iran.liara.run/public/girl",
  },
  {
    name: "Rohan",
    src: "https://avatar.iran.liara.run/public/boy2",
  },
  {
    name: "Priya",
    src: "https://avatar.iran.liara.run/public/girl2",
  },
];

const RightSidebar = () => {
  // Track followed users by index
  const [followed, setFollowed] = useState(Array(users.length).fill(false));

  const handleFollow = (idx: number) => {
    setFollowed((prev) => prev.map((f, i) => (i === idx ? !f : f)));
  };

  return (
    <div className="w-full space-y-4 p-4">
      {users.map((user, idx) => (
        <Card key={idx}>
          <CardContent className="flex items-center justify-between p-3 gap-2">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user.src} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{user.name}</span>
            </div>
            <Button
              variant={followed[idx] ? "secondary" : "default"}
              onClick={() => handleFollow(idx)}
            >
              {followed[idx] ? "Following" : "Follow"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RightSidebar;
