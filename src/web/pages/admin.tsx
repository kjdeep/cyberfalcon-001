import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Shield,
  Inbox,
  FileText,
  LogOut,
  Eye,
  Trash2,
  Check,
  Plus,
  X,
  ChevronDown,
  BarChart3,
  Users,
  TrendingUp,
} from "lucide-react";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
  status: string;
  createdAt: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "inquiries" | "blog">("dashboard");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Cybersecurity",
    published: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json() as { success?: boolean; token?: string; error?: string };
      if (data.success) {
        localStorage.setItem("admin_token", data.token || "");
        setIsLoggedIn(true);
      } else {
        setLoginError(data.error || "Invalid credentials");
      }
    } catch {
      setLoginError("Connection error");
    }
  };

  const token = () => localStorage.getItem("admin_token") || "";

  const fetchData = async () => {
    try {
      const [inqRes, blogRes] = await Promise.all([
        fetch("/api/admin/inquiries", { headers: { Authorization: `Bearer ${token()}` } }),
        fetch("/api/admin/blog", { headers: { Authorization: `Bearer ${token()}` } }),
      ]);
      if (inqRes.ok) {
        const inqData = await inqRes.json() as { inquiries: Inquiry[] };
        setInquiries(inqData.inquiries || []);
      }
      if (blogRes.ok) {
        const blogData = await blogRes.json() as { posts: BlogPost[] };
        setBlogPosts(blogData.posts || []);
      }
    } catch {}
  };

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  const updateInquiryStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  const deleteInquiry = async (id: number) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token()}` },
    });
    setSelectedInquiry(null);
    fetchData();
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify(blogForm),
    });
    setShowBlogForm(false);
    setBlogForm({ title: "", slug: "", excerpt: "", content: "", category: "Cybersecurity", published: false });
    fetchData();
  };

  const deleteBlogPost = async (id: number) => {
    await fetch(`/api/admin/blog/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token()}` },
    });
    fetchData();
  };

  const toggleBlogPublish = async (id: number, published: boolean) => {
    await fetch(`/api/admin/blog/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ published: !published }),
    });
    fetchData();
  };

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background grid-bg flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <img src="/logo.svg" alt="Cyber Falcon" className="h-12 mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold">Admin Portal</h1>
            <p className="text-muted-foreground text-sm mt-1">Cyber Falcon Management Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 glass rounded-2xl neon-border space-y-5">
            <div>
              <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">Username</label>
              <input
                type="text"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-neon-red/50 transition-all"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">Password</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-neon-red/50 transition-all"
                placeholder="••••••••"
              />
            </div>
            {loginError && (
              <p className="text-red-400 text-sm">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-neon-cyan to-neon-orange text-background font-display text-sm font-bold uppercase tracking-wider rounded-lg hover:shadow-[0_0_30px_rgba(224,32,32,0.4)] transition-all"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-muted-foreground text-xs mt-4">
            Default: admin / cyberfalcon2026
          </p>
        </motion.div>
      </div>
    );
  }

  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const publishedPosts = blogPosts.filter((p) => p.published).length;

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Cyber Falcon" className="h-7 w-auto" />
            <span className="font-display text-sm font-bold tracking-wider">
              CYBER<span className="text-neon-red">FALCON</span>
              <span className="text-muted-foreground ml-2 font-body font-normal">Admin</span>
            </span>
          </div>
          <button
            onClick={() => { localStorage.removeItem("admin_token"); setIsLoggedIn(false); }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="pt-16 max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {([
            { key: "dashboard", icon: BarChart3, label: "Dashboard" },
            { key: "inquiries", icon: Inbox, label: `Inquiries (${newInquiries})` },
            { key: "blog", icon: FileText, label: `Blog (${blogPosts.length})` },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-display text-xs uppercase tracking-wider transition-all ${
                activeTab === tab.key
                  ? "bg-neon-red/10 text-neon-red border border-neon-red/30"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Inquiries", value: inquiries.length, icon: Inbox, color: "#E02020" },
                { label: "New Inquiries", value: newInquiries, icon: Users, color: "#FF6B35" },
                { label: "Blog Posts", value: blogPosts.length, icon: FileText, color: "#E02020" },
                { label: "Published", value: publishedPosts, icon: TrendingUp, color: "#10b981" },
              ].map((stat) => (
                <div key={stat.label} className="p-6 glass rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground text-xs font-display uppercase tracking-wider">{stat.label}</span>
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <p className="font-display text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent inquiries */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-neon-red mb-4">Recent Inquiries</h3>
              {inquiries.length === 0 ? (
                <p className="text-muted-foreground text-sm">No inquiries yet.</p>
              ) : (
                <div className="space-y-3">
                  {inquiries.slice(0, 5).map((inq) => (
                    <div key={inq.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <div>
                        <p className="text-sm font-semibold">{inq.name}</p>
                        <p className="text-xs text-muted-foreground">{inq.service} &middot; {inq.email}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-display uppercase tracking-wider ${
                        inq.status === "new" ? "bg-neon-red/10 text-neon-red border border-neon-red/20" :
                        inq.status === "reviewed" ? "bg-neon-orange/10 text-neon-orange border border-neon-orange/20" :
                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === "inquiries" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {inquiries.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center">
                  <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No inquiries received yet.</p>
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className={`p-4 glass rounded-xl cursor-pointer transition-all hover:border-neon-red/20 ${
                      selectedInquiry?.id === inq.id ? "neon-border" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{inq.name}</p>
                        <p className="text-xs text-muted-foreground">{inq.email} &middot; {inq.company || "N/A"}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-display uppercase tracking-wider flex-shrink-0 ${
                        inq.status === "new" ? "bg-neon-red/10 text-neon-red border border-neon-red/20" :
                        inq.status === "reviewed" ? "bg-neon-orange/10 text-neon-orange border border-neon-orange/20" :
                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      <span className="text-neon-red">{inq.service}</span> &middot; {new Date(inq.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{inq.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Detail panel */}
            <div>
              {selectedInquiry ? (
                <div className="glass rounded-xl p-6 neon-border sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider">Inquiry Details</h3>
                    <button onClick={() => setSelectedInquiry(null)}>
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Name</p>
                      <p className="text-sm font-semibold">{selectedInquiry.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Email</p>
                      <p className="text-sm">{selectedInquiry.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Company</p>
                      <p className="text-sm">{selectedInquiry.company || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Service</p>
                      <p className="text-sm text-neon-red">{selectedInquiry.service}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Message</p>
                      <p className="text-sm leading-relaxed">{selectedInquiry.message}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Date</p>
                      <p className="text-sm">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => updateInquiryStatus(selectedInquiry.id, "reviewed")}
                        className="flex items-center gap-1 px-3 py-2 bg-neon-orange/10 text-neon-orange border border-neon-orange/20 rounded-lg text-xs font-display uppercase"
                      >
                        <Eye className="w-3 h-3" /> Reviewed
                      </button>
                      <button
                        onClick={() => updateInquiryStatus(selectedInquiry.id, "completed")}
                        className="flex items-center gap-1 px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-display uppercase"
                      >
                        <Check className="w-3 h-3" /> Complete
                      </button>
                      <button
                        onClick={() => deleteInquiry(selectedInquiry.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-display uppercase"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass rounded-xl p-8 text-center">
                  <ChevronDown className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Select an inquiry to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === "blog" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider">Manage Blog Posts</h3>
              <button
                onClick={() => setShowBlogForm(!showBlogForm)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-orange text-background font-display text-xs font-bold uppercase tracking-wider rounded-lg"
              >
                <Plus className="w-4 h-4" /> New Post
              </button>
            </div>

            {showBlogForm && (
              <form onSubmit={handleBlogSubmit} className="p-6 glass rounded-xl neon-border space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-neon-red/50 transition-all"
                    placeholder="Post Title"
                  />
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-neon-red/50 transition-all"
                  >
                    {["Cybersecurity", "Web Development", "Mobile Development", "Digital Marketing", "Technology"].map((c) => (
                      <option key={c} value={c} className="bg-[#0d1117]">{c}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  required
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-neon-red/50 transition-all"
                  placeholder="Short excerpt"
                />
                <textarea
                  required
                  rows={6}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-neon-red/50 transition-all resize-none"
                  placeholder="Full blog content..."
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={blogForm.published}
                      onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                      className="w-4 h-4 accent-[#00f0ff]"
                    />
                    Publish immediately
                  </label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowBlogForm(false)} className="px-4 py-2 glass text-sm rounded-lg">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-gradient-to-r from-neon-cyan to-neon-orange text-background font-display text-xs font-bold uppercase rounded-lg">Save Post</button>
                  </div>
                </div>
              </form>
            )}

            {blogPosts.length === 0 ? (
              <div className="glass rounded-xl p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No blog posts yet. Create your first one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {blogPosts.map((post) => (
                  <div key={post.id} className="p-4 glass rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{post.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-display uppercase ${
                          post.published
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        }`}>
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {post.category} &middot; {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleBlogPublish(post.id, post.published)}
                        className="p-2 glass rounded-lg text-muted-foreground hover:text-neon-red transition-colors"
                        title={post.published ? "Unpublish" : "Publish"}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteBlogPost(post.id)}
                        className="p-2 glass rounded-lg text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
