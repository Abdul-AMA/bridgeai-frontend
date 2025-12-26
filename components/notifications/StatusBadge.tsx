"use client";

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    active: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1'
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${styles[status]} ${sizeClasses[size]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
