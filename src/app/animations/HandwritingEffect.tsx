'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';

interface HandwritingEffectProps {
  text: string;
  className?: string;
  durationPerChar?: number;
  onComplete?: () => void;
}

export default function HandwritingEffect({
  text,
  className = '',
  durationPerChar = 0.05,
  onComplete,
}: HandwritingEffectProps) {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, { types: 'chars' });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        onComplete?.(); // ✅ notify parent ONLY when fully done
      },
    });

    tl.from(split.chars, {
      opacity: 0,
      y: 14,
      stagger: durationPerChar,
      duration: 0.6,
    });

    return () => {
      split.revert();
      tl.kill();
    };
  }, [text, durationPerChar, onComplete]);

  return (
    <p ref={textRef} className={className}>
      {text}
    </p>
  );
}
