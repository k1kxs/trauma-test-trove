import { Button } from "@/components/ui/button";
import { ZoomIn, X } from "lucide-react";

interface ZoomControlsProps {
  isMobile: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onClose: () => void;
}

const ZoomControls = ({ 
  isMobile, 
  onZoomIn, 
  onZoomOut, 
  onClose 
}: ZoomControlsProps) => {
  return (
    <div className={`${isMobile ? 'bottom-8 left-1/2 -translate-x-1/2' : 'right-4 top-4'} fixed z-50 flex gap-2`}>
      {isMobile && (
        <>
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
        </>
      )}
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