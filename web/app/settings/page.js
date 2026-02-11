import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Shield, Sparkles, CheckCircle2, Settings } from 'lucide-react';

const sections = [
  {
    title: 'Preferences',
    description: 'Fine-tune meal, task, and productivity settings so recommendations stay aligned with your life.',
    icon: Shield,
    actions: [
      { label: 'Manage Meals', href: '/decide?focus=meal' },
      { label: 'Tweak Tasks', href: '/decide?focus=task' }
    ]
  },
  {
    title: 'AI Providers',
    description: 'Add or update API keys so the AI engines you trust have access to your data.',
    icon: Sparkles,
    actions: [
      { label: 'Connect OpenRouter', href: '/settings/providers?provider=openrouter' },
      { label: 'Connect Anthropic', href: '/settings/providers?provider=anthropic' }
    ]
  },
  {
    title: 'Security',
    description: 'Update your password, toggle OTP, and review login activity.',
    icon: CheckCircle2,
    actions: [
      { label: 'Change Password', href: '/settings/security' },
      { label: 'Manage OTP', href: '/settings/security#otp' }
    ]
  }
];

export default function SettingsPage() {
  const initials = 'DR';

  return (
    <main className="flex-1 bg-background/80">
      <section className="relative overflow-hidden pt-16 pb-10">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Account</p>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground">Keep your preferences in sync with your routine.</p>
              </div>
            </div>
            <Link href="/decide" className="w-max">
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((section) => (
              <Card key={section.title} className="bg-gradient-to-br from-background to-background/40 border border-border">
                <CardContent>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                    <section.icon className="h-4 w-4" />
                    {section.title}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold leading-tight">{section.title}</h2>
                  <p className="mt-2 text-muted-foreground">{section.description}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {section.actions.map((action) => (
                      <Link
                        key={action.label}
                        href={action.href}
                        className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/70"
                      >
                        <span className="text-xs uppercase tracking-[0.5em] text-primary/60">›</span>
                        {action.label}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/10 to-transparent" />
      </section>
    </main>
  );
}
