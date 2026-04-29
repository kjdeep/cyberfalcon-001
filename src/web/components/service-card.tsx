import { useState, useRef } from "react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  color: string;
  glowColor: string;
  index: number;
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  features,
  color,
  glowColor,
  index,
}: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative p-8 rounded-2xl glass transition-all duration-300 cursor-pointer group h-full"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          boxShadow: isHovered
            ? `0 0 40px ${glowColor}20, 0 0 80px ${glowColor}10, inset 0 1px 0 ${glowColor}20`
            : "none",
          borderColor: isHovered ? `${glowColor}40` : "transparent",
          borderWidth: "1px",
        }}
      >
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${color}15, ${color}05)`,
            border: `1px solid ${color}30`,
            boxShadow: isHovered ? `0 0 20px ${color}30` : "none",
          }}
        >
          <Icon className="w-7 h-7" style={{ color }} />
        </div>

        {/* Title */}
        <h3 className="font-display text-xl font-bold mb-3 tracking-wide group-hover:text-white transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          {description}
        </p>

        {/* Features */}
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              {feature}
            </li>
          ))}
        </ul>

        {/* Hover gradient overlay */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${isHovered ? "50% 50%" : "0% 0%"}, ${color}08, transparent 40%)`,
          }}
        />
      </div>
    </motion.div>
  );
}
