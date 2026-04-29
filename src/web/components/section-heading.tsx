import { motion } from "motion/react";

interface SectionHeadingProps {
  tag: string;
  title: string;
  description?: string;
}

export default function SectionHeading({ tag, title, description }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="text-center mb-16"
    >
      <span className="inline-block px-4 py-1.5 rounded-full border border-neon-red/30 text-neon-red text-xs font-display uppercase tracking-[0.2em] mb-4">
        {tag}
      </span>
      <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
