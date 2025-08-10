import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface CompleteProps {
  output: string;
  handleReset: () => void;
}

export const CompleteSection = ({ output, handleReset }: CompleteProps) => (
  <div className="space-y-4 animate-fade-in">
    <div className="flex items-center justify-center text-green-600 mb-4">
      <CheckCircle className="h-8 w-8 mr-2" />
      <span className="text-lg font-semibold">Processing Complete!</span>
    </div>
    <div>
      <label className="block text-sm font-medium mb-2">Processed Output</label>
      <div className="bg-accent/30 border border-accent rounded-lg p-4 min-h-[120px]">
        <pre className="text-accent-foreground whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
    <div className="flex gap-3">
      <Button onClick={handleReset} variant="outline" className="flex-1">
        Process New Input
      </Button>
      <Button
        onClick={() => navigator.clipboard.writeText(output)}
        className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
      >
        Copy Result
      </Button>
    </div>
  </div>
);
