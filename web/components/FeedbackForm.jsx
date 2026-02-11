'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ThumbsUp, Star } from 'lucide-react';

export function FeedbackForm({ chosenOption, onSubmit, loading = false }) {
  const [rating, setRating] = useState([3]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      rating: rating[0]
    });
  };

  const getRatingLabel = (value) => {
    const labels = ['Terrible', 'Bad', 'Okay', 'Good', 'Great'];
    return labels[value - 1];
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ThumbsUp className="w-5 h-5" />
          How was it?
        </CardTitle>
        <CardDescription>
          Your feedback helps us learn your preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">You chose:</p>
            <p className="text-lg font-semibold">{chosenOption}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <Label>Rate your choice (1-5)</Label>
            </div>
            <Slider
              value={rating}
              onValueChange={setRating}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1</span>
              <span className="font-medium text-foreground">{getRatingLabel(rating[0])}</span>
              <span>5</span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
