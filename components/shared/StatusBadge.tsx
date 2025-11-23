export function StatusBadge({ status }: { status: string }) {
  const statusStyles: { [key: string]: { text: string; bg: string } } = {
    Active: { text: "text-green-700", bg: "bg-green-100" },
    Completed: { text: "text-indigo-700", bg: "bg-indigo-100" },
    Pending: { text: "text-yellow-600", bg: "bg-yellow-100" },
    Inactive: { text: "text-red-700", bg: "bg-red-100" },
    Archived: { text: "text-gray-700", bg: "bg-gray-100" },
  };

  // Capitalize first letter to match keys
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  const style = statusStyles[formattedStatus] || { text: "text-gray-700", bg: "bg-gray-100" };

  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium ${style.text} ${style.bg}`}>
      {formattedStatus}
    </div>
  );
}
