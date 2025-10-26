interface TeamsRowProps {
  name: string;
  email: string;
  mobile?: string;
  reviews?: string;
  sales?: string;
  createdAt: string;
}

export function TeamsRow({ name, email, mobile, reviews, sales, createdAt }: TeamsRowProps) {
  return (
    <tr className="hover:bg-gray-50 cursor-pointer">
      <td className="p-2">
        <input type="checkbox" className="form-checkbox" />
      </td>
      <td className="p-2 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          {name[0]}
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-sm text-gray-500">{email}</span>
        </div>
      </td>
      <td className="p-2">{mobile || "-"}</td>
      <td className="p-2">{reviews || "-"}</td>
      <td className="p-2">{sales || "-"}</td>
      <td className="p-2">{createdAt}</td>
    </tr>
  );
}
