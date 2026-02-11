'use client';

import { CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, CheckSquare, Sparkles, Thermometer, Shirt } from 'lucide-react';

const PROVIDER_LABELS = {
  openrouter: 'GPT-3.5',
  groq: 'LLaMA 3',
  anthropic: 'Claude',
  fallback: 'Fallback'
};

export function DecisionCard({ type, options, aiSuggestion, confidence, context, providerUsed, onChoose, loading = false }) {
  const isMeal = type === 'meal';
  const isClothing = type === 'clothing';
  const Icon = isMeal ? Utensils : isClothing ? Shirt : CheckSquare;
  
  const sortedOptions = aiSuggestion 
    ? [aiSuggestion, ...options.filter(o => o !== aiSuggestion)]
    : options;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <Icon className="w-5 h-5 text-primary" />
          {isMeal ? 'What should I eat?' : isClothing ? 'What should I wear?' : 'What should I do?'}
        </h3>
        <div className="flex items-center gap-2">
          {providerUsed && providerUsed !== 'fallback' && (
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
              {PROVIDER_LABELS[providerUsed] || providerUsed}
            </Badge>
          )}
          {aiSuggestion && (
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <Sparkles className="w-3 h-3" />
              AI
            </Badge>
          )}
        </div>
      </div>

      <CardDescription className="flex items-center gap-3 text-xs">
        {context?.weather && (
          <span className="flex items-center gap-1">
            <Thermometer className="w-3 h-3" />
            {context.weather.temp}&deg;C, {context.weather.description}
          </span>
        )}
        <span>Confidence: {Math.round(confidence * 100)}%</span>
      </CardDescription>

      <div className="space-y-2">
        {sortedOptions.map((option, index) => (
          <Button
            key={option}
            variant={index === 0 && aiSuggestion ? "default" : "outline"}
            className="w-full justify-start text-left h-auto py-3 px-4"
            onClick={() => onChoose(option)}
            disabled={loading}
          >
            <span className="flex items-center gap-2">
              {index === 0 && aiSuggestion && (
                <Sparkles className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              )}
              <span className="font-medium">{option}</span>
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
