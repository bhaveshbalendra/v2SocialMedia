import { Toaster } from "sonner";
import { ThemeProvider } from "../ui/theme-provider";

const AppLayout = () => {
  return (
    <ThemeProvider>
      <Toaster />
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground antialiased">
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-auto">
            {/* Your content here */}
          </main>
        </div>
        <footer className="flex items-center justify-between p-4 bg-gray-800 text-white"></footer>
      </div>
    </ThemeProvider>
  );
};

export default AppLayout;
