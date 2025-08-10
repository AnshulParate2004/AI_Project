import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface CompleteProps {
  output: any; // can be string or object
  handleReset: () => void;
}

export const CompleteSection = ({ output, handleReset }: CompleteProps) => {
  let parsed: any = null;

  if (typeof output === "string") {
    try {
      parsed = JSON.parse(output);
    } catch {
      parsed = null; // Parsing failed
    }
  } else if (typeof output === "object" && output !== null) {
    parsed = output;
  }

  const stages = ["original", "abstract", "detailed"] as const;
  const [activeStage, setActiveStage] = useState<typeof stages[number]>("original");

  const stageData = parsed?.[activeStage];

  const extractFinalAnswer = (str: string) => {
    if (!str) return "";
    const match = str.match(/"final_answer":\s*"([^"]+)"/);
    return match ? match[1] : str;
  };

  const displayAnswer = stageData ? extractFinalAnswer(stageData.optimized_final) : "";

  // If API fails or parsed data is empty
  const isApiError = !parsed || !stageData;

  return (
    <div className="space-y-4 animate-fade-in">
      {!isApiError ? (
        <>
          <div className="flex items-center justify-center text-green-600 mb-4">
            <CheckCircle className="h-8 w-8 mr-2" />
            <span className="text-lg font-semibold">Processing Complete!</span>
          </div>

          {/* Stage Switch */}
          <div className="flex gap-2 justify-center">
            {stages.map((stage) => (
              <Button
                key={stage}
                variant={activeStage === stage ? "default" : "outline"}
                onClick={() => setActiveStage(stage)}
              >
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </Button>
            ))}
          </div>

          {/* Question + Answer */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {activeStage.charAt(0).toUpperCase() + activeStage.slice(1)} Output
            </label>
            <div className="bg-accent/30 border border-accent rounded-lg p-4 space-y-3 min-h-[120px]">
              <div>
                <strong>Question:</strong>
                <p className="text-accent-foreground whitespace-pre-wrap">
                  {stageData.question}
                </p>
              </div>
              <div>
                <strong>Answer:</strong>
                <p className="text-accent-foreground whitespace-pre-wrap">
                  {displayAnswer}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center text-red-500 space-y-3">
          <XCircle className="h-10 w-10" />
          <p className="text-lg font-semibold">Error 404 - API Not Found</p>
          <p className="text-sm">The requested data could not be retrieved. Please try again.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleReset} variant="outline" className="flex-1">
          Process New Input
        </Button>
        {!isApiError && (
          <Button
            onClick={() =>
              navigator.clipboard.writeText(`${stageData?.question}\n\n${displayAnswer}`)
            }
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            Copy Result
          </Button>
        )}
      </div>
    </div>
  );
};
