import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

const TextToSpeech = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Text to Speech</h1>
          <p className="text-muted-foreground mt-2">
            Convert legal documents to audio
          </p>
        </div>

        <div className="grid gap-4">
          {/* Text to speech components will be added here */}
        </div>
      </div>
    </MainLayout>
  );
};

export default TextToSpeech;
