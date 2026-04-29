import { Hono } from 'hono';
import { cors } from "hono/cors";
import { drizzle } from "drizzle-orm/d1";
import { eq, desc } from "drizzle-orm";
import { inquiries, blogPosts, adminUsers } from "./database/schema";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>().basePath('api');

app.use(cors({ origin: "*" }));

// Helper to get DB
function getDb(c: any) {
  return drizzle(c.env.DB);
}

// Simple token check (in production, use JWT)
const ADMIN_TOKEN = "cf-admin-token-2026";

function isAuthed(c: any): boolean {
  const auth = c.req.header("Authorization");
  return auth === `Bearer ${ADMIN_TOKEN}`;
}

// ==================
// Public Routes
// ==================

app.get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }));

// Submit inquiry (public)
app.post('/inquiries', async (c) => {
  const db = getDb(c);
  const body = await c.req.json() as {
    name: string;
    email: string;
    company?: string;
    service: string;
    message: string;
  };

  if (!body.name || !body.email || !body.service || !body.message) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  await db.insert(inquiries).values({
    name: body.name,
    email: body.email,
    company: body.company || null,
    service: body.service,
    message: body.message,
  });

  return c.json({ success: true });
});

// Get published blog posts (public)
app.get('/blog', async (c) => {
  const db = getDb(c);
  const published = c.req.query("published");
  
  let posts;
  if (published === "true") {
    posts = await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
  } else {
    posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  return c.json({ posts });
});

// ==================
// Admin Routes
// ==================

// Admin login
app.post('/admin/login', async (c) => {
  const body = await c.req.json() as { username: string; password: string };
  
  // Default admin credentials
  if (body.username === "admin" && body.password === "cyberfalcon2026") {
    return c.json({ success: true, token: ADMIN_TOKEN });
  }

  // Check database for additional admin users
  try {
    const db = getDb(c);
    const user = await db.select().from(adminUsers).where(eq(adminUsers.username, body.username)).limit(1);
    if (user.length > 0 && user[0].passwordHash === body.password) {
      return c.json({ success: true, token: ADMIN_TOKEN });
    }
  } catch {}

  return c.json({ success: false, error: "Invalid credentials" }, 401);
});

// Get all inquiries (admin)
app.get('/admin/inquiries', async (c) => {
  if (!isAuthed(c)) return c.json({ error: "Unauthorized" }, 401);
  const db = getDb(c);
  const results = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  return c.json({ inquiries: results });
});

// Update inquiry status (admin)
app.patch('/admin/inquiries/:id', async (c) => {
  if (!isAuthed(c)) return c.json({ error: "Unauthorized" }, 401);
  const db = getDb(c);
  const id = parseInt(c.req.param("id"));
  const body = await c.req.json() as { status: string };
  
  await db.update(inquiries).set({ status: body.status }).where(eq(inquiries.id, id));
  return c.json({ success: true });
});

// Delete inquiry (admin)
app.delete('/admin/inquiries/:id', async (c) => {
  if (!isAuthed(c)) return c.json({ error: "Unauthorized" }, 401);
  const db = getDb(c);
  const id = parseInt(c.req.param("id"));
  
  await db.delete(inquiries).where(eq(inquiries.id, id));
  return c.json({ success: true });
});

// Get all blog posts (admin)
app.get('/admin/blog', async (c) => {
  if (!isAuthed(c)) return c.json({ error: "Unauthorized" }, 401);
  const db = getDb(c);
  const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  return c.json({ posts });
});

// Create blog post (admin)
app.post('/admin/blog', async (c) => {
  if (!isAuthed(c)) return c.json({ error: "Unauthorized" }, 401);
  const db = getDb(c);
  const body = await c.req.json() as {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    published: boolean;
  };

  await db.insert(blogPosts).values({
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt,
    content: body.content,
    category: body.category,
    published: body.published,
  });

  return c.json({ success: true });
});

// Update blog post (admin)
app.patch('/admin/blog/:id', async (c) => {
  if (!isAuthed(c)) return c.json({ error: "Unauthorized" }, 401);
  const db = getDb(c);
  const id = parseInt(c.req.param("id"));
  const body = await c.req.json() as Partial<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    published: boolean;
  }>;

  await db.update(blogPosts).set({
    ...body,
    updatedAt: new Date().toISOString(),
  }).where(eq(blogPosts.id, id));

  return c.json({ success: true });
});

// Delete blog post (admin)
app.delete('/admin/blog/:id', async (c) => {
  if (!isAuthed(c)) return c.json({ error: "Unauthorized" }, 401);
  const db = getDb(c);
  const id = parseInt(c.req.param("id"));
  
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return c.json({ success: true });
});

export default app;
