import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          {/* Logo — Left aligned, prominent */}
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/logo-nav.svg"
              alt="Cyber Falcon"
              className={`transition-all duration-500 ${
                scrolled ? "h-8" : "h-9 md:h-10"
              }`}
            />
          </Link>

          {/* Center Nav Links — Desktop only, bracket style */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-[13px] font-medium tracking-wide transition-all duration-300 ${
                  location === link.href
                    ? "text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <span className={`transition-opacity duration-300 ${location === link.href ? "opacity-50" : "opacity-0 group-hover:opacity-30"}`}>
                </span>
                {location === link.href ? (
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#EC1C24]/60 font-light">[</span>
                    {link.label}
                    <span className="text-[#EC1C24]/60 font-light">]</span>
                  </span>
                ) : (
                  link.label
                )}
              </Link>
            ))}
          </div>

          {/* Right Side — CTA + Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 border border-[#EC1C24]/40 text-[13px] font-medium tracking-wide text-white hover:bg-[#EC1C24] hover:border-[#EC1C24] transition-all duration-400 rounded-sm"
            >
              Get in touch
            </Link>
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a]"
          >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              {/* Menu header */}
              <div className="h-20 flex items-center justify-between">
                <Link href="/">
                  <img src="/logo-nav.svg" alt="Cyber Falcon" className="h-12" />
                </Link>
                <button
                  className="flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu links */}
              <div className="mt-12">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      className={`group flex items-center justify-between py-5 border-b border-white/[0.06] transition-all ${
                        location === link.href ? "text-white" : "text-white/40 hover:text-white"
                      }`}
                    >
                      <span className="font-display text-2xl md:text-4xl font-bold tracking-tight">
                        {link.label}
                      </span>
                      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* CTA in mobile menu */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#EC1C24] text-white text-sm font-medium tracking-wide rounded-sm"
                >
                  Get in touch
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Bottom contact info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-10 left-6 right-6 flex flex-col gap-3 text-white/25 text-xs tracking-wider"
              >
                <span>info@cyberfalcon.in</span>
                <span>Hyderabad, India</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
