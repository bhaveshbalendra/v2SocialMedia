const RouteSpinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div
      className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"
      aria-label="Loading..."
    />
  </div>
);

export default RouteSpinner;
