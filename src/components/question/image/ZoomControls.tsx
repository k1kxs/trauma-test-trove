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
    <div className={`${isMobile ? 'bottom-4 left-1/2 -translate-x-1/2' : 'right-4 top-4'} absolute z-50 flex gap-2`}>
      {isMobile && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomIn}
            className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 hover:from-purple-600 hover:via-purple-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl border-none"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomOut}
            className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 hover:from-purple-600 hover:via-purple-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl border-none"
          >
            <ZoomIn className="h-4 w-4 rotate-180" />
          </Button>
        </>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 hover:from-purple-600 hover:via-purple-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl border-none"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ZoomControls;