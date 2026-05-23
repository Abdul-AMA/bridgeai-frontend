import Link from "next/link";

export default function AdminForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-6">
        <p className="text-6xl font-bold text-indigo-600 mb-4">403</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-sm text-gray-500 mb-8">
          This area is restricted to BridgeAI super admins. Your account does not have
          permission to access the admin dashboard.
        </p>
        <Link
          href="/teams"
          className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Return to my dashboard
        </Link>
      </div>
    </div>
  );
}
