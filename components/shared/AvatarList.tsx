const avatarColors = [
  "bg-[#FF7F50]",
  "bg-[#6A5ACD]",
  "bg-[#20B2AA]",
  "bg-[#FF69B4]",
  "bg-[#FFA500]",
  "bg-[#00CED1]",
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
    <div className="flex -space-x-2">
      {names.slice(0, 3).map((name, idx) => (
        <div
          key={idx}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white ${avatarColors[idx % avatarColors.length]}`}
          title={name}
        >
          {getInitials(name)}
        </div>
      ))}
      {names.length > 3 && (
        <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-xs font-medium border-2 border-white">
          +{names.length - 3}
        </div>
      )}
    </div>
  );
}
