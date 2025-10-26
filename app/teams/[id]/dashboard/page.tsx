import { DashboardGrid } from "@/components/dashboard/DashboardGrid";

export default function DashboardPage() {
  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View your team statistics in one place.
            </p>
          </div>
        </div>

          {/* Main content */}
          <main className="flex-1 mt-8 overflow-auto">
            <DashboardGrid />
          </main>
      </div>
    </div>
  );
}