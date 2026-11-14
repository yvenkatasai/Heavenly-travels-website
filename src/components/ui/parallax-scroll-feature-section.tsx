'use client';

// Adapted from the owner-supplied parallax-scroll-feature-section.tsx.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ScrollFeature = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  eyebrow?: string;
  reverse?: boolean;
  imageAlt: string;
  children?: ReactNode;
};

export function useDecorativeMotion() {
  const reduced = useReducedMotion();
  const isPaused = () =>
    document.documentElement.classList.contains('motion-paused') ||
    window.heavenlyMotionAllowed?.() === false;
  const [paused, setPaused] = useState(isPaused);
  useEffect(() => {
    const changed = () => setPaused(isPaused());
    window.addEventListener('motionchange', changed);
    return () => window.removeEventListener('motionchange', changed);
  }, []);
  return !reduced && !paused;
}

function ScrollSection({ section }: { section: ScrollFeature }) {
  const ref = useRef<HTMLElement>(null),
    allowed = useDecorativeMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.7],
    ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
  );
  const y = useTransform(scrollYProgress, [0, 1], [-50, 0]);
  const paragraphY = useTransform(scrollYProgress, [0, 1], [-14, 0]);
  return (
    <section
      ref={ref}
      className={cn('flow-scroll-section tw:relative', section.reverse && 'flow-scroll-reverse')}
      aria-labelledby={'feature-' + section.id}
    >
      <motion.div className="flow-scroll-copy" style={{ y: allowed ? y : 0 }}>
        {section.eyebrow && <p className="flow-eyebrow">{section.eyebrow}</p>}
        <h3 id={'feature-' + section.id}>{section.title}</h3>
        <motion.p className="flow-scroll-description" style={{ y: allowed ? paragraphY : 0 }}>
          {section.description}
        </motion.p>
        {section.children}
      </motion.div>
      <motion.figure
        className="flow-scroll-image"
        style={{ opacity: allowed ? opacity : 1, clipPath: allowed ? clipPath : 'inset(0 0% 0 0)' }}
      >
        <img
          src={section.imageUrl}
          alt={section.imageAlt}
          loading="lazy"
          width="800"
          height="900"
        />
      </motion.figure>
    </section>
  );
}

export function ParallaxScrollFeatureSection({
  sections,
  className,
}: {
  sections: ScrollFeature[];
  className?: string;
}) {
  return (
    <div className={cn('flow-scroll-features', className)}>
      {sections.map((section) => (
        <ScrollSection key={section.id} section={section} />
      ))}
    </div>
  );
}

export function ScrollCue({ children = 'Scroll to explore' }: { children?: ReactNode }) {
  return (
    <p className="flow-scroll-cue tw:flex tw:items-center tw:gap-2">
      {children}
      <ArrowDown size={14} aria-hidden="true" />
    </p>
  );
}

// Keeps the original attachment's exported component name available.
export const Component = ParallaxScrollFeatureSection;
