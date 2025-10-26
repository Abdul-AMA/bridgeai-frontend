export function Placeholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
      <p className="font-semibold">No data available</p>
      <p className="text-sm">Add some data to see it here</p>
    </div>
  );
}
