import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

const handlers = toNextJsHandler(auth);

function isGetSessionRequest(request: Request) {
  return new URL(request.url).pathname.endsWith("/get-session");
}

export async function GET(request: Request) {
  const isGetSession = isGetSessionRequest(request);

  try {
    const response = await handlers.GET(request);

    if (isGetSession && response.status >= 500) {
      console.warn(`Failed to load auth session: ${response.status}`);
      return Response.json(null);
    }

    return response;
  } catch (error) {
    if (isGetSession) {
      console.warn("Failed to load auth session:", error);
      return Response.json(null);
    }

    throw error;
  }
}

export const POST = handlers.POST;
