import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Dummy data for demonstration
const user = {
  username: "johndoe",
  name: "John Doe",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  bio: "Photographer | Traveler | Dreamer",
  posts: 34,
  followers: 1200,
  following: 180,
  isOwnProfile: true,
};

const posts = [
  // Replace with your real post data (images, videos, etc.)
  { id: 1, url: "https://source.unsplash.com/random/300x300?sig=1" },
  { id: 2, url: "https://source.unsplash.com/random/300x300?sig=2" },
  { id: 3, url: "https://source.unsplash.com/random/300x300?sig=3" },
  { id: 4, url: "https://source.unsplash.com/random/300x300?sig=4" },
  { id: 5, url: "https://source.unsplash.com/random/300x300?sig=5" },
  { id: 6, url: "https://source.unsplash.com/random/300x300?sig=6" },
];

const ProfilePage = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <Avatar className="w-28 h-28">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
            <span className="text-xl font-semibold">{user.username}</span>
            {user.isOwnProfile && (
              <Button size="sm" variant="outline">
                Edit Profile
              </Button>
            )}
          </div>
          <div className="flex gap-6 text-sm mb-2">
            <span>
              <span className="font-bold">{user.posts}</span> posts
            </span>
            <span>
              <span className="font-bold">{user.followers}</span> followers
            </span>
            <span>
              <span className="font-bold">{user.following}</span> following
            </span>
          </div>
          <div className="text-muted-foreground">{user.bio}</div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-2">
        {posts.map((post) => (
          <Card key={post.id} className="aspect-square overflow-hidden group">
            <CardContent className="p-0 h-full w-full">
              <img
                src={post.url}
                alt="Post"
                className="object-cover w-full h-full group-hover:scale-105 transition-transform"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
