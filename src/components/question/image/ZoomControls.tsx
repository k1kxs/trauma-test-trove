import { Button } from "@/components/ui/button";
import { ZoomIn, RotateCcw, X } from "lucide-react";

interface ZoomControlsProps {
  isMobile: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onClose: () => void;
}

const ZoomControls = ({ 
  isMobile, 
  onZoomIn, 
  onZoomOut,
  onReset,
  onClose 
}: ZoomControlsProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomIn}
        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white shadow-lg hover:shadow-xl border-none w-12 h-12"
      >
        <ZoomIn className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomOut}
        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white shadow-lg hover:shadow-xl border-none w-12 h-12"
      >
        <ZoomIn className="h-6 w-6 rotate-180" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onReset}
        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white shadow-lg hover:shadow-xl border-none w-12 h-12"
      >
        <RotateCcw className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white shadow-lg hover:shadow-xl border-none w-12 h-12"
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ZoomControls;