// components/DismissButton.tsx
"use client";

import React from "react";
import { X } from "lucide-react";
import { dismissNotification } from "@/lib/actions/DissmissNotification";

interface DismissButtonProps {
  notificationId: string;
  className?: string;
}

export default function DismissButton({
  notificationId,
  className,
}: DismissButtonProps) {
  const handleDismiss = async () => {
    await dismissNotification(notificationId);
    // Refresh the current page without a full reload
    window.location.reload();
  };

  return (
    <button
      onClick={handleDismiss}
      className={className}
      aria-label="Dismiss notification"
    >
      <X size={18} />
    </button>
  );
}
