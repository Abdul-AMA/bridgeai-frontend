import { Input } from "@/components/ui/input";

export function TeamsSearch() {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Input placeholder="Name, email or phone" className="max-w-sm" />
      <button className="btn btn-outline">Filters</button>
    </div>
  );
}
