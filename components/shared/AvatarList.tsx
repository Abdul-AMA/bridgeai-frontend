const avatarColors = [
  "bg-gradient-to-br from-blue-500 to-blue-600",
  "bg-gradient-to-br from-purple-500 to-purple-600",
  "bg-gradient-to-br from-green-500 to-green-600",
  "bg-gradient-to-br from-pink-500 to-pink-600",
  "bg-gradient-to-br from-orange-500 to-orange-600",
  "bg-gradient-to-br from-cyan-500 to-cyan-600",
];

export function AvatarList({ names = [] }: { names?: string[] }) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (!names || names.length === 0) {
    return null;
  }

  return (
    <div className="flex -space-x-3">
      {names.slice(0, 3).map((name, idx) => (
        <div
          key={idx}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-md ${avatarColors[idx % avatarColors.length]} transition-transform hover:scale-110 hover:z-10`}
          title={name}
        >
          {getInitials(name)}
        </div>
      ))}
      {names.length > 3 && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 text-white flex items-center justify-center text-xs font-semibold border-2 border-white shadow-md transition-transform hover:scale-110 hover:z-10">
          +{names.length - 3}
        </div>
      )}
    </div>
  );
}
