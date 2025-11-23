"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiCall, getCurrentUser } from "@/lib/api";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  onProjectCreated?: () => void;
}

interface UserResponse {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

export function CreateProjectModal({
  open,
  onOpenChange,
  teamId,
  onProjectCreated,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    if (name.trim().length > 256) {
      setError("Project name must be 256 characters or less");
      return;
    }

    try {
      setIsLoading(true);

      // Get current user to determine role
      const user = await getCurrentUser<UserResponse>();

      // Create project with exact API format
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        team_id: parseInt(teamId, 10),
      };

      await apiCall("/api/projects/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Show role-based success message
      if (user.role === "ba") {
        setSuccessMessage("Project created successfully!");
      } else {
        setSuccessMessage(
          "Project request submitted successfully! Waiting for Business Analyst approval."
        );
      }

      // Reset form after short delay
      setTimeout(() => {
        setName("");
        setDescription("");
        setSuccessMessage(null);
        onOpenChange(false);

        // Trigger refresh of projects list
        if (onProjectCreated) {
          onProjectCreated();
        }
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create project";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Submit a new project request for your team
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateProject} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="projectName" className="block text-sm font-medium">
              Project Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="projectName"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
              maxLength={256}
            />
            <p className="text-xs text-muted-foreground">
              {name.length}/256 characters
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="projectDescription" className="block text-sm font-medium">
              Description <span className="text-muted-foreground">(Optional)</span>
            </label>
            <textarea
              id="projectDescription"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={4}
              className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-900">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-md bg-green-50 border border-green-200">
              <p className="text-sm text-green-900">{successMessage}</p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="hover:cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="hover:cursor-pointer sm:ml-2"
            >
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
