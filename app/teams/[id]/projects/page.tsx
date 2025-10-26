import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { CardGrid } from "@/components/shared/CardGrid";

export default function ProjectsList() {
  const projects = [
    { id: 1, name: "Website Redesign", lastUpdate: "Sep 10, 2025", team: ["Sarah", "Omar", "Lina", "Ali"], status: "Active" },
    { id: 2, name: "Mobile App", lastUpdate: "Sep 5, 2025", team: ["Omar", "Hana"], status: "Completed" },
    { id: 3, name: "Marketing Campaign", lastUpdate: "Sep 7, 2025", team: ["Ali", "Sara", "Lina"], status: "Pending" },
  ];

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8  ">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage all projects for your team in one place.
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex items-center bg-[#fafafb] p-4 justify-between mb-7 gap-3 rounded">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <SearchBar placeholder="Search projects by name" />
            <Button variant="primary" size="sm">Filters</Button>
          </div>
          <Button variant="primary">Add Project</Button>
        </div>

        {/* Projects Grid */}
        <CardGrid items={projects} showAvatars={false} />
      </div>
    </div>
  );
}
