import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "wouter";
import { Shield, Target, Eye, Award, Users, Rocket, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import StatsCounter from "../components/stats-counter";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

const values = [
  { icon: Shield, title: "Security First", description: "Every solution starts with a security-first mindset.", color: "#EC1C24" },
  { icon: Target, title: "Precision", description: "Clean, efficient code that performs flawlessly.", color: "#EC1C24" },
  { icon: Rocket, title: "Innovation", description: "Leveraging emerging tech for competitive advantage.", color: "#EC1C24" },
  { icon: Users, title: "Partnership", description: "Long-term relationships focused on your success.", color: "#EC1C24" },
];

const timeline = [
  { year: "2020", title: "Founded", desc: "Established with a vision to bridge cybersecurity and digital innovation." },
  { year: "2021", title: "Growth", desc: "20+ engineers, launched mobile development division." },
  { year: "2022", title: "Security Lab", desc: "Dedicated cybersecurity research lab, ISO 27001 certified." },
  { year: "2023", title: "Global", desc: "Serving clients across 15+ countries with 24/7 support." },
  { year: "2025", title: "AI-Powered", desc: "AI-powered security monitoring and marketing automation." },
  { year: "2026", title: "Today", desc: "60+ projects, trusted by enterprises worldwide." },
];

const team = [
  { name: "Deep Kondabattula", role: ["CEO & Founder", "Head of Security", "Creative Director"], desc: "7+ years in cybersecurity and tech leadership." },
  { name: "Praveena Gunja", role: ["CTO", "Head HR"], desc: "Full-stack architect specializing in scalable systems." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-20">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#EC1C24]" />
              <span className="text-[#EC1C24] text-xs font-display uppercase tracking-[0.3em]">About Us</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
              The Team Behind <span className="gradient-text">Cyber Falcon.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/40 text-lg max-w-xl leading-relaxed">
              Passionate engineers, designers, security experts, and strategists united by one mission: empowering businesses through technology.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-[1400px] mx-auto px-8 md:px-12 pb-32">
        <StatsCounter />
      </section>

      {/* Mission & Vision */}
      <section className="pb-32 border-t border-white/[0.04] pt-32">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/[0.04]">
          <Reveal>
            <div className="bg-[#0a0a0a] p-10 md:p-16 h-full">
              <Target className="w-8 h-8 text-[#EC1C24] mb-6" />
              <h3 className="font-display text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/40 leading-relaxed">
                Deliver cutting-edge technology solutions that drive business growth while maintaining the highest standards of security and reliability.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="bg-[#0a0a0a] p-10 md:p-16 h-full">
              <Eye className="w-8 h-8 text-[#EC1C24] mb-6" />
              <h3 className="font-display text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-white/40 leading-relaxed">
                Become the most trusted technology partner worldwide — where innovation meets impenetrable security.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Statement */}
      <section className="py-32">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <Reveal>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-4xl">
              We don't just deliver projects — we build lasting <span className="gradient-text">partnerships.</span>
            </h2>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="pb-32 border-t border-white/[0.04] pt-32">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <Reveal><h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-16">Core Values.</h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[1px] bg-white/[0.04]">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="bg-[#0a0a0a] p-10 text-center h-full">
                  <v.icon className="w-8 h-8 mx-auto mb-4" style={{ color: v.color }} />
                  <h4 className="font-display text-base font-bold mb-2">{v.title}</h4>
                  <p className="text-white/40 text-sm">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-32 border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <Reveal><h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-20">Our Journey.</h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-0">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.08}>
                <div className="border-t border-white/[0.06] pt-6 pb-8 pr-6">
                  <span className="text-[#EC1C24] font-display text-sm font-bold">{t.year}</span>
                  <h4 className="font-display text-lg font-bold mt-2 mb-2">{t.title}</h4>
                  <p className="text-white/30 text-xs leading-relaxed">{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-32 border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <Reveal><h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-16">Leadership.</h2></Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-white/[0.04]">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div className="bg-[#0a0a0a] p-10 text-center group h-full">
                  <div className="w-20 h-20 rounded-full mx-auto mb-5 bg-gradient-to-br from-[#EC1C24]/20 to-[#EC1C24]/20 flex items-center justify-center border border-white/[0.06]">
                    <span className="font-display text-2xl font-bold text-[#EC1C24]">{m.name.includes(" ") ? m.name.split(" ").map(n => n[0]).join("") : m.name}</span>
                  </div>
                  <h4 className="font-display text-base font-bold">{m.name}</h4>
                  <div className="flex flex-col gap-0.5 mt-1">
                    {m.role.map((r) => (
                      <p key={r} className="text-[#EC1C24] text-xs font-display uppercase tracking-wider">{r}</p>
                    ))}
                  </div>
                  <p className="text-white/30 text-sm mt-3">{m.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[1px] bg-[#EC1C24]" />
                <span className="text-[#EC1C24] text-xs font-display uppercase tracking-[0.3em]">Why Cyber Falcon</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-8">Your Trusted Partner.</h2>
              <div className="space-y-4">
                {["ISO 27001 & SOC 2 Compliant", "24/7 Dedicated Support", "Agile Methodology", "Transparent Pricing", "Industry-Leading Standards", "60+ Projects Delivered"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#EC1C24] flex-shrink-0" />
                    <span className="text-white/40 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="border border-white/[0.06] p-10 md:p-14">
              <Award className="w-10 h-10 text-[#EC1C24] mb-6" />
              <h3 className="font-display text-xl font-bold mb-3">Certified Excellence</h3>
              <p className="text-white/40 leading-relaxed mb-8 text-sm">
                Our commitment to quality is backed by international certifications and industry recognition.
              </p>
              <Link href="/contact" className="group inline-flex items-center gap-2 text-xs font-display uppercase tracking-[0.2em] text-[#EC1C24] hover:text-white transition-colors">
                Work With Us <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
