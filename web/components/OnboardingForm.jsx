'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Key } from 'lucide-react';

export function OnboardingForm({ onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    email: '',
    openrouterKey: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      email: formData.email,
      apiKeys: {
        openrouter: formData.openrouterKey || undefined
      }
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Get Started
        </CardTitle>
        <CardDescription>
          Create your account to start reducing decision fatigue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="openrouterKey" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              OpenRouter API Key (Optional)
            </Label>
            <Input
              id="openrouterKey"
              type="password"
              placeholder="sk-or-v1-..."
              value={formData.openrouterKey}
              onChange={(e) => setFormData({ ...formData, openrouterKey: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Your API key is encrypted and stored securely. Without it, we use smart fallbacks.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Start Reducing Decisions'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
