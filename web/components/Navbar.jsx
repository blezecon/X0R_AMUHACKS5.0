'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Brain, Menu, X, User, LogOut } from 'lucide-react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [auth, setAuth] = useState({ isLoggedIn: false, userName: '' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer state updates to next tick to avoid cascading renders
    const timer = setTimeout(() => {
      // Mark as mounted
      setMounted(true);
      
      // Check auth state
      const checkAuth = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const name = typeof window !== 'undefined' ? localStorage.getItem('name') : null;
        setAuth({ isLoggedIn: !!token, userName: name || 'User' });
      };
      
      checkAuth();
      
      // Listen for storage changes (for multi-tab sync)
      const handleStorageChange = () => {
        checkAuth();
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      // Custom event for same-tab updates
      window.addEventListener('auth-change', handleStorageChange);
      
      // Cleanup function
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('auth-change', handleStorageChange);
      };
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setAuth({ isLoggedIn: false, userName: '' });
    window.location.href = '/';
  };

  // Prevent hydration mismatch by rendering a simpler version initially
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Decision Fatigue Reducer</span>
            </Link>
            {/* Skeleton loader for auth buttons */}
            <div className="hidden md:flex items-center gap-3">
              <div className="h-9 w-20 bg-muted rounded animate-pulse" />
              <div className="h-9 w-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Decision Fatigue Reducer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            
            {auth.isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link href="/decide">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {auth.userName}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/features" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/about" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {auth.isLoggedIn ? (
                <>
                  <Link 
                    href="/decide" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="gap-2 justify-start"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-2">
                  <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
