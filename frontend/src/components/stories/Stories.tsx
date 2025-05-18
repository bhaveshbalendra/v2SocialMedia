import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react"; // Lucide icon for the plus

const stories = [
  { name: "Bhavesh", src: "https://avatar.iran.liara.run/public/boy" },
  { name: "Aisha", src: "https://avatar.iran.liara.run/public/girl" },
  { name: "Rohan", src: "https://avatar.iran.liara.run/public/boy2" },
  { name: "Priya", src: "https://avatar.iran.liara.run/public/girl2" },
  { name: "Alex", src: "https://avatar.iran.liara.run/public/boy3" },
];

const Stories = () => {
  // Handler for add story (replace with your logic)
  const handleAddStory = () => {
    alert("Add story clicked!");
  };

  return (
    <div className="flex max-w-xl mx-auto pt-8 space-y-6 overflow-x-auto gap-4">
      {/* Add Story Button */}
      <button
        onClick={handleAddStory}
        className="flex flex-col items-center focus:outline-none"
        title="Add Story"
      >
        <Avatar className="w-16 h-16 border-2 border-dashed border-blue-400 bg-blue-50 hover:bg-blue-100 transition">
          <div className="flex items-center justify-center w-full h-full">
            <Plus className="w-8 h-8 text-blue-500" />
          </div>
          <AvatarFallback>+</AvatarFallback>
        </Avatar>
        <span className="text-xs mt-1 text-blue-500 font-medium">Add</span>
      </button>

      {/* User Stories */}
      {stories.map((story, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <Avatar className="w-16 h-16 border-2 border-blue-500">
            <AvatarImage src={story.src} alt={story.name} />
            <AvatarFallback>{story.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs mt-1">{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;
