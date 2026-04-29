import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "motion/react";

interface StatProps {
  value: number;
  suffix: string;
  label: string;
  color: string;
}

function AnimatedStat({ value, suffix, label, color }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl font-bold mb-2" style={{ color }}>
        {count}
        {suffix}
      </div>
      <div className="text-muted-foreground text-sm uppercase tracking-wider font-display">
        {label}
      </div>
    </div>
  );
}

const stats = [
  { value: 60, suffix: "+", label: "Projects Delivered", color: "#EC1C24" },
  { value: 98, suffix: "%", label: "Client Satisfaction", color: "#EC1C24" },
  { value: 7, suffix: "+", label: "Years Experience", color: "#EC1C24" },
];

export default function StatsCounter() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-3 gap-8 py-16 px-6 glass rounded-2xl neon-border"
    >
      {stats.map((stat) => (
        <AnimatedStat key={stat.label} {...stat} />
      ))}
    </motion.div>
  );
}
