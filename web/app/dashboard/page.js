'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DecisionCard } from '@/components/DecisionCard';
import { FeedbackForm } from '@/components/FeedbackForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Cpu, RefreshCw, MapPin, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState('');
  const [decisionType, setDecisionType] = useState('meal');
  const [location, setLocation] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [chosenOption, setChosenOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedName = localStorage.getItem('name');
    
    if (!storedToken) {
      router.push('/signin');
      return;
    }
    
    setToken(storedToken);
    setUserName(storedName || 'User');
  }, [router]);

  const getRecommendation = async () => {
    if (!token) return;
    
    setLoading(true);
    setError('');
    setRecommendation(null);
    setChosenOption(null);

    try {
      const params = new URLSearchParams({ type: decisionType });
      if (location) params.append('location', location);

      const response = await fetch(`/api/decisions/recommend?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to get recommendation');
      }

      setRecommendation(result.data);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Unauthorized')) {
        localStorage.clear();
        router.push('/signin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChoose = (option) => {
    setChosenOption(option);
  };

  const handleFeedback = async ({ rating }) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          decisionId: recommendation.decisionId,
          chosenOption: chosenOption,
          rating: rating
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit feedback');
      }

      // Reset for next decision
      setRecommendation(null);
      setChosenOption(null);
      
      // Show success message briefly
      alert('Thanks for your feedback! Your preferences have been updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Cpu className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {userName}! 
            <Sparkles className="inline-block w-5 h-5 ml-2 text-yellow-500" />
          </h1>
          <p className="text-muted-foreground">
            Let&apos;s help you make today&apos;s decisions
          </p>
        </div>

        {/* Configuration */}
        {!recommendation && !chosenOption && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>What do you need help with?</Label>
                <Select value={decisionType} onValueChange={setDecisionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meal">What should I eat?</SelectItem>
                    <SelectItem value="task">What should I do?</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location (for weather-based suggestions)
                </Label>
                <Input
                  placeholder="e.g., New York, London, Tokyo"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <Button 
                onClick={getRecommendation} 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Cpu className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Thinking...' : 'Get Recommendation'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        {/* Recommendation */}
        {recommendation && !chosenOption && (
          <DecisionCard
            type={recommendation.type}
            options={recommendation.options}
            aiSuggestion={recommendation.aiSuggestion}
            confidence={recommendation.confidence}
            context={recommendation.context}
            onChoose={handleChoose}
            loading={loading}
          />
        )}

        {/* Feedback */}
        {chosenOption && (
          <FeedbackForm
            chosenOption={chosenOption}
            onSubmit={handleFeedback}
            loading={loading}
          />
        )}

        {/* Tips */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>
            <Badge variant="outline">Tip</Badge>
            {' '}The more feedback you give, the better our recommendations become!
          </p>
          <p>
            Your API key is encrypted and only used for AI suggestions.
          </p>
        </div>
      </div>
    </div>
  );
}
