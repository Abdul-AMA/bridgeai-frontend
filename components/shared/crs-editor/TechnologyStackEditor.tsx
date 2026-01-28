/**
 * Technology Stack Editor Component
 * Handles editing of frontend, backend, database, and other technologies
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface TechnologyStack {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  other?: string[];
}

interface TechnologyStackEditorProps {
  technologyStack: TechnologyStack;
  onAdd: (category: keyof TechnologyStack) => void;
  onRemove: (category: keyof TechnologyStack, index: number) => void;
  onChange: (category: keyof TechnologyStack, index: number, value: string) => void;
}

export function TechnologyStackEditor({
  technologyStack,
  onAdd,
  onRemove,
  onChange,
}: TechnologyStackEditorProps) {
  const categories: Array<keyof TechnologyStack> = [
    "frontend",
    "backend",
    "database",
    "other",
  ];

  return (
    <div className="space-y-4 border-b pb-6">
      <Label className="text-base font-semibold">Technology Stack</Label>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((tech) => (
          <div key={tech} className="bg-slate-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-3">
              <Label className="capitalize font-medium text-gray-700">
                {tech}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAdd(tech)}
                className="h-7 w-7 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            {technologyStack?.[tech]?.map((item: string, idx: number) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input
                  className="h-8 text-sm"
                  value={item}
                  onChange={(e) => onChange(tech, idx, e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(tech, idx)}
                  className="h-8 w-8 text-red-500 hover:bg-red-50"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
