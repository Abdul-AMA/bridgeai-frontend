import { TeamsRow } from "./TeamsRow";

interface Team {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  reviews?: string;
  sales?: string;
  createdAt: string;
}

interface TeamsTableProps {
  teams: Team[];
}

export function TeamsTable({ teams }: TeamsTableProps) {
  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className="p-2">
            <input type="checkbox" />
          </th>
          <th className="p-2 text-left">Client name</th>
          <th className="p-2 text-left">Mobile number</th>
          <th className="p-2 text-left">Reviews</th>
          <th className="p-2 text-left">Sales</th>
          <th className="p-2 text-left">Created at</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team) => (
          <TeamsRow key={team.id} {...team} />
        ))}
      </tbody>
    </table>
  );
}
