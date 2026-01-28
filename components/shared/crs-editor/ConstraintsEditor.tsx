/**
 * Constraints Editor Component
 * Handles timeline, budget, and technical constraints
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StringListEditor } from "./StringListEditor";

interface ConstraintsEditorProps {
  timelineConstraints: string;
  budgetConstraints: string;
  technicalConstraints: string[];
  onChangeTimeline: (value: string) => void;
  onChangeBudget: (value: string) => void;
  onAddTechnical: () => void;
  onRemoveTechnical: (index: number) => void;
  onChangeTechnical: (index: number, value: string) => void;
}

export function ConstraintsEditor({
  timelineConstraints,
  budgetConstraints,
  technicalConstraints,
  onChangeTimeline,
  onChangeBudget,
  onAddTechnical,
  onRemoveTechnical,
  onChangeTechnical,
}: ConstraintsEditorProps) {
  return (
    <div className="space-y-6 border-b pb-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="font-semibold">Timeline Constraints</Label>
          <Input
            value={timelineConstraints || ""}
            onChange={(e) => onChangeTimeline(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label className="font-semibold">Budget Constraints</Label>
          <Input
            value={budgetConstraints || ""}
            onChange={(e) => onChangeBudget(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>

      <StringListEditor
        label="Technical Constraints"
        items={technicalConstraints || []}
        onAdd={onAddTechnical}
        onRemove={onRemoveTechnical}
        onChange={onChangeTechnical}
      />
    </div>
  );
}
