import { useState } from 'react';
import {
  Github,
  Linkedin,
  Menu,
  X,
  Info,
  Mail,
  PanelLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AnimatedLogo } from './AnimatedLogo';

interface HeaderProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

export function Header({ onMenuClick, sidebarOpen = true }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-[var(--theme-border)] bg-[var(--theme-surface)]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="w-full px-3 sm:px-4">
        <div className="flex items-center justify-between h-14">
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className={`rounded-lg ${sidebarOpen
                  ? 'bg-[var(--theme-accent)]/10 text-[var(--theme-accent)]'
                  : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-bg)]'
                }`}
            >
              <PanelLeft className="w-5 h-5" />
            </Button>
            <AnimatedLogo />
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-1">
            {/* About */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Info className="w-4 h-4 mr-2" />
                  About
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>About PadNote</DialogTitle>
                  <DialogDescription>
                    A clean, minimalist notepad for your daily writing needs.
                  </DialogDescription>
                </DialogHeader>
                <ul className="mt-4 list-disc list-inside text-sm text-[var(--theme-text-secondary)] space-y-1">
                  <li>Rich text formatting</li>
                  <li>Multiple themes</li>
                  <li>Auto-save</li>
                  <li>Word & character count</li>
                  <li>Image support</li>
                  <li>TXT export</li>
                </ul>
              </DialogContent>
            </Dialog>

            {/* Contact */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Get in Touch</DialogTitle>
                  <DialogDescription>
                    Connect with me
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 pt-4">
                  <a
                    href="https://www.linkedin.com/in/anuj-shandilya-290b4025a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-[var(--theme-bg)]"
                  >
                    <Linkedin className="w-4 h-4 text-[#0077b5]" />
                    LinkedIn
                  </a>

                  <a
                    href="https://github.com/anuj-shandilya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-[var(--theme-bg)]"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>

                  <button
                    onClick={() =>
                    (window.location.href =
                      'mailto:anujshandilya3@gmail.com')
                    }
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-left hover:bg-[var(--theme-bg)]"
                  >
                    <Mail className="w-4 h-4 text-[#EA4335]" />
                    anujshandilya3@gmail.com
                  </button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="w-px h-6 bg-[var(--theme-border)] mx-2" />

            {/* Social icons */}
            <a
              href="https://www.linkedin.com/in/anuj-shandilya-290b4025a/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-[var(--theme-bg)]"
            >
              <Linkedin className="w-5 h-5 text-[#0077b5]" />
            </a>
            <a
              href="https://github.com/anuj-shandilya"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-[var(--theme-bg)]"
            >
              <Github className="w-5 h-5" />
            </a>
          </nav>

          {/* MOBILE BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--theme-border)]">
            <nav className="flex flex-col gap-2">
              <a
                href="https://www.linkedin.com/in/anuj-shandilya-290b4025a/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg hover:bg-[var(--theme-bg)]"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/anuj-shandilya"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg hover:bg-[var(--theme-bg)]"
              >
                GitHub
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
