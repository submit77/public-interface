import type { APIRoute } from "astro";
import { PUBLIC_INTERFACE } from "@data/public-interface";

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(PUBLIC_INTERFACE, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
