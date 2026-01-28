/**
 * Functional Requirements Editor Component
 * Handles editing of functional requirements with ID, title, priority, and description
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface FunctionalRequirement {
  id: string;
  title: string;
  priority: string;
  description: string;
}

interface FunctionalRequirementsEditorProps {
  requirements: FunctionalRequirement[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, requirement: FunctionalRequirement) => void;
}

export function FunctionalRequirementsEditor({
  requirements,
  onAdd,
  onRemove,
  onChange,
}: FunctionalRequirementsEditorProps) {
  return (
    <div className="space-y-3 border-b pb-6">
      <div className="flex justify-between items-center">
        <Label className="text-base font-semibold">
          Functional Requirements
        </Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAdd}
          className="text-blue-600"
        >
          <Plus className="w-3 h-3 mr-1" /> Add Requirement
        </Button>
      </div>
      {requirements?.map((req: FunctionalRequirement, idx: number) => (
        <div
          key={idx}
          className="border p-4 rounded-lg bg-gray-50 mb-3 relative group"
        >
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(idx)}
              className="text-red-500 h-6 w-6"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-12 gap-3 mb-3">
            <div className="col-span-3">
              <Label className="text-xs text-gray-600 mb-1">ID</Label>
              <Input
                value={req.id || ""}
                onChange={(e) =>
                  onChange(idx, { ...req, id: e.target.value })
                }
                className="h-9 text-sm font-mono"
              />
            </div>
            <div className="col-span-6">
              <Label className="text-xs text-gray-600 mb-1">Title</Label>
              <Input
                value={req.title || ""}
                onChange={(e) =>
                  onChange(idx, { ...req, title: e.target.value })
                }
                className="h-9 font-medium"
              />
            </div>
            <div className="col-span-3">
              <Label className="text-xs text-gray-600 mb-1">Priority</Label>
              <Select
                value={req.priority}
                onValueChange={(val) =>
                  onChange(idx, { ...req, priority: val })
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-600 mb-1">Description</Label>
            <Textarea
              value={req.description || ""}
              onChange={(e) =>
                onChange(idx, { ...req, description: e.target.value })
              }
              className="min-h-20 text-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
