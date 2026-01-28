/**
 * String List Editor Component
 * Reusable component for editing lists of strings (objectives, target users, etc.)
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface StringListEditorProps {
  label: string;
  items: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
  className?: string;
}

export function StringListEditor({
  label,
  items,
  onAdd,
  onRemove,
  onChange,
  className = "",
}: StringListEditorProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <Label className="text-base font-semibold">{label}</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAdd}
          className="text-blue-600"
        >
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      {items?.map((item: string, idx: number) => (
        <div key={idx} className="flex gap-2 mb-2">
          <Input value={item} onChange={(e) => onChange(idx, e.target.value)} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(idx)}
            className="text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
