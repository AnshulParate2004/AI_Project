import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface InputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: () => void;
}

export const InputSection = ({ input, setInput, handleSubmit }: InputProps) => (
  <div className="space-y-4 animate-fade-in">
    <div>
      <label htmlFor="input" className="block text-sm font-medium mb-2">
        Your Input
      </label>
      <Textarea
        id="input"
        placeholder="Enter your text here to process..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[120px] border-border/50 focus:border-primary/50 focus:ring-primary/20"
      />
    </div>
    <Button
      onClick={handleSubmit}
      disabled={!input.trim()}
      className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-primary-foreground"
      size="lg"
    >
      <Send className="mr-2 h-4 w-4" />
      Process Input
    </Button>
  </div>
);
