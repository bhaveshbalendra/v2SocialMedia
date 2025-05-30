// src/components/states/AppLoading.tsx
export function AppLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-foreground">
          Loading application...
        </p>
      </div>
    </div>
  );
}
