import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { CollectionSlug, PayloadRequest } from "payload";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function GET(req: Request): Promise<Response> {
  const payload = await getPayload({ config: configPromise });
  const { searchParams } = new URL(req.url);

  // Extract parameters from the URL
  const path = searchParams.get("path"); // e.g. "/test"
  const collection = searchParams.get("collection") as CollectionSlug;
  const slug = searchParams.get("slug");
  const previewSecret = searchParams.get("previewSecret");
  let tenant = searchParams.get("tenant"); // e.g. "gold"

  console.log("[Preview] Params received:", {
    path,
    collection,
    slug,
    previewSecret,
    tenant,
  });

  // Validate the preview secret
  if (previewSecret !== process.env.PREVIEW_SECRET) {
    console.error("[Preview] Invalid preview secret");
    return new Response("You are not allowed to preview this page", {
      status: 403,
    });
  }
  if (!path || !collection || !slug) {
    console.error("[Preview] Missing required search params:", {
      path,
      collection,
      slug,
    });
    return new Response("Insufficient search params", { status: 404 });
  }
  if (!path.startsWith("/")) {
    console.error('[Preview] Path must start with "/"', path);
    return new Response(
      "This endpoint can only be used for relative previews",
      { status: 500 },
    );
  }

  // Authenticate the request (and log the user if available)
  let user;
  try {
    user = await payload.auth({
      req: req as unknown as PayloadRequest,
      headers: req.headers,
    });
    console.log("[Preview] Authenticated user:", user);
  } catch (error) {
    payload.logger.error(
      { err: error },
      "[Preview] Error verifying token for live preview",
    );
    return new Response("You are not allowed to preview this page", {
      status: 403,
    });
  }

  const draft = await draftMode();
  if (!user) {
    console.warn("[Preview] No user found. Disabling draft mode.");
    draft.disable();
    return new Response("You are not allowed to preview this page", {
      status: 403,
    });
  }
  draft.enable();

  //TODO: Check if need to fix this and add it in:
  // // Fallback: if tenant parameter is missing, look up the document to extract tenant info.
  // if (!tenant) {
  //   console.log('[Preview] Tenant parameter missing; attempting document lookup...');
  //   const docs = await payload.find({
  //     collection,
  //     where: { slug: { equals: slug } },
  //     overrideAccess: true,
  //     draft: true,
  //   });
  //   console.log('[Preview] Document lookup result:', docs);
  //   if (docs.docs.length > 0 && docs.docs[0].tenants && (docs.docs[0].tenant as any).slug) {
  //     tenant = (docs.docs[0].tenant as any).slug;
  //     console.log('[Preview] Tenant obtained via fallback:', tenant);
  //   } else {
  //     console.warn('[Preview] Could not determine tenant from document lookup');
  //   }
  // }

  if (tenant) {
    const tenantUrl = `/tenant-domains/${tenant}${path}`;
    console.log("[Preview] Redirecting to tenant-scoped URL:", tenantUrl);
    return redirect(tenantUrl);
  } else {
    console.warn(
      "[Preview] No tenant found; falling back to plain redirect to:",
      path,
    );
    return redirect(path);
  }
}

// import { draftMode } from "next/headers";
// import { redirect } from "next/navigation";
// import type { CollectionSlug, PayloadRequest } from "payload";
// import { getPayload } from "payload";
// import configPromise from "@payload-config";
//
// export async function GET(
//   req: Request & { cookies: { get: (name: string) => { value: string } } },
// ): Promise<Response> {
//   const payload = await getPayload({ config: configPromise });
//   const { searchParams } = new URL(req.url);
//   const path = searchParams.get("path"); // e.g. "/test"
//   const collection = searchParams.get("collection") as CollectionSlug;
//   const slug = searchParams.get("slug");
//   const previewSecret = searchParams.get("previewSecret");
//   const tenant = searchParams.get("tenant"); // e.g. "gold"
//
//   if (previewSecret !== process.env.PREVIEW_SECRET) {
//     return new Response("You are not allowed to preview this page", {
//       status: 403,
//     });
//   }
//
//   if (!path || !collection || !slug) {
//     return new Response("Insufficient search params", { status: 404 });
//   }
//
//   if (!path.startsWith("/")) {
//     return new Response(
//       "This endpoint can only be used for relative previews",
//       { status: 500 },
//     );
//   }
//
//   let user;
//   try {
//     user = await payload.auth({
//       req: req as unknown as PayloadRequest,
//       headers: req.headers,
//     });
//   } catch (error) {
//     payload.logger.error(
//       { err: error },
//       "Error verifying token for live preview",
//     );
//     return new Response("You are not allowed to preview this page", {
//       status: 403,
//     });
//   }
//
//   const draft = await draftMode();
//   if (!user) {
//     draft.disable();
//     return new Response("You are not allowed to preview this page", {
//       status: 403,
//     });
//   }
//
//   draft.enable();
//
//   // Construct a tenant-scoped redirect path.
//   // For example, if your tenant pages live under /tenant-domains/[tenant]/[...slug]:
//   if (tenant) {
//     return redirect(`/tenant-domains/${tenant}${path}`);
//   } else {
//     // Fallback in case tenant is not provided:
//     return redirect(path);
//   }
// }
