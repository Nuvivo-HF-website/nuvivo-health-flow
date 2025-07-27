import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain,
  Stethoscope,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

interface ModeToggleProps {
  isSimpleMode: boolean;
  onModeChange: (simple: boolean) => void;
}

export default function ModeToggle({ isSimpleMode, onModeChange }: ModeToggleProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isSimpleMode ? (
                <Stethoscope className="h-5 w-5 text-primary" />
              ) : (
                <Brain className="h-5 w-5 text-primary" />
              )}
              <span className="font-medium">
                {isSimpleMode ? "Simple Mode" : "Expert Mode"}
              </span>
              <Badge variant="secondary">
                {isSimpleMode ? "Appointments Only" : "Full Features"}
              </Badge>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onModeChange(!isSimpleMode)}
            className="flex items-center gap-2"
          >
            {isSimpleMode ? (
              <>
                <ToggleLeft className="h-4 w-4" />
                Switch to Expert
              </>
            ) : (
              <>
                <ToggleRight className="h-4 w-4" />
                Switch to Simple
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground">
          {isSimpleMode 
            ? "Calendar-focused view for quick appointment management"
            : "Full dashboard with earnings, test orders, and advanced features"
          }
        </div>
      </CardContent>
    </Card>
  );
}