import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Mail, Phone, MapPin, Send, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
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

const serviceOptions = ["Web Development", "Mobile App Development", "Cybersecurity", "Digital Marketing", "UI/UX Design", "Cloud Solutions", "Other"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setStatus("success"); setForm({ name: "", email: "", company: "", service: "", message: "" }); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-20">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#EC1C24]" />
              <span className="text-[#EC1C24] text-xs font-display uppercase tracking-[0.3em]">Contact</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-3xl">
              Let's Build <span className="gradient-text">Together.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/40 text-lg max-w-xl leading-relaxed">
              Have a project in mind? Fill out the form and our team will get back to you within 24 hours.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1400px] mx-auto px-8 md:px-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Info */}
          <div className="lg:col-span-4">
            <Reveal>
              <div className="space-y-10">
                {[
                  { icon: Mail, label: "Email", value: "info@cyberfalcon.in", color: "#EC1C24" },
                  { icon: Phone, label: "Phone", value: "+91 8688329915", color: "#EC1C24" },
                  { icon: MapPin, label: "Office", value: "Plot No:104, Road No-2, Usha's The Felicity,\n5th Floor, Kakatiya Hills, Madhapur, Hyderabad-500033", color: "#EC1C24" },
                  { icon: Clock, label: "Hours", value: "Mon-Fri: 9AM - 6PM IST\n24/7 Security Operations", color: "#EC1C24" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-5">
                    <div className="w-10 h-10 flex items-center justify-center border border-white/[0.06] flex-shrink-0">
                      <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-display uppercase tracking-[0.2em] text-white/30 mb-1">{item.label}</p>
                      <p className="text-white/60 text-sm whitespace-pre-line">{item.value}</p>
                    </div>
                  </div>
                ))}

                <div className="pt-6 border-t border-white/[0.04]">
                  <p className="text-xs font-display uppercase tracking-[0.2em] text-white/30 mb-4">Why Contact Us</p>
                  {["Free initial consultation", "Response within 24 hours", "No-obligation estimate", "NDA available"].map((item) => (
                    <div key={item} className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#EC1C24] flex-shrink-0" />
                      <span className="text-white/40 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-display uppercase tracking-[0.2em] text-white/30 mb-3">Full Name *</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-0 py-3 bg-transparent border-b border-white/[0.1] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#EC1C24] transition-colors"
                      placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-display uppercase tracking-[0.2em] text-white/30 mb-3">Email *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-0 py-3 bg-transparent border-b border-white/[0.1] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#EC1C24] transition-colors"
                      placeholder="john@company.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-display uppercase tracking-[0.2em] text-white/30 mb-3">Company</label>
                    <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-0 py-3 bg-transparent border-b border-white/[0.1] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#EC1C24] transition-colors"
                      placeholder="Company Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-display uppercase tracking-[0.2em] text-white/30 mb-3">Service *</label>
                    <select required value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full px-0 py-3 bg-transparent border-b border-white/[0.1] text-sm text-white focus:outline-none focus:border-[#EC1C24] transition-colors appearance-none">
                      <option value="" className="bg-[#111]">Select a service</option>
                      {serviceOptions.map((s) => (<option key={s} value={s} className="bg-[#111]">{s}</option>))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-display uppercase tracking-[0.2em] text-white/30 mb-3">Project Details *</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-0 py-3 bg-transparent border-b border-white/[0.1] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#EC1C24] transition-colors resize-none"
                    placeholder="Tell us about your project, goals, and timeline..." />
                </div>

                {status === "success" && (
                  <div className="flex items-center gap-3 py-4 text-emerald-400 text-sm">
                    <CheckCircle2 className="w-5 h-5" /> Thank you! We'll get back to you within 24 hours.
                  </div>
                )}
                {status === "error" && (
                  <div className="flex items-center gap-3 py-4 text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5" /> Something went wrong. Please try again.
                  </div>
                )}

                <button type="submit" disabled={status === "loading"}
                  className="group inline-flex items-center gap-3 border border-white/20 px-10 py-5 text-xs font-display uppercase tracking-[0.25em] hover:bg-[#EC1C24] hover:border-[#EC1C24] transition-all duration-500 disabled:opacity-50">
                  {status === "loading" ? "Sending..." : <>Send Message <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>}
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
