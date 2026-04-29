import { lazy, Suspense, useRef, useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import {
  ArrowRight,
  ArrowDown,
  Shield,
  Code,
  Smartphone,
  Megaphone,
  Lock,
  Zap,
  Globe,
  ChevronRight,
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import StatsCounter from "../components/stats-counter";

const ThreeScene = lazy(() => import("../components/three-scene"));

/* ─── Reveal on scroll component ─── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Parallax section ─── */
function ParallaxSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

const services = [
  {
    icon: Code,
    title: "Web Development",
    desc: "Custom websites and web applications built with cutting-edge technologies for performance and scale.",
    accent: "#EC1C24",
  },
  {
    icon: Smartphone,
    title: "Mobile Applications",
    desc: "Native and cross-platform mobile apps delivering seamless experiences on every device.",
    accent: "#00ccdd",
  },
  {
    icon: Lock,
    title: "Cybersecurity",
    desc: "Comprehensive security solutions protecting your digital assets from evolving threats.",
    accent: "#EC1C24",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "Data-driven strategies that amplify your brand and deliver measurable ROI.",
    accent: "#00ccdd",
  },
];

const processSteps = [
  { num: "01", icon: Zap, title: "Discovery", desc: "Deep-dive into your business, goals, and challenges." },
  { num: "02", icon: Globe, title: "Strategy", desc: "Blueprint with milestones, KPIs, and architecture." },
  { num: "03", icon: Code, title: "Build", desc: "Agile sprints with continuous delivery and testing." },
  { num: "04", icon: Shield, title: "Launch", desc: "Seamless deployment with 24/7 monitoring and support." },
];

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.5], [1, 0.96]);
  const heroY = useTransform(heroScroll, [0, 0.5], [0, 60]);

  const [showScroll, setShowScroll] = useState(true);
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY < 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO — Full-screen with cybersecurity 3D
          ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        <Suspense fallback={null}>
          <ThreeScene />
        </Suspense>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-transparent to-[#0a0a0a] z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent z-[1]" />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-[#EC1C24] animate-pulse" />
              <span className="text-white/60 text-xs font-medium uppercase tracking-[0.25em]">
                IT Services & Cybersecurity
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[0.95] mb-8"
            >
              Securing
              <br />
              Your Digital
              <br />
              <span className="text-[#EC1C24]">Future.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1 }}
              className="text-white/45 text-lg md:text-xl max-w-lg leading-relaxed mb-12"
            >
              From cutting-edge development to impenetrable cybersecurity — we are your mission-critical technology partner.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="flex items-center gap-4"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 bg-[#EC1C24] px-7 py-4 text-sm font-medium tracking-wide hover:bg-[#d41920] transition-all duration-400 rounded-sm"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 px-6 py-4 border border-white/15 text-sm font-medium tracking-wide text-white/70 hover:text-white hover:border-white/30 transition-all duration-400 rounded-sm"
              >
                Our Services
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ opacity: showScroll ? 1 : 0 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-white/20 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-white/25" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          STATS
          ═══════════════════════════════════════ */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 -mt-12 mb-0">
        <StatsCounter />
      </section>

      {/* ═══════════════════════════════════════
          STATEMENT
          ═══════════════════════════════════════ */}
      <section className="py-32 md:py-44">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-4xl">
              We build digital experiences that are{" "}
              <span className="text-[#EC1C24]">secure by design</span> and{" "}
              <span className="text-[#EC1C24]">built to scale.</span>
            </h2>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SERVICES
          ═══════════════════════════════════════ */}
      <section className="pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#EC1C24]" />
              <span className="text-[#EC1C24] text-xs font-medium uppercase tracking-[0.25em]">Our Expertise</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-16">
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
                Services.
              </h2>
              <Link
                href="/services"
                className="group flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
              >
                View all services
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/[0.04]">
            {services.map((service, i) => (
              <Reveal key={service.title} delay={i * 0.08}>
                <Link href="/services">
                  <div className="group bg-[#0a0a0a] p-10 md:p-14 cursor-pointer hover:bg-[#0f0f0f] transition-all duration-500 h-full">
                    <div className="flex items-start justify-between mb-8">
                      <service.icon className="w-7 h-7" style={{ color: service.accent }} />
                      <ArrowRight className="w-5 h-5 text-white/0 group-hover:text-white/30 transition-all" />
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold mb-4 tracking-tight group-hover:text-white transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-white/35 leading-relaxed text-sm group-hover:text-white/55 transition-colors">
                      {service.desc}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PARALLAX STATEMENT
          ═══════════════════════════════════════ */}
      <section className="relative py-36 md:py-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#EC1C24]/[0.03] via-transparent to-[#00ccdd]/[0.02]" />
        <ParallaxSection>
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
            <Reveal>
              <p className="text-white/25 text-xs font-medium uppercase tracking-[0.35em] mb-8">
                Precision · Protection · Performance
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Your digital journey
                <br />
                starts <span className="text-[#EC1C24]">now.</span>
              </h2>
            </Reveal>
          </div>
        </ParallaxSection>
      </section>

      {/* ═══════════════════════════════════════
          PROCESS
          ═══════════════════════════════════════ */}
      <section className="py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#EC1C24]" />
              <span className="text-[#EC1C24] text-xs font-medium uppercase tracking-[0.25em]">How We Work</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-20">
              Our Process.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {processSteps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.1}>
                <div className="relative p-8 md:p-10 border-t border-white/[0.06] group">
                  <span className="font-display text-6xl md:text-7xl font-bold text-white/[0.03] absolute top-4 right-6 group-hover:text-[#EC1C24]/[0.08] transition-colors duration-700">
                    {step.num}
                  </span>
                  <step.icon className="w-6 h-6 text-[#EC1C24] mb-6" />
                  <h3 className="font-display text-lg font-bold mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-white/35 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA
          ═══════════════════════════════════════ */}
      <section className="py-32 md:py-44 border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <Reveal>
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Ready to
                <br />
                <span className="text-[#EC1C24]">transform</span>
                <br />
                your business?
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <div>
                <p className="text-white/35 text-lg leading-relaxed mb-10 max-w-md">
                  Let's discuss how Cyber Falcon can elevate your digital presence and fortify your security infrastructure.
                </p>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-4 bg-[#EC1C24] px-8 py-4 text-sm font-medium tracking-wide hover:bg-[#d41920] transition-all duration-400 rounded-sm"
                >
                  Get a Free Consultation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
