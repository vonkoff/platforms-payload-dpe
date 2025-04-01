//FIXME: Tanstack form implementation so far
// app/api/submit-notification/route.ts
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const payload = await getPayload({ config });

    // Here you can store the notification preferences
    // For example, you could create a new document in a "notifications" collection
    const result = await payload.create({
      collection: "notifications",
      data: {
        email: data.email,
        firstName: data.firstName,
        frequency: data.frequency,
        selectedModels: data.selectedModels,
        // You might want to add additional fields like timestamp, etc.
      },
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error processing notification subscription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process subscription" },
      { status: 500 },
    );
  }
}
