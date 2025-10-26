import { TeamSettingsGrid } from "@/components/TeamSettingsGrid";

// Example: replace with your actual fetch from API or database
async function getTeamById(id: string) {
  // This is just a mock. Replace it with real API call.
  const teams = [
    { id: "1", name: "Team Alpha", description: "This is the team description" },
    { id: "2", name: "Team Beta", description: "Handles marketing campaigns" },
    { id: "3", name: "Team Gamma", description: "This is the team description" },
    { id: "4", name: "Team Delta", description: "Handles marketing campaigns" },
    { id: "5", name: "Team Omega", description: "This is the team description" },
  ];
  return teams.find(team => team.id === id) || null;
}

interface TeamSettingsPageProps {
  params: { id: string };
}

export default async function TeamSettingsPage({ params }: TeamSettingsPageProps) {
  const teamId = params.id;
  const team = await getTeamById(teamId);

  if (!team) {
    return <div className="text-center text-red-500">Team not found</div>;
  }

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-semibold tracking-tight">Team Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your team information and members.
            </p>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 mt-8 mb-14 overflow-auto">
          <TeamSettingsGrid
            teamName={team.name}
            teamDescription={team.description}
          />
        </main>
      </div>
    </div>
  );
}
