'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, CheckSquare, Sparkles, Thermometer } from 'lucide-react';

export function DecisionCard({ type, options, aiSuggestion, confidence, context, onChoose, loading = false }) {
  const isMeal = type === 'meal';
  const Icon = isMeal ? Utensils : CheckSquare;
  
  // Sort options to put AI suggestion first if exists
  const sortedOptions = aiSuggestion 
    ? [aiSuggestion, ...options.filter(o => o !== aiSuggestion)]
    : options;

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {isMeal ? 'What should I eat?' : 'What should I do?'}
          </CardTitle>
          {aiSuggestion && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Powered
            </Badge>
          )}
        </div>
        <CardDescription>
          {context?.weather && (
            <span className="flex items-center gap-1 mt-1">
              <Thermometer className="w-3 h-3" />
              {context.weather.temp}°C, {context.weather.description}
            </span>
          )}
          Confidence: {Math.round(confidence * 100)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedOptions.map((option, index) => (
            <Button
              key={option}
              variant={index === 0 && aiSuggestion ? "default" : "outline"}
              className="w-full justify-start text-left h-auto py-4 px-4"
              onClick={() => onChoose(option)}
              disabled={loading}
            >
              <span className="flex items-center gap-2">
                {index === 0 && aiSuggestion && (
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                )}
                <span className="font-medium">{option}</span>
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
