"use client";

import { CRSDTO } from "@/dto/crs.dto";
import { CRSContentDisplay } from "@/components/shared/CRSContentDisplay";

interface CRSReviewBodyProps {
  crs: CRSDTO;
  patternLabel: string;
  patternClassName: string;
  errorMessage?: string | null;
}

export function CRSReviewBody({
  crs,
  patternLabel,
  patternClassName,
  errorMessage,
}: CRSReviewBodyProps) {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Panel: Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm animate-in fade-in slide-in-from-top-2">
            {errorMessage}
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Version</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">v{crs.version}</p>
          </div>
          <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pattern</p>
            <p className={`text-sm font-semibold mt-2 px-2 py-1 rounded inline-block ${patternClassName}`}>
              {patternLabel}
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</p>
            <p className="text-sm font-medium text-gray-900 mt-2">
              {new Date(crs.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Creator</p>
            <p className="text-sm font-medium text-gray-900 mt-2">
              User #{crs.created_by}
            </p>
          </div>
        </div>

        {/* Summary Points */}
        {crs.summary_points && crs.summary_points.length > 0 && (
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Key Points
            </h3>
            <ul className="grid gap-2">
              {crs.summary_points.map((point, idx) => (
                <li key={idx} className="text-sm text-blue-900/80 pl-2 border-l-2 border-blue-200">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CRS Content */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm min-h-[400px]">
          <CRSContentDisplay content={crs.content} />
        </div>
      </div>
    </div>
  );
}
