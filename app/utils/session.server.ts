import { nonce, passesSecurityCheck } from "./security";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error("SESSION_SECRET is not set");
const storage = createCookieSessionStorage({
  cookie: {
    name: "shopify-remix-app",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getShop(request: Request) {
  const session = await getUserSession(request);
  const shop = session.get("shop");
  if (!shop) throw new Error("Shop is not set");
  return shop;
}

export async function getAccessToken(request: Request) {
  const session = await getUserSession(request);
  const accessToken = session.get("accessToken");
  if (!accessToken || typeof accessToken !== "string") return null;
  return accessToken;
}

export async function requireAccessToken(request: Request) {
  const session = await getUserSession(request);
  const accessToken = session.get("accessToken");
  if (!accessToken || typeof accessToken !== "string") throw redirect("/login");
  return accessToken;
}

export async function beginAuth(request: Request, params: { shop: string }) {
  const { shop } = params;
  if (!shop) throw new Error('"shop" query param is required');

  const url = new URL(request.url);
  const session = await storage.getSession();
  const state = nonce();
  session.set("state", state);

  const queryParams = new URLSearchParams({
    client_id: process.env.API_KEY!,
    scope: "read_products,write_products",
    redirect_uri: `https://${url.host}/auth/callback`,
    state,
    "grant_options[]": "per-user",
  });

  const query = decodeURIComponent(queryParams.toString());
  const authRoute = `https://${shop}.myshopify.com/admin/oauth/authorize?${query}`;
  return redirect(authRoute, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function handleCallback(request: Request) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const code = url.searchParams.get("code");
  if (!code) throw redirect("/");
  if (!(await passesSecurityCheck(request))) {
    throw new Error("Security check failed");
  }

  const params = new URLSearchParams([
    ["client_id", process.env.API_KEY || ""],
    ["client_secret", process.env.API_SECRET_KEY || ""],
    ["code", code],
  ]);

  try {
    const response = await fetch(
      `https://${shop}/admin/oauth/access_token?${params}`,
      {
        method: "POST",
      }
    );
    const json = await response.json();
    const session = await getUserSession(request);

    session.set("shop", shop);
    session.set("accessToken", json.access_token);

    return redirect("/app/products", {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    });
  } catch (error) {
    throw error;
  }
}
