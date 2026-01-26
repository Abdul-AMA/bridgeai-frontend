/**
 * Error Alert Component
 * Displays error messages in a consistent format
 * Single Responsibility: Error message display
 */

import React from "react";

interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  return <div className="text-sm text-destructive">{message}</div>;
}
