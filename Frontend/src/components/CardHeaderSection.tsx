import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export const CardHeaderSection = () => (
  <CardHeader className="text-center pb-4">
    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
      <Sparkles className="h-6 w-6 text-primary" />
      Smart Processor
    </CardTitle>
    <CardDescription>
      Enter your text and let our AI work its magic
    </CardDescription>
  </CardHeader>
);
