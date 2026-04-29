import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#050505]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/">
              <img src="/logo-nav.svg" alt="Cyber Falcon" className="h-14 md:h-16 w-auto mb-6" />
            </Link>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              Your trusted partner in cybersecurity, IT services, and digital transformation.
            </p>
          </div>

          {/* Services */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-white/50 mb-6">Services</h4>
            <ul className="space-y-3">
              {["Web Development", "Mobile Apps", "Cybersecurity", "Digital Marketing", "UI/UX Design"].map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-white/30 text-sm hover:text-white transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-white/50 mb-6">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
                { label: "Careers", href: "#" },
                { label: "Privacy", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/30 text-sm hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-white/50 mb-6">Get In Touch</h4>
            <div className="space-y-3 text-sm text-white/30 mb-8">
              <p>info@cyberfalcon.in</p>
              <p>+91 8688329915</p>
              <p>Plot No:104, Road No-2, Usha's The Felicity, 5th Floor, Kakatiya Hills, Madhapur, Hyderabad-500033</p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 border border-[#EC1C24]/30 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white/60 hover:text-white hover:bg-[#EC1C24] hover:border-[#EC1C24] transition-all duration-400 rounded-sm"
            >
              Start a project
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-xs">
            &copy; {new Date().getFullYear()} Cyber Falcon. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Securing your digital future
          </p>
        </div>
      </div>
    </footer>
  );
}
