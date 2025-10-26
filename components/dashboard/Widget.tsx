interface WidgetProps {
  title: string;
  subtitle?: string;
  isTable?: boolean;
  children?: React.ReactNode;
  tableData?: { name: string; status?: string }[];
}

export function Widget({ title, subtitle, isTable, children, tableData }: WidgetProps) {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "approved":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "مُرجع":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col">
      <div className="mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      {isTable && tableData ? (
        <ul className="space-y-2">
          {tableData.map((row, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">{row.name}</span>
              {row.status && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                    row.status
                  )}`}
                >
                  {row.status}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        children
      )}
    </div>
  );
}
