import { useEffect, useState, useRef } from 'react';
import { FileText } from 'lucide-react';
import { gsap } from 'gsap';

export function AnimatedLogo() {
  const [displayText, setDisplayText] = useState('PadNote');
  const textRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const originalText = 'PadNote';
    const shuffleText = 'NotePad';
    
    const scramble = (targetText: string, duration: number = 800) => {
      return new Promise<void>((resolve) => {
        const startTime = Date.now();
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          let result = '';
          for (let i = 0; i < targetText.length; i++) {
            if (progress > i / targetText.length) {
              result += targetText[i];
            } else {
              result += chars[Math.floor(Math.random() * chars.length)];
            }
          }
          setDisplayText(result);
          
          if (progress >= 1) {
            clearInterval(interval);
            setDisplayText(targetText);
            resolve();
          }
        }, 30);
      });
    };

    // Animation sequence: PadNote -> NotePad -> PadNote
    const runAnimation = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Initial delay
      await scramble(shuffleText, 600); // To NotePad
      await new Promise(resolve => setTimeout(resolve, 400)); // Pause
      await scramble(originalText, 600); // Back to PadNote
      
      // Final subtle pulse
      if (textRef.current) {
        gsap.to(textRef.current, {
          scale: 1.02,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        });
      }
    };

    runAnimation();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--theme-accent)] to-[var(--theme-accent-hover)] flex items-center justify-center">
        <FileText className="w-4 h-4 text-white" />
      </div>
      <span 
        ref={textRef}
        className="font-semibold text-lg hidden sm:block tracking-tight"
        style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--theme-text)' }}
      >
        {displayText}
      </span>
    </div>
  );
}
