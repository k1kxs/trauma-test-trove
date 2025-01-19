import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { motion } from "framer-motion";

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
}

const ImageDialog = ({ isOpen, onClose, image }: ImageDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] w-auto h-[95vh] p-0 overflow-hidden border-none bg-transparent backdrop-blur-md"
        hideCloseButton={true}
        onPointerDownOutside={onClose}
        onEscapeKeyDown={onClose}
      >
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={4}
          centerOnInit={true}
          limitToBounds={true}
          wheel={{ wheelDisabled: false }}
          pinch={{ disabled: true }}
          doubleClick={{ disabled: true }}
          panning={{ 
            velocityDisabled: true,
            lockAxisY: false,
            excluded: ['button', 'a']
          }}
          alignmentAnimation={{ disabled: true }}
          centerZoomedOut={true}
        >
          {({ resetTransform }) => (
            <>
              <div className="right-4 top-4 absolute z-50 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white border-none"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <TransformComponent
                wrapperClass="w-[95vw] h-[95vh] flex items-center justify-center"
                contentClass="w-full h-full flex items-center justify-center"
              >
                <motion.img
                  key={image}
                  src={image}
                  alt="Question image"
                  className="max-w-[95vw] max-h-[85vh] w-auto h-auto object-contain select-none"
                  draggable={false}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
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