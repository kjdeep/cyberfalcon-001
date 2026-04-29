import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

interface BlogPost { id: number; title: string; slug: string; excerpt: string; category: string; createdAt: string; coverImage: string | null; }

const categoryColors: Record<string, string> = { Cybersecurity: "#EC1C24", "Web Development": "#EC1C24", "Mobile Development": "#EC1C24", "Digital Marketing": "#EC1C24", Technology: "#d41920" };

const fallbackPosts: BlogPost[] = [
  { id: 1, title: "10 Essential Cybersecurity Practices for 2026", slug: "cybersecurity-practices-2026", excerpt: "As cyber threats evolve, your security strategy must too. Here are the top practices every organization needs.", category: "Cybersecurity", createdAt: "2026-04-10", coverImage: null },
  { id: 2, title: "The Future of Web Development: AI-Powered Interfaces", slug: "future-web-development-ai", excerpt: "Explore how AI is reshaping the way we design and build web applications for the next generation.", category: "Web Development", createdAt: "2026-04-05", coverImage: null },
  { id: 3, title: "Building Cross-Platform Apps with Flutter 4.0", slug: "flutter-4-cross-platform", excerpt: "Flutter 4.0 brings revolutionary features for cross-platform development. Here's what you need to know.", category: "Mobile Development", createdAt: "2026-03-28", coverImage: null },
  { id: 4, title: "SEO Trends Dominating Digital Marketing", slug: "seo-trends", excerpt: "Search engines are getting smarter. Stay ahead with these strategies defining the digital landscape.", category: "Digital Marketing", createdAt: "2026-03-20", coverImage: null },
  { id: 5, title: "Zero Trust Architecture: Implementation Guide", slug: "zero-trust-guide", excerpt: "Learn how to implement a Zero Trust security model from the ground up with our step-by-step guide.", category: "Cybersecurity", createdAt: "2026-03-15", coverImage: null },
  { id: 6, title: "Micro-Frontend Architecture for Scale", slug: "micro-frontend", excerpt: "Break down monolithic frontends into independently deployable modules for better team collaboration.", category: "Web Development", createdAt: "2026-03-10", coverImage: null },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...Object.keys(categoryColors)];

  useEffect(() => {
    fetch("/api/blog?published=true")
      .then((r) => r.json())
      .then((data: { posts?: BlogPost[] }) => { if (data.posts && data.posts.length > 0) setPosts(data.posts); })
      .catch(() => {});
  }, []);

  const filtered = filter === "All" ? posts : posts.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-12">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#EC1C24]" />
              <span className="text-[#EC1C24] text-xs font-display uppercase tracking-[0.3em]">Insights</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              The <span className="gradient-text">Blog.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/40 text-lg max-w-xl leading-relaxed">
              Expert insights on cybersecurity, development, and digital marketing.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filter */}
      <section className="max-w-[1400px] mx-auto px-8 md:px-12 pb-12">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 text-xs font-display uppercase tracking-[0.2em] transition-all ${
                filter === cat ? "bg-[#EC1C24] text-white" : "border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-[1400px] mx-auto px-8 md:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/[0.04]">
          {filtered.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.05}>
              <article className="bg-[#0a0a0a] group cursor-pointer hover:bg-[#0f0f0f] transition-all h-full">
                {/* Cover */}
                <div className="h-48 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${categoryColors[post.category] || "#EC1C24"}10, transparent)` }}>
                  <span className="absolute inset-0 flex items-center justify-center font-display text-7xl font-bold opacity-[0.03]" style={{ color: categoryColors[post.category] }}>
                    {post.category[0]}
                  </span>
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-display uppercase tracking-wider" style={{ background: `${categoryColors[post.category]}15`, color: categoryColors[post.category], border: `1px solid ${categoryColors[post.category]}25` }}>
                      <Tag className="w-3 h-3" />{post.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-white/25 text-xs mb-3">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                  <h3 className="font-display text-lg font-bold mb-3 leading-tight group-hover:text-white transition-colors">{post.title}</h3>
                  <p className="text-white/30 text-sm leading-relaxed mb-6 line-clamp-2">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-[#EC1C24] text-xs font-display uppercase tracking-wider group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        {filtered.length === 0 && <div className="text-center py-20"><p className="text-white/30">No posts in this category yet.</p></div>}
      </section>

      <Footer />
    </div>
  );
}
