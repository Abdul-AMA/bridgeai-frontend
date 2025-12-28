"use client";

/**
 * Reusable component to display structured CRS content
 * Used in both client's CRS view and BA's review dialog
 */

interface CRSContentDisplayProps {
  content: string;
}

export function CRSContentDisplay({ content }: CRSContentDisplayProps) {
  try {
    const crsData = JSON.parse(content);
    return (
      <>
        {crsData.project_title && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{crsData.project_title}</h3>
          </div>
        )}

        {crsData.project_description && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Project Description</h4>
            <p className="text-sm text-gray-600">{crsData.project_description}</p>
          </div>
        )}

        {crsData.project_objectives && crsData.project_objectives.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Objectives</h4>
            <ul className="list-disc list-inside space-y-1">
              {crsData.project_objectives.map((obj: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-600">{obj}</li>
              ))}
            </ul>
          </div>
        )}

        {crsData.functional_requirements && crsData.functional_requirements.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Functional Requirements</h4>
            <div className="space-y-3">
              {crsData.functional_requirements.map((req: any, idx: number) => {
                // Handle structured requirement objects (preferred format)
                if (typeof req === "object" && req !== null) {
                  return (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">
                          {req.id && <span className="text-[#341bab] mr-2">{req.id}</span>}
                          {req.title || "Requirement"}
                        </span>
                        {req.priority && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            req.priority === "high" ? "bg-red-100 text-red-700" :
                            req.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {req.priority}
                          </span>
                        )}
                      </div>
                      {req.description && (
                        <p className="text-sm text-gray-600">{req.description}</p>
                      )}
                    </div>
                  );
                }
                // Handle string requirements (fallback for older data)
                if (typeof req === "string") {
                  const trimmed = req.trim();
                  return (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-gray-600">{trimmed}</p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {crsData.target_users && crsData.target_users.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Target Users</h4>
            {Array.isArray(crsData.target_users) ? (
              <ul className="list-disc list-inside space-y-1">
                {crsData.target_users.map((user: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-600">{user}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">{crsData.target_users}</p>
            )}
          </div>
        )}

        {/* Non-Functional Requirements Section */}
        {(crsData.security_requirements?.length > 0 || 
          crsData.performance_requirements?.length > 0 || 
          crsData.scalability_requirements?.length > 0) && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Non-Functional Requirements</h4>
            
            {crsData.security_requirements?.length > 0 && (
              <div className="mb-3">
                <h5 className="text-xs font-medium text-gray-600 mb-1">🔒 Security</h5>
                <ul className="list-disc list-inside space-y-0.5">
                  {crsData.security_requirements.map((req: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-600">{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {crsData.performance_requirements?.length > 0 && (
              <div className="mb-3">
                <h5 className="text-xs font-medium text-gray-600 mb-1">⚡ Performance</h5>
                <ul className="list-disc list-inside space-y-0.5">
                  {crsData.performance_requirements.map((req: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-600">{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {crsData.scalability_requirements?.length > 0 && (
              <div className="mb-3">
                <h5 className="text-xs font-medium text-gray-600 mb-1">📈 Scalability</h5>
                <ul className="list-disc list-inside space-y-0.5">
                  {crsData.scalability_requirements.map((req: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-600">{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Technology Stack */}
        {crsData.technology_stack && Object.keys(crsData.technology_stack).some(
          k => crsData.technology_stack[k]?.length > 0
        ) && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">🛠️ Technology Stack</h4>
            <div className="grid grid-cols-2 gap-2">
              {crsData.technology_stack.frontend?.length > 0 && (
                <div className="bg-blue-50 rounded p-2">
                  <span className="text-xs font-medium text-blue-800">Frontend:</span>
                  <p className="text-sm text-blue-700">{crsData.technology_stack.frontend.join(", ")}</p>
                </div>
              )}
              {crsData.technology_stack.backend?.length > 0 && (
                <div className="bg-green-50 rounded p-2">
                  <span className="text-xs font-medium text-green-800">Backend:</span>
                  <p className="text-sm text-green-700">{crsData.technology_stack.backend.join(", ")}</p>
                </div>
              )}
              {crsData.technology_stack.database?.length > 0 && (
                <div className="bg-purple-50 rounded p-2">
                  <span className="text-xs font-medium text-purple-800">Database:</span>
                  <p className="text-sm text-purple-700">{crsData.technology_stack.database.join(", ")}</p>
                </div>
              )}
              {crsData.technology_stack.other?.length > 0 && (
                <div className="bg-gray-50 rounded p-2">
                  <span className="text-xs font-medium text-gray-800">Other:</span>
                  <p className="text-sm text-gray-700">{crsData.technology_stack.other.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Constraints Section */}
        <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4">
          {crsData.timeline_constraints && crsData.timeline_constraints !== "Not specified" && (
            <div className="bg-orange-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-orange-800 mb-1">⏰ Timeline</h4>
              <p className="text-sm text-orange-700">{crsData.timeline_constraints}</p>
            </div>
          )}

          {crsData.budget_constraints && crsData.budget_constraints !== "Not specified" && (
            <div className="bg-emerald-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-emerald-800 mb-1">💰 Budget</h4>
              <p className="text-sm text-emerald-700">{crsData.budget_constraints}</p>
            </div>
          )}
        </div>

        {/* Technical Constraints */}
        {crsData.technical_constraints?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">⚠️ Technical Constraints</h4>
            <ul className="list-disc list-inside space-y-1">
              {crsData.technical_constraints.map((constraint: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-600">{constraint}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Integrations */}
        {crsData.integrations?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">🔗 Integrations</h4>
            <ul className="list-disc list-inside space-y-1">
              {crsData.integrations.map((integration: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-600">{integration}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Success Metrics */}
        {crsData.success_metrics && crsData.success_metrics.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">📊 Success Metrics</h4>
            <ul className="list-disc list-inside space-y-1">
              {crsData.success_metrics.map((metric: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-600">{metric}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Assumptions & Risks */}
        {(crsData.assumptions?.length > 0 || crsData.risks?.length > 0) && (
          <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4">
            {crsData.assumptions?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">📝 Assumptions</h4>
                <ul className="list-disc list-inside space-y-1">
                  {crsData.assumptions.map((assumption: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-600">{assumption}</li>
                  ))}
                </ul>
              </div>
            )}
            {crsData.risks?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-700 mb-1">⚠️ Risks</h4>
                <ul className="list-disc list-inside space-y-1">
                  {crsData.risks.map((risk: string, idx: number) => (
                    <li key={idx} className="text-sm text-red-600">{risk}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Out of Scope */}
        {crsData.out_of_scope?.length > 0 && (
          <div className="bg-gray-100 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">🚫 Out of Scope</h4>
            <ul className="list-disc list-inside space-y-1">
              {crsData.out_of_scope.map((item: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-500">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Additional Notes */}
        {crsData.additional_notes && crsData.additional_notes !== "None" && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">📝 Additional Notes</h4>
            <p className="text-sm text-gray-600">{crsData.additional_notes}</p>
          </div>
        )}
      </>
    );
  } catch (e) {
    // Fallback to raw content if not valid JSON
    return (
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Document Content</h4>
        <div className="text-sm text-gray-600 whitespace-pre-wrap">{content}</div>
      </div>
    );
  }
}
