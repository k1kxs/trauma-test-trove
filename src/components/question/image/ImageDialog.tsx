import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { motion } from "framer-motion";
import ZoomControls from "./ZoomControls";

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  isMobile: boolean;
}

const ImageDialog = ({ 
  isOpen, 
  onClose, 
  image, 
  isMobile 
}: ImageDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`max-w-[95vw] w-auto ${isMobile ? 'h-[85vh]' : 'h-[95vh]'} p-0 overflow-hidden border-none bg-transparent`}
        hideCloseButton={true}
      >
        <DialogTitle className="sr-only">Просмотр изображения</DialogTitle>
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={4}
          centerOnInit={true}
          limitToBounds={true}
          wheel={{ wheelDisabled: isMobile }}
          pinch={{ disabled: false }}
          doubleClick={{ disabled: true }}
          panning={{ 
            velocityDisabled: true,
            lockAxisY: false,
            excluded: ['button', 'a']
          }}
          alignmentAnimation={{ disabled: true }}
          centerZoomedOut={true}
        >
          {({ zoomIn, zoomOut }) => (
            <>
              <ZoomControls
                isMobile={isMobile}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onClose={onClose}
              />
              <TransformComponent
                wrapperClass={`w-[95vw] ${isMobile ? 'h-[85vh]' : 'h-[95vh]'} flex items-center justify-center`}
                contentClass="w-full h-full flex items-center justify-center"
              >
                <motion.img
                  key={image}
                  src={image}
                  alt="Question image"
                  className="max-w-[95vw] max-h-[85vh] w-auto h-auto object-contain select-none"
                  draggable={false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;