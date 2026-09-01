import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

/**
 * Collects free-form instructions that are forwarded to the AI endpoint as
 * additional context, so generation can be steered from the UI.
 */
const AiPromptDialog = ({
  open,
  onClose,
  onGenerate,
  title = "Generate with AI",
  description = "Add optional instructions to steer the result. Leave blank to use your saved details only.",
  placeholder = "e.g. Target a senior backend role, emphasise Spring Boot and Kafka, keep it under 60 words.",
  fields = null,
  generateLabel = "Generate",
}) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate(prompt.trim());
      setPrompt("");
      onClose();
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : error?.message || "AI generation failed",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-600" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {fields}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">
              Additional instructions for the AI
            </Label>
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={4}
              placeholder={placeholder}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? "Generating..." : generateLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiPromptDialog;
