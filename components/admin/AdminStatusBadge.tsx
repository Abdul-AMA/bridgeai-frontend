interface AdminStatusBadgeProps {
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
  inactive: "bg-gray-100 text-gray-600",
  archived: "bg-yellow-100 text-yellow-700",
};

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${style}`}>
      {status}
    </span>
  );
}
