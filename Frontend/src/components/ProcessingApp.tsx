import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Sparkles, CheckCircle } from 'lucide-react';

type ProcessingState = 'input' | 'processing' | 'complete';

export const ProcessingApp = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [state, setState] = useState<ProcessingState>('input');

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setState('processing');
    setOutput('');

    try {
      const response = await fetch('http://localhost:8000/full_pipeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();

      // Format output nicely (stringify if it's an object)
      const formattedOutput =
        typeof data.final_answer === 'string'
          ? data.final_answer
          : JSON.stringify(data.final_answer, null, 2);

      setOutput(formattedOutput);
      setState('complete');
    } catch (error: any) {
      setOutput(`Error: ${error.message || 'Something went wrong'}`);
      setState('complete');
    }
  };

  const handleReset = () => {
    setState('input');
    setInput('');
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            AI Processing Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Transform your input with intelligent processing
          </p>
        </div>

        <Card className="bg-gradient-card border-0 shadow-elegant backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              Smart Processor
            </CardTitle>
            <CardDescription>
              Enter your text and let our AI work its magic
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {state === 'input' && (
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
            )}

            {state === 'processing' && (
              <div className="text-center py-12 animate-fade-in">
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto">
                    <Loader2 className="w-16 h-16 text-primary animate-spin-glow" />
                  </div>
                  <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-primary/20 rounded-full animate-pulse-glow"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Processing Your Request</h3>
                <p className="text-muted-foreground">Please wait while we analyze and process your input...</p>
                <div className="flex justify-center mt-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {state === 'complete' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-center text-green-600 mb-4">
                  <CheckCircle className="h-8 w-8 mr-2" />
                  <span className="text-lg font-semibold">Processing Complete!</span>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Processed Output
                  </label>
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
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground animate-fade-in">
          Powered by advanced AI processing technology
        </div>
      </div>
    </div>
  );
};
