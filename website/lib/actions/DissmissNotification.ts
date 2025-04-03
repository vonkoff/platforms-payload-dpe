"use server";

import { cookies } from "next/headers";

export async function dismissNotification(
  notificationId: string,
  duration: number = 24,
): Promise<{ success: boolean }> {
  // Set expiration to specified hours from now
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + duration);

  const cookieStore = await cookies();

  // Set the cookie with expiration
  cookieStore.set(`notification-dismissed-${notificationId}`, "true", {
    expires: expiresAt,
    path: "/",
  });

  return { success: true };
}
