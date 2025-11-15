"use client";

import { Card } from "@/components/ui/card";
import { AvatarList } from "./AvatarList";
import { StatusBadge } from "./StatusBadge";
import { useRouter } from "next/navigation";
import { TeamActionsMenu } from "@/components/teams/TeamActionsMenu";

export function CardGrid<
  T extends {
    id: number;
    name: string;
    lastUpdate: string;
    members?: string[];
    team?: string[];
    status: string;
    description?: string;
  }
>({
  items,
  type = "project", // "project" or "team"
  showAvatars = true,
  onItemsChange,
}: {
  items: T[];
  type?: "project" | "team";
  showAvatars?: boolean;
  onItemsChange?: () => void;
}) {
  const router = useRouter();

  const handleCardClick = (id: number) => {
    if (type === "team") {
      router.push(`/teams/${id}/dashboard`);
    } else {
      router.push(`/projects/${id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card
          key={item.id}
          className="relative flex flex-col justify-between p-6 rounded-xl hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleCardClick(item.id)}
        >
          {/* Top: Name + Status */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <StatusBadge status={item.status} />
          </div>

          <p className="text-sm text-muted-foreground">
            Last update: {item.lastUpdate}
          </p>

          {/* Bottom: Members / Team + Dropdown */}
          <div className="flex items-center justify-between mt-4">
            {showAvatars ? (
              <AvatarList names={type === "team" ? item.members! : item.team!} />
            ) : (
              <div /> // empty spacer
            )}
            {type === "team" ? (
              <TeamActionsMenu 
                teamId={item.id}
                teamName={item.name}
                teamStatus={item.status}
                teamDescription={item.description}
                onActionComplete={onItemsChange}
              />
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  );
}
