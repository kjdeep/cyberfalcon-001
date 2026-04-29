import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Code, Smartphone, Lock, Megaphone, Globe, Palette,
  Server, BarChart3, ShieldCheck, Search, Share2, MonitorPlay, ArrowRight,
} from "lucide-react";
import { Link } from "wouter";
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

const mainServices = [
  { icon: Code, title: "Web Development", description: "Custom websites and web applications built with cutting-edge technologies. We create fast, scalable, and beautiful digital experiences.", features: ["React, Next.js & Vue Applications", "E-Commerce & SaaS Platforms", "Progressive Web Apps (PWA)", "API Development & Microservices", "CMS & Content Platforms", "Performance Optimization"], color: "#EC1C24" },
  { icon: Smartphone, title: "Mobile App Development", description: "Native and cross-platform mobile apps that deliver pixel-perfect, high-performance experiences across all devices.", features: ["iOS & Android Native Apps", "React Native & Flutter", "UI/UX Design for Mobile", "App Store Optimization", "Push Notifications & Analytics", "Maintenance & Updates"], color: "#EC1C24" },
  { icon: Lock, title: "Cybersecurity Solutions", description: "Comprehensive security services to protect your organization from evolving digital threats and ensure compliance.", features: ["Vulnerability Assessment & Pen Testing", "Security Operations Center (SOC)", "Incident Response & Recovery", "Compliance (ISO 27001, SOC 2, GDPR)", "Zero Trust Architecture", "Security Awareness Training"], color: "#EC1C24" },
  { icon: Megaphone, title: "Digital Marketing", description: "Data-driven marketing strategies that amplify your brand, drive engagement, and deliver measurable ROI.", features: ["SEO & Content Strategy", "Social Media Marketing", "PPC & Google Ads Management", "Email Marketing Automation", "Conversion Rate Optimization", "Analytics & Performance Tracking"], color: "#EC1C24" },
];

const additionalServices = [
  { icon: Palette, title: "UI/UX Design", desc: "User-centered design that converts visitors into customers." },
  { icon: Server, title: "Cloud Solutions", desc: "AWS, GCP & Azure infrastructure for scalable deployments." },
  { icon: Globe, title: "DevOps & CI/CD", desc: "Automated pipelines for fast, reliable software delivery." },
  { icon: BarChart3, title: "Data Analytics", desc: "Transform raw data into actionable business intelligence." },
  { icon: ShieldCheck, title: "IT Consulting", desc: "Strategic guidance to align technology with business goals." },
  { icon: Search, title: "QA & Testing", desc: "Comprehensive testing to ensure flawless user experiences." },
  { icon: Share2, title: "API Integration", desc: "Connect your systems with third-party services seamlessly." },
  { icon: MonitorPlay, title: "Maintenance", desc: "24/7 monitoring and proactive support for peace of mind." },
];

const techStack = [
  { category: "Frontend", items: ["React", "Next.js", "Vue", "Angular", "Tailwind CSS", "TypeScript"] },
  { category: "Backend", items: ["Node.js", "Python", "Go", "Java", "Rust", "GraphQL"] },
  { category: "Mobile", items: ["React Native", "Flutter", "Swift", "Kotlin"] },
  { category: "Cloud", items: ["AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform"] },
  { category: "Security", items: ["Burp Suite", "Metasploit", "Wireshark", "Nessus", "OWASP ZAP"] },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-20">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#EC1C24]" />
              <span className="text-[#EC1C24] text-xs font-display uppercase tracking-[0.3em]">What We Do</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-3xl">
              Comprehensive <span className="gradient-text">IT Services.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/40 text-lg max-w-xl leading-relaxed">
              From concept to deployment and beyond — end-to-end technology solutions tailored to your business.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Services */}
      <section className="pb-32">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <div className="space-y-0">
            {mainServices.map((service, i) => (
              <Reveal key={service.title} delay={i * 0.08}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 py-16 border-t border-white/[0.06] group">
                  <div className="md:col-span-1 flex items-start">
                    <service.icon className="w-7 h-7" style={{ color: service.color }} />
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">{service.title}</h3>
                    <p className="text-white/40 leading-relaxed text-sm">{service.description}</p>
                  </div>
                  <div className="md:col-span-7">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.features.map((f) => (
                        <div key={f} className="flex items-center gap-3 text-sm text-white/50">
                          <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: service.color }} />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-32 border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <Reveal>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-16">Additional Services.</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/[0.04]">
            {additionalServices.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <div className="bg-[#0a0a0a] p-8 group hover:bg-[#0f0f0f] transition-all h-full">
                  <s.icon className="w-5 h-5 text-[#EC1C24] mb-4" />
                  <h4 className="font-display text-sm font-bold mb-2">{s.title}</h4>
                  <p className="text-white/30 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-32 border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <Reveal><h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-16">Tech Stack.</h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {techStack.map((g, i) => (
              <Reveal key={g.category} delay={i * 0.08}>
                <div>
                  <h4 className="text-xs font-display uppercase tracking-[0.25em] text-[#EC1C24] mb-4">{g.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((t) => (
                      <span key={t} className="px-3 py-1.5 text-xs text-white/40 border border-white/[0.06] hover:border-white/20 transition-colors">{t}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-6">Have a Project in Mind?</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-white/40 text-lg max-w-lg mx-auto mb-10">Tell us about your vision and let's build something extraordinary.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link href="/contact" className="group inline-flex items-center gap-3 border border-white/20 px-10 py-5 text-xs font-display uppercase tracking-[0.25em] hover:bg-[#EC1C24] hover:border-[#EC1C24] transition-all duration-500">
              Get a Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
