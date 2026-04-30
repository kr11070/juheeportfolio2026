import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { decodeBase64 } from "jsr:@std/encoding/base64";

const app = new Hono().basePath("/make-server-2402b4f2");

app.use("*", logger(console.log));
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["*"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
  })
);

app.post("/upload-image", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file");
    
    if (!file || !(file instanceof File)) {
      return c.json({ error: "No file provided" }, 400);
    }

    const privateKey = Deno.env.get("IMAGEKIT_PRIVATE_KEY");
    if (!privateKey) {
      return c.json({ error: "IMAGEKIT_PRIVATE_KEY is missing" }, 500);
    }

    // Prepare FormData for ImageKit
    const ikFormData = new FormData();
    ikFormData.append("file", file);
    ikFormData.append("fileName", file.name);
    ikFormData.append("folder", "/portpolio");

    const authHeader = "Basic " + btoa(privateKey + ":");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        "Authorization": authHeader,
      },
      body: ikFormData,
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("ImageKit error:", err);
      return c.json({ error: "Failed to upload to ImageKit", details: err }, 500);
    }

    const data = await response.json();
    return c.json({ url: data.url, fileId: data.fileId });
  } catch (error: any) {
    console.error("Upload error:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/imagekit-auth", async (c) => {
  const privateKey = Deno.env.get("IMAGEKIT_PRIVATE_KEY");
  if (!privateKey) {
    return c.json({ error: "IMAGEKIT_PRIVATE_KEY is missing" }, 500);
  }

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 2400;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(privateKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(token + expire)
  );
  const signature = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return c.json({ token, expire, signature });
});

Deno.serve(app.fetch);
