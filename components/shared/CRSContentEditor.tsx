"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X, Trash2, Save, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CRSContentEditorProps {
    initialContent: string;
    onSave: (newContent: string) => Promise<void>;
    onCancel: () => void;
}

export function CRSContentEditor({ initialContent, onSave, onCancel }: CRSContentEditorProps) {
    const [formData, setFormData] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        try {
            const parsed = JSON.parse(initialContent);
            setFormData(parsed);
        } catch (e) {
            console.error("Failed to parse CRS content", e);
            setFormData({});
        }
    }, [initialContent]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: string, index: number, value: any) => {
        setFormData((prev: any) => {
            const newArray = [...(prev[field] || [])];
            newArray[index] = value;
            return { ...prev, [field]: newArray };
        });
    };

    const addItem = (field: string, initialValue: any = "") => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: [...(prev[field] || []), initialValue],
        }));
    };

    const removeItem = (field: string, index: number) => {
        setFormData((prev: any) => {
            const newArray = [...(prev[field] || [])];
            newArray.splice(index, 1);
            return { ...prev, [field]: newArray };
        });
    };

    // Specific handler for nested objects like technology_stack
    const handleNestedArrayChange = (parentField: string, childField: string, index: number, value: string) => {
        setFormData((prev: any) => {
            const parent = { ...(prev[parentField] || {}) };
            const childArray = [...(parent[childField] || [])];
            childArray[index] = value;
            parent[childField] = childArray;
            return { ...prev, [parentField]: parent };
        });
    };

    const addNestedItem = (parentField: string, childField: string) => {
        setFormData((prev: any) => {
            const parent = { ...(prev[parentField] || {}) };
            const childArray = [...(parent[childField] || []), ""];
            parent[childField] = childArray;
            return { ...prev, [parentField]: parent };
        });
    };

    const removeNestedItem = (parentField: string, childField: string, index: number) => {
        setFormData((prev: any) => {
            const parent = { ...(prev[parentField] || {}) };
            const childArray = [...(parent[childField] || [])];
            childArray.splice(index, 1);
            parent[childField] = childArray;
            return { ...prev, [parentField]: parent };
        });
    };


    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(JSON.stringify(formData));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 bg-white p-1 rounded-lg">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 py-2 border-b">
                <h3 className="text-lg font-bold text-gray-900">Editing CRS</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={onCancel}>
                        <XCircle className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-[#341bab]">
                        <Save className="w-4 h-4 mr-1" /> {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <ScrollArea className="h-[calc(80vh-100px)] pr-4">
                {/* Project Info */}
                <div className="space-y-4 mb-6 border-b pb-6">
                    <div>
                        <Label>Project Title</Label>
                        <Input
                            value={formData.project_title || ""}
                            onChange={(e) => handleChange("project_title", e.target.value)}
                            className="font-bold text-lg"
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            value={formData.project_description || ""}
                            onChange={(e) => handleChange("project_description", e.target.value)}
                            className="h-24"
                        />
                    </div>
                </div>

                {/* Objectives */}
                <div className="space-y-2 mb-6 border-b pb-6">
                    <div className="flex justify-between items-center">
                        <Label className="text-base font-semibold">Objectives</Label>
                        <Button variant="ghost" size="sm" onClick={() => addItem("project_objectives")} className="text-blue-600">
                            <Plus className="w-3 h-3 mr-1" /> Add Objective
                        </Button>
                    </div>
                    {formData.project_objectives?.map((obj: string, idx: number) => (
                        <div key={idx} className="flex gap-2 mb-2">
                            <Input
                                value={obj}
                                onChange={(e) => handleArrayChange("project_objectives", idx, e.target.value)}
                            />
                            <Button variant="ghost" size="icon" onClick={() => removeItem("project_objectives", idx)} className="text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Functional Requirements */}
                <div className="space-y-3 mb-6 border-b pb-6">
                    <div className="flex justify-between items-center">
                        <Label className="text-base font-semibold">Functional Requirements</Label>
                        <Button variant="ghost" size="sm" onClick={() => addItem("functional_requirements", { id: `FR-${(formData.functional_requirements?.length || 0) + 1}`, title: "", priority: "medium", description: "" })} className="text-blue-600">
                            <Plus className="w-3 h-3 mr-1" /> Add Requirement
                        </Button>
                    </div>
                    {formData.functional_requirements?.map((req: any, idx: number) => (
                        <div key={idx} className="border p-3 rounded-lg bg-gray-50 mb-3 relative group">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" onClick={() => removeItem("functional_requirements", idx)} className="text-red-500 h-6 w-6">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <div className="col-span-2">
                                    <Label className="text-xs text-gray-500">ID</Label>
                                    <Input
                                        value={req.id || ""}
                                        onChange={(e) => {
                                            const newReq = { ...req, id: e.target.value };
                                            handleArrayChange("functional_requirements", idx, newReq);
                                        }}
                                        className="h-8 text-xs font-mono"
                                    />
                                </div>
                                <div className="col-span-7">
                                    <Label className="text-xs text-gray-500">Title</Label>
                                    <Input
                                        value={req.title || ""}
                                        onChange={(e) => {
                                            const newReq = { ...req, title: e.target.value };
                                            handleArrayChange("functional_requirements", idx, newReq);
                                        }}
                                        className="h-8 font-medium"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Label className="text-xs text-gray-500">Priority</Label>
                                    <Select
                                        value={req.priority}
                                        onValueChange={(val) => {
                                            const newReq = { ...req, priority: val };
                                            handleArrayChange("functional_requirements", idx, newReq);
                                        }}
                                    >
                                        <SelectTrigger className="h-8">
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
                                <Label className="text-xs text-gray-500">Description</Label>
                                <Textarea
                                    value={req.description || ""}
                                    onChange={(e) => {
                                        const newReq = { ...req, description: e.target.value };
                                        handleArrayChange("functional_requirements", idx, newReq);
                                    }}
                                    className="min-h-[60px] text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Target Users */}
                <div className="space-y-2 mb-6 border-b pb-6">
                    <div className="flex justify-between items-center">
                        <Label className="text-base font-semibold">Target Users</Label>
                        <Button variant="ghost" size="sm" onClick={() => addItem("target_users")} className="text-blue-600">
                            <Plus className="w-3 h-3 mr-1" /> Add User
                        </Button>
                    </div>
                    {Array.isArray(formData.target_users) && formData.target_users.map((user: string, idx: number) => (
                        <div key={idx} className="flex gap-2">
                            <Input
                                value={user}
                                onChange={(e) => handleArrayChange("target_users", idx, e.target.value)}
                            />
                            <Button variant="ghost" size="icon" onClick={() => removeItem("target_users", idx)} className="text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Non-Functional Requirements */}
                <div className="space-y-4 mb-6 border-b pb-6">
                    <Label className="text-base font-semibold">Non-Functional Requirements</Label>

                    {/* Security */}
                    <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                            <Label className="font-medium text-gray-700">🔒 Security</Label>
                            <Button variant="ghost" size="sm" onClick={() => addItem("security_requirements")} className="h-6">
                                <Plus className="w-3 h-3" />
                            </Button>
                        </div>
                        {formData.security_requirements?.map((req: string, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-1">
                                <Input className="h-8 text-sm" value={req} onChange={(e) => handleArrayChange("security_requirements", idx, e.target.value)} />
                                <Button variant="ghost" size="icon" onClick={() => removeItem("security_requirements", idx)} className="h-8 w-8 text-red-500">
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Performance */}
                    <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                            <Label className="font-medium text-gray-700">⚡ Performance</Label>
                            <Button variant="ghost" size="sm" onClick={() => addItem("performance_requirements")} className="h-6">
                                <Plus className="w-3 h-3" />
                            </Button>
                        </div>
                        {formData.performance_requirements?.map((req: string, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-1">
                                <Input className="h-8 text-sm" value={req} onChange={(e) => handleArrayChange("performance_requirements", idx, e.target.value)} />
                                <Button variant="ghost" size="icon" onClick={() => removeItem("performance_requirements", idx)} className="h-8 w-8 text-red-500">
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Scalability */}
                    <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                            <Label className="font-medium text-gray-700">📈 Scalability</Label>
                            <Button variant="ghost" size="sm" onClick={() => addItem("scalability_requirements")} className="h-6">
                                <Plus className="w-3 h-3" />
                            </Button>
                        </div>
                        {formData.scalability_requirements?.map((req: string, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-1">
                                <Input className="h-8 text-sm" value={req} onChange={(e) => handleArrayChange("scalability_requirements", idx, e.target.value)} />
                                <Button variant="ghost" size="icon" onClick={() => removeItem("scalability_requirements", idx)} className="h-8 w-8 text-red-500">
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Technology Stack */}
                <div className="space-y-4 mb-6 border-b pb-6">
                    <Label className="text-base font-semibold">Technology Stack</Label>
                    <div className="grid grid-cols-2 gap-4">
                        {["frontend", "backend", "database", "other"].map((tech) => (
                            <div key={tech} className="bg-slate-50 p-3 rounded border">
                                <div className="flex justify-between items-center mb-2">
                                    <Label className="capitalize font-medium">{tech}</Label>
                                    <Button variant="ghost" size="sm" onClick={() => addNestedItem("technology_stack", tech)} className="h-6 w-6">
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                </div>
                                {formData.technology_stack?.[tech]?.map((item: string, idx: number) => (
                                    <div key={idx} className="flex gap-1 mb-1 relative group">
                                        <Input className="h-7 text-sm" value={item} onChange={(e) => handleNestedArrayChange("technology_stack", tech, idx, e.target.value)} />
                                        <Button variant="ghost" size="icon" onClick={() => removeNestedItem("technology_stack", tech, idx)} className="h-7 w-7 text-red-500 hover:bg-red-50">
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Constraints */}
                <div className="grid grid-cols-2 gap-6 mb-6 border-b pb-6">
                    <div>
                        <Label className="font-semibold">Timeline Constraints</Label>
                        <Input
                            value={formData.timeline_constraints || ""}
                            onChange={(e) => handleChange("timeline_constraints", e.target.value)}
                        />
                    </div>
                    <div>
                        <Label className="font-semibold">Budget Constraints</Label>
                        <Input
                            value={formData.budget_constraints || ""}
                            onChange={(e) => handleChange("budget_constraints", e.target.value)}
                        />
                    </div>
                </div>

                {/* Technical Constraints */}
                <div className="space-y-2 mb-6 border-b pb-6">
                    <div className="flex justify-between items-center">
                        <Label className="text-sm font-semibold">Technical Constraints</Label>
                        <Button variant="ghost" size="sm" onClick={() => addItem("technical_constraints")} className="text-blue-600">
                            <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                    </div>
                    {formData.technical_constraints?.map((req: string, idx: number) => (
                        <div key={idx} className="flex gap-2 mb-1">
                            <Input className="h-8 text-sm" value={req} onChange={(e) => handleArrayChange("technical_constraints", idx, e.target.value)} />
                            <Button variant="ghost" size="icon" onClick={() => removeItem("technical_constraints", idx)} className="h-8 w-8 text-red-500">
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Integrations */}
                <div className="space-y-2 mb-6 border-b pb-6">
                    <div className="flex justify-between items-center">
                        <Label className="text-sm font-semibold">Integrations</Label>
                        <Button variant="ghost" size="sm" onClick={() => addItem("integrations")} className="text-blue-600">
                            <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                    </div>
                    {formData.integrations?.map((req: string, idx: number) => (
                        <div key={idx} className="flex gap-2 mb-1">
                            <Input className="h-8 text-sm" value={req} onChange={(e) => handleArrayChange("integrations", idx, e.target.value)} />
                            <Button variant="ghost" size="icon" onClick={() => removeItem("integrations", idx)} className="h-8 w-8 text-red-500">
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Success Metrics */}
                <div className="space-y-2 mb-6 border-b pb-6">
                    <div className="flex justify-between items-center">
                        <Label className="text-sm font-semibold">Success Metrics</Label>
                        <Button variant="ghost" size="sm" onClick={() => addItem("success_metrics")} className="text-blue-600">
                            <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                    </div>
                    {formData.success_metrics?.map((req: string, idx: number) => (
                        <div key={idx} className="flex gap-2 mb-1">
                            <Input className="h-8 text-sm" value={req} onChange={(e) => handleArrayChange("success_metrics", idx, e.target.value)} />
                            <Button variant="ghost" size="icon" onClick={() => removeItem("success_metrics", idx)} className="h-8 w-8 text-red-500">
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Assumptions & Risks */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label className="text-sm font-semibold">Assumptions</Label>
                            <Button variant="ghost" size="sm" onClick={() => addItem("assumptions")} className="text-blue-600">
                                <Plus className="w-3 h-3 mr-1" /> Add
                            </Button>
                        </div>
                        {formData.assumptions?.map((req: string, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-1">
                                <Input className="h-8 text-sm" value={req} onChange={(e) => handleArrayChange("assumptions", idx, e.target.value)} />
                                <Button variant="ghost" size="icon" onClick={() => removeItem("assumptions", idx)} className="h-8 w-8 text-red-500">
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label className="text-sm font-semibold text-red-600">Risks</Label>
                            <Button variant="ghost" size="sm" onClick={() => addItem("risks")} className="text-blue-600">
                                <Plus className="w-3 h-3 mr-1" /> Add
                            </Button>
                        </div>
                        {formData.risks?.map((req: string, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-1">
                                <Input className="h-8 text-sm border-red-200" value={req} onChange={(e) => handleArrayChange("risks", idx, e.target.value)} />
                                <Button variant="ghost" size="icon" onClick={() => removeItem("risks", idx)} className="h-8 w-8 text-red-500">
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Out of Scope */}
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center">
                        <Label className="text-sm font-semibold">Out of Scope</Label>
                        <Button variant="ghost" size="sm" onClick={() => addItem("out_of_scope")} className="text-blue-600">
                            <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                    </div>
                    {formData.out_of_scope?.map((req: string, idx: number) => (
                        <div key={idx} className="flex gap-2 mb-1">
                            <Input className="h-8 text-sm" value={req} onChange={(e) => handleArrayChange("out_of_scope", idx, e.target.value)} />
                            <Button variant="ghost" size="icon" onClick={() => removeItem("out_of_scope", idx)} className="h-8 w-8 text-red-500">
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                        value={formData.additional_notes || ""}
                        onChange={(e) => handleChange("additional_notes", e.target.value)}
                        className="h-24"
                    />
                </div>
            </ScrollArea>
        </div>
    );
}
