/**
 * Project Info Fields Component
 * Displays editable project title and description
 */

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProjectInfoFieldsProps {
  projectTitle: string;
  projectDescription: string;
  onChangeTitle: (value: string) => void;
  onChangeDescription: (value: string) => void;
}

export function ProjectInfoFields({
  projectTitle,
  projectDescription,
  onChangeTitle,
  onChangeDescription,
}: ProjectInfoFieldsProps) {
  return (
    <div className="space-y-4 border-b pb-6">
      <div>
        <Label>Project Title</Label>
        <Input
          value={projectTitle || ""}
          onChange={(e) => onChangeTitle(e.target.value)}
          className="font-bold text-lg"
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={projectDescription || ""}
          onChange={(e) => onChangeDescription(e.target.value)}
          className="h-24"
        />
      </div>
    </div>
  );
}
