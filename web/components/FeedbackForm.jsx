'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ThumbsUp, Star } from 'lucide-react';

export function FeedbackForm({ chosenOption, onSubmit, loading = false }) {
  const [rating, setRating] = useState([3]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating: rating[0] });
  };

  const getRatingLabel = (value) => {
    const labels = ['Terrible', 'Bad', 'Okay', 'Good', 'Great'];
    return labels[value - 1];
  };

  return (
    <div className="w-full space-y-5">
      <h3 className="flex items-center gap-2 text-base font-semibold">
        <ThumbsUp className="w-5 h-5 text-primary" />
        How was this choice?
      </h3>
      <p className="text-xs text-muted-foreground">
        Your feedback helps us learn your preferences
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="p-4 bg-muted/50 rounded-xl">
          <p className="text-xs text-muted-foreground">You chose:</p>
          <p className="text-sm font-semibold mt-1">{chosenOption}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <Label className="text-sm">Rate your choice</Label>
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
    </div>
  );
}
