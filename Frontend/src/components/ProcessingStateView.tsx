import { Loader2 } from 'lucide-react';

export const ProcessingStateView = () => (
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
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: '0.2s' }}
        ></div>
      </div>
    </div>
  </div>
);
