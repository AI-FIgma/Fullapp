import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

// Check if running in a preview/mock environment without proper env vars
const isPreviewMode = !Deno.env.get('SUPABASE_URL') || 
                       !Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ||
                       Deno.env.get('SUPABASE_URL') === '';

if (isPreviewMode) {
  console.log('⚠️ Server running in PREVIEW MODE - Missing env vars. Server disabled to prevent HTTP errors.');
}

// Suppress noisy connection errors
globalThis.addEventListener("unhandledrejection", (e) => {
  const err = e.reason;
  // Check for common connection error patterns
  const isConnectionError = 
    err?.name === "Http" || 
    err?.name === "BrokenPipe" ||
    err?.name === "ConnectionReset" ||
    (err as any)?.code === "EPIPE" ||
    (err as any)?.code === "ECONNRESET" ||
    err?.message?.includes("connection closed") || 
    err?.message?.includes("connection error") || 
    err?.message?.includes("broken pipe");

  if (isConnectionError) {
    e.preventDefault();
    return;
  }
});

globalThis.addEventListener("error", (e) => {
  const err = e.error;
  const isConnectionError = 
    err?.name === "Http" || 
    err?.name === "BrokenPipe" ||
    err?.name === "ConnectionReset" ||
    (err as any)?.code === "EPIPE" ||
    (err as any)?.code === "ECONNRESET" ||
    err?.message?.includes("connection closed") || 
    err?.message?.includes("connection error") || 
    err?.message?.includes("broken pipe");

  if (isConnectionError) {
    e.preventDefault();
    return;
  }
});

const app = new Hono();

// Global Middleware: Check if preview mode and return early
app.use('*', async (c, next) => {
  if (isPreviewMode) {
    // Silently return 503 Service Unavailable without logging
    return c.json({ error: 'Server disabled in preview mode' }, 503);
  }
  await next();
});

// Global Error Handler
app.onError((err, c) => {
  // If the error is a connection error (e.g. client disconnect), we suppress it from being a 500
  const isConnectionError = 
    err.name === 'Http' || 
    err.name === 'BrokenPipe' ||
    err.name === 'ConnectionReset' ||
    (err as any).code === "EPIPE" ||
    (err as any).code === "ECONNRESET" ||
    err.message?.includes('connection closed') || 
    err.message?.includes('connection error') ||
    err.message?.includes('broken pipe');

  if (isConnectionError) {
    // Return 499 Client Closed Request
    return c.text('', 499);
  }
  
  console.error("🔥 Hono Error:", err);
  return c.json({ error: err.message || "Internal Server Error" }, 500);
});

// Logger Middleware
app.use('*', logger());

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-3d55d0fe/health", (c) => {
  return c.json({ status: "ok" });
});

app.post("/make-server-3d55d0fe/signup", async (c) => {
  const { email, password, name } = await c.req.json();
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { name },
    email_confirm: true
  });

  if (error) {
    return c.json({ error: error.message }, 400);
  }

  return c.json({ data });
});

// Pets Endpoints
app.get("/make-server-3d55d0fe/pets", async (c) => {
  const ownerId = c.req.query('ownerId');
  const status = c.req.query('status');
  const isExplore = c.req.query('explore') === 'true';

  let pets = await kv.getByPrefix("pet:");
  
  // Filter by owner
  if (ownerId) {
    pets = pets.filter((p: any) => p.owner_id === ownerId || p.owners?.some((o: any) => o.id === ownerId));
  }
  
  // Filter by status
  if (status) {
    pets = pets.filter((p: any) => p.status === status);
  }

  // Filter for Explore page: Exclude personal pets (those with owner_id)
  if (isExplore) {
    pets = pets.filter((p: any) => !p.owner_id);
  }
  
  return c.json(pets);
});

app.get("/make-server-3d55d0fe/pets/:id", async (c) => {
  const id = c.req.param("id");
  const pet = await kv.get(`pet:${id}`);
  if (!pet) {
    return c.json({ error: "Pet not found" }, 404);
  }
  return c.json(pet);
});

app.post("/make-server-3d55d0fe/pets", async (c) => {
  const pet = await c.req.json();
  if (!pet.id) {
    pet.id = crypto.randomUUID();
  }
  await kv.set(`pet:${pet.id}`, pet);
  return c.json(pet);
});

// Favorites Endpoints
app.get("/make-server-3d55d0fe/favorites/:userId", async (c) => {
  const userId = c.req.param("userId");
  const favorites = await kv.get(`favorites:${userId}`);
  return c.json(favorites || []);
});

app.post("/make-server-3d55d0fe/favorites/:userId", async (c) => {
  const userId = c.req.param("userId");
  const { petId } = await c.req.json();
  let favorites = (await kv.get(`favorites:${userId}`)) || [];
  if (!favorites.includes(petId)) {
    favorites.push(petId);
    await kv.set(`favorites:${userId}`, favorites);
  }
  return c.json(favorites);
});

app.delete("/make-server-3d55d0fe/favorites/:userId/:petId", async (c) => {
  const userId = c.req.param("userId");
  const petId = c.req.param("petId");
  let favorites = (await kv.get(`favorites:${userId}`)) || [];
  favorites = favorites.filter((id: string) => id !== petId);
  await kv.set(`favorites:${userId}`, favorites);
  return c.json(favorites);
});

// Upload Endpoint
app.post("/make-server-3d55d0fe/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body['file'];

  if (!file || !(file instanceof File)) {
     return c.json({ error: "No file uploaded" }, 400);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
  
  const bucketName = "make-3d55d0fe";
  
  // Create bucket if not exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: true }); 
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  // Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return c.json({ url: publicUrl });
});

// Adoption Endpoint
app.post("/make-server-3d55d0fe/adopt", async (c) => {
  const body = await c.req.json();
  const { petId, petName, phone, socialLink, contactInfo, userId } = body;
  
  // Store adoption request in KV
  const id = crypto.randomUUID();
  const request = {
    id,
    petId,
    petName,
    phone,
    socialLink,
    contactInfo,
    userId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  await kv.set(`adoption:${id}`, request);
  
  return c.json({ success: true, id });
});

// Admin: Get all adoptions
app.get("/make-server-3d55d0fe/adoptions", async (c) => {
  const adoptions = await kv.getByPrefix("adoption:");
  // Sort by createdAt desc
  adoptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return c.json(adoptions);
});

// Admin: Update adoption status
app.patch("/make-server-3d55d0fe/adoptions/:id", async (c) => {
  const id = c.req.param("id");
  const { status } = await c.req.json();
  
  const existing = await kv.get(`adoption:${id}`);
  if (!existing) {
    return c.json({ error: "Adoption request not found" }, 404);
  }
  
  const updated = { ...existing, status };
  await kv.set(`adoption:${id}`, updated);
  
  return c.json(updated);
});

// User Profile Endpoints
app.get("/make-server-3d55d0fe/users", async (c) => {
  const users = await kv.getByPrefix("user:");
  return c.json(users);
});

app.get("/make-server-3d55d0fe/users/:id", async (c) => {
  const id = c.req.param("id");
  const user = await kv.get(`user:${id}`);
  return c.json(user || {});
});

app.put("/make-server-3d55d0fe/users/:id", async (c) => {
  const id = c.req.param("id");
  const data = await c.req.json();
  const existing = await kv.get(`user:${id}`) || {};
  const updated = { ...existing, ...data, id };
  await kv.set(`user:${id}`, updated);
  return c.json(updated);
});

// Treatments Endpoints
app.get("/make-server-3d55d0fe/treatments/:petId", async (c) => {
  const petId = c.req.param("petId");
  const treatments = await kv.getByPrefix(`treatment:${petId}`);
  return c.json(treatments || []);
});

app.post("/make-server-3d55d0fe/treatments", async (c) => {
  const treatment = await c.req.json();
  if (!treatment.id) {
    treatment.id = crypto.randomUUID();
  }
  // Key format: treatment:{petId}:{treatmentId}
  await kv.set(`treatment:${treatment.petId}:${treatment.id}`, treatment);

  // Update Pet Record for Dashboard/Health View
  const petKey = `pet:${treatment.petId}`;
  const pet = await kv.get(petKey);
  
  if (pet) {
      // Calculate expiresAt
      const date = new Date(treatment.date);
      // duration is in weeks (from frontend)
      date.setDate(date.getDate() + (treatment.duration * 7));
      const expiresAt = date.toISOString();
      
      const type = treatment.type; // 'fleaTick' or 'worming'
      
      if (!pet.parasiteControl) pet.parasiteControl = {};
      
      pet.parasiteControl[type] = {
          lastDate: treatment.date,
          expiresAt: expiresAt,
          product: treatment.product
      };
      
      await kv.set(petKey, pet);
  }

  return c.json(treatment);
});

// Service Categories Endpoints
app.get("/make-server-3d55d0fe/service-categories", async (c) => {
  try {
    // Fetch directly from local KV store
    const categories = await kv.getByPrefix("category:");
    
    // Sort logic if needed
    return c.json(categories);
  } catch (e) {
    console.error("Error fetching categories:", e);
    return c.json([]);
  }
});

// Services Endpoints
app.get("/make-server-3d55d0fe/services", async (c) => {
  try {
    // Fetch directly from local KV store
    const services = await kv.getByPrefix("service_item:");
    
    if (services && services.length > 0) {
      // Sort by promoted first
      services.sort((a: any, b: any) => (b.promoted ? 1 : 0) - (a.promoted ? 1 : 0));
      return c.json(services);
    }
    
    return c.json([]);
  } catch (e) {
    console.error("Error fetching services:", e);
    return c.json([]);
  }
});

// Banners Endpoint (New specification)
app.get("/make-server-3d55d0fe/public/banners", async (c) => {
  try {
    const banners = await kv.getByPrefix("banner:");
    const now = Date.now();
    
    const activeBanners = banners.map((b: any) => {
      // Check if active and within date range
      if (!b.isActive) return null;
      if (b.startDate && new Date(b.startDate).getTime() > now) return null;
      if (b.endDate && new Date(b.endDate).getTime() < now) return null;

      let mediaUrl = b.mediaUrl || b.imageUrl || "";

      // If we have a path but no URL, fallback to path
      if (!mediaUrl && b.mediaPath) {
           mediaUrl = b.mediaPath; 
      }

      return {
        id: b.id,
        mediaUrl: mediaUrl,
        link: b.link || b.targetUrl || "",
        isActive: b.isActive
      };
    });

    return c.json(activeBanners.filter(Boolean));
  } catch (error) {
    console.error("Error fetching banners:", error);
    return c.json([], 500);
  }
});

// Ads Endpoints
app.get("/make-server-3d55d0fe/ads", async (c) => {
  const ads = await kv.getByPrefix("ad:");
  return c.json(ads);
});

app.post("/make-server-3d55d0fe/ads", async (c) => {
  const ad = await c.req.json();
  if (!ad.id) {
    ad.id = crypto.randomUUID();
  }
  await kv.set(`ad:${ad.id}`, ad);
  return c.json(ad);
});

app.put("/make-server-3d55d0fe/ads/:id", async (c) => {
  const id = c.req.param("id");
  const ad = await c.req.json();
  await kv.set(`ad:${id}`, ad);
  return c.json(ad);
});

app.delete("/make-server-3d55d0fe/ads/:id", async (c) => {
  const id = c.req.param("id");
  await kv.del(`ad:${id}`);
  return c.json({ success: true });
});

app.post("/make-server-3d55d0fe/ads/:id/click", async (c) => {
    const id = c.req.param("id");
    const ad = await kv.get(`ad:${id}`);
    if (ad) {
        ad.clicks = (ad.clicks || 0) + 1;
        await kv.set(`ad:${id}`, ad);
        return c.json({ success: true, clicks: ad.clicks });
    }
    return c.json({ error: "Ad not found" }, 404);
});

app.post("/make-server-3d55d0fe/ads/:id/impression", async (c) => {
    const id = c.req.param("id");
    const ad = await kv.get(`ad:${id}`);
    if (ad) {
        ad.impressions = (ad.impressions || 0) + 1;
        await kv.set(`ad:${id}`, ad);
        return c.json({ success: true, impressions: ad.impressions });
    }
    return c.json({ error: "Ad not found" }, 404);
});

Deno.serve(
  {
    onError: (e) => {
      // Suppress connection errors from polluting the logs
      const isConnectionError = 
        e.name === 'Http' || 
        e.name === 'BrokenPipe' ||
        e.name === 'ConnectionReset' ||
        (e as any).code === "EPIPE" ||
        (e as any).code === "ECONNRESET" ||
        e.message?.includes('connection closed') || 
        e.message?.includes('connection error') ||
        e.message?.includes('broken pipe');

      if (isConnectionError) {
        // Return minimal response for connection errors
        return new Response(null, { status: 499 });
      }
      console.error("Critical Server Error:", e);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
  app.fetch
);