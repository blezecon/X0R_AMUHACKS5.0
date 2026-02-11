'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Sparkles, Camera, ArrowRight } from 'lucide-react';

const PROVIDERS = [
  {
    value: 'openrouter',
    label: 'OpenRouter',
    description: 'Fast multi-model access with reliable throughput and usage insights.',
    accent: 'from-amber-400/30 to-amber-200/40'
  },
  {
    value: 'groq',
    label: 'Groq',
    description: 'Ultra-low latency inference tailored for complex reasoning flows.',
    accent: 'from-sky-400/30 to-sky-200/40'
  },
  {
    value: 'anthropic',
    label: 'Anthropic Claude',
    description: 'Safety-first assistant that keeps conversations grounded and helpful.',
    accent: 'from-indigo-400/30 to-indigo-200/40'
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [provider, setProvider] = useState('openrouter');
  const [apiKey, setApiKey] = useState('');
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!storedToken) {
      router.replace('/signin');
      return;
    }
    setToken(storedToken);
  }, [router]);

  const handlePhotoChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setProfilePhotoPreview('');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Profile photo must be 5 MB or smaller');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfilePhotoPreview(reader.result?.toString() ?? '');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = async ({ skip = false } = {}) => {
    if (!token) return;

    setError('');
    setStatus('loading');

    try {
      const payload = skip
        ? { skip: true }
        : {
            provider,
            apiKey: apiKey.trim() || undefined,
            profilePhoto: profilePhotoPreview || undefined
          };

      const response = await fetch('/api/auth/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Unable to save onboarding details');
      }

      window.dispatchEvent(new Event('auth-change'));
      setStatus('success');
      setTimeout(() => router.push('/decide'), 1200);
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <ShieldCheck className="h-10 w-10 text-primary animate-pulse" />
      </div>
    );
  }

  const headings = (
    <div className="space-y-3 text-center">
      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        Onboarding
      </div>
      <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
        Frame your AI workspace to match how you make choices
      </h1>
      <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
        Pick a provider, add an optional API key, and upload a profile photo so the dashboard feels
        unmistakably yours. You can tweak everything later from Settings.
      </p>
    </div>
  );

  const bodyStatus = {
    idle: 'Save & Continue',
    loading: 'Saving…',
    success: 'Saved!',
    error: 'Try again'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-muted/30 px-4 py-12 text-foreground">
      <div className="container mx-auto space-y-8">
        {headings}

        <Card className="overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-xl shadow-primary/20">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-3">
              {PROVIDERS.map((option) => {
                const isSelected = provider === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setProvider(option.value)}
                    className={`flex h-full flex-col justify-between rounded-2xl border p-4 text-left transition hover:border-primary/70 ${
                      isSelected
                        ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg'
                        : 'border-border/60 bg-background/70'
                    }`}
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Provider</p>
                      <h3 className="mt-2 text-lg font-semibold text-foreground">{option.label}</h3>
                      <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Badge variant="secondary" className="text-[11px]">
                        Selected
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                <span>Provider API Key (optional)</span>
                <span className="text-xs text-muted-foreground">Encrypted + per provider</span>
              </div>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                placeholder="sk-..."
                onChange={(event) => setApiKey(event.target.value)}
                className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                <span>Profile Photo</span>
                <span className="text-xs text-muted-foreground">5 MB max</span>
              </div>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="photo-upload"
                  className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-dashed border-border/60 bg-background/70 px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary"
                >
                  <span>Upload PNG/JPG</span>
                  <Camera className="h-5 w-5 text-primary" />
                </label>
                {profilePhotoPreview && (
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-border/60">
                    <img
                      src={profilePhotoPreview}
                      alt="Uploaded preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="sr-only"
              />
              <p className="text-xs text-muted-foreground">
                The photo is only visible inside your account and helps us personalize your dashboard.
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Button
                onClick={() => handleSubmit()}
                disabled={status === 'loading'}
                className="flex-1 justify-center gap-2 rounded-2xl border-none bg-gradient-to-r from-primary to-primary/70 text-sm font-semibold"
              >
                {status === 'loading' && <ArrowRight className="h-4 w-4 animate-spin" />}
                {bodyStatus[status]}
              </Button>
              <button
                type="button"
                onClick={() => handleSubmit({ skip: true })}
                className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground transition hover:text-foreground"
              >
                Skip for now
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
