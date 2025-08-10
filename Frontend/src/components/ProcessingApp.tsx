import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InputSection } from './InputSection';
import { ProcessingStateView } from './ProcessingStateView';
import { CompleteSection } from './CompleteSection';
import { HeaderSection } from './HeaderSection';
import { CardHeaderSection } from './CardHeaderSection';

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);

      const data = await response.json();
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
        {/* Top page heading */}
        <HeaderSection />

        {/* Main card */}
        <Card className="bg-gradient-card border-0 shadow-elegant backdrop-blur-sm animate-scale-in">
          <CardHeaderSection />

          <CardContent className="space-y-6">
            {state === 'input' && (
              <InputSection input={input} setInput={setInput} handleSubmit={handleSubmit} />
            )}
            {state === 'processing' && <ProcessingStateView />}
            {state === 'complete' && (
              <CompleteSection output={output} handleReset={handleReset} />
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground animate-fade-in">
          Powered by advanced AI processing technology
        </div>
      </div>
    </div>
  );
};
