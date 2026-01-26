/**
 * Auth Form Container Component
 * Reusable container for auth forms
 * Single Responsibility: Auth form layout
 */

import React from "react";

interface AuthFormContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthFormContainer({
  title,
  subtitle,
  children,
}: AuthFormContainerProps) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
