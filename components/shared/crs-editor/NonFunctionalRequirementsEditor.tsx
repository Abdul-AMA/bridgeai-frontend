/**
 * Non-Functional Requirements Editor Component
 * Handles security, performance, and scalability requirements
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface NonFunctionalRequirementsEditorProps {
  securityRequirements: string[];
  performanceRequirements: string[];
  scalabilityRequirements: string[];
  onAddSecurity: () => void;
  onRemoveSecurity: (index: number) => void;
  onChangeSecurity: (index: number, value: string) => void;
  onAddPerformance: () => void;
  onRemovePerformance: (index: number) => void;
  onChangePerformance: (index: number, value: string) => void;
  onAddScalability: () => void;
  onRemoveScalability: (index: number) => void;
  onChangeScalability: (index: number, value: string) => void;
}

export function NonFunctionalRequirementsEditor({
  securityRequirements,
  performanceRequirements,
  scalabilityRequirements,
  onAddSecurity,
  onRemoveSecurity,
  onChangeSecurity,
  onAddPerformance,
  onRemovePerformance,
  onChangePerformance,
  onAddScalability,
  onRemoveScalability,
  onChangeScalability,
}: NonFunctionalRequirementsEditorProps) {
  return (
    <div className="space-y-4 border-b pb-6">
      <Label className="text-base font-semibold">
        Non-Functional Requirements
      </Label>

      {/* Security */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <Label className="font-medium text-gray-700 flex items-center gap-2">
            <span className="text-lg">🔒</span> Security
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddSecurity}
            className="h-7 text-blue-600"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        {securityRequirements?.map((req: string, idx: number) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input
              className="h-9 text-sm"
              value={req}
              onChange={(e) => onChangeSecurity(idx, e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveSecurity(idx)}
              className="h-9 w-9 text-red-500"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Performance */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <Label className="font-medium text-gray-700 flex items-center gap-2">
            <span className="text-lg">⚡</span> Performance
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddPerformance}
            className="h-7 text-blue-600"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        {performanceRequirements?.map((req: string, idx: number) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input
              className="h-9 text-sm"
              value={req}
              onChange={(e) => onChangePerformance(idx, e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemovePerformance(idx)}
              className="h-9 w-9 text-red-500"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Scalability */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <Label className="font-medium text-gray-700 flex items-center gap-2">
            <span className="text-lg">📈</span> Scalability
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddScalability}
            className="h-7 text-blue-600"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        {scalabilityRequirements?.map((req: string, idx: number) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input
              className="h-9 text-sm"
              value={req}
              onChange={(e) => onChangeScalability(idx, e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveScalability(idx)}
              className="h-9 w-9 text-red-500"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
