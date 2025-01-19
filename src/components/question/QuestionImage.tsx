import { useState } from "react";
import { ZoomIn, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuestionImageProps {
  image: string;
  currentQuestion: number;
  totalQuestions: number;
}

const QuestionImage = ({ image, currentQuestion, totalQuestions }: QuestionImageProps) => {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleImageClick = () => setIsImageOpen(true);
  const handleDialogClose = () => setIsImageOpen(false);

  return (
    <>
      <div 
        className="relative aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-inner group cursor-zoom-in"
        onClick={handleImageClick}
      >
        <div className="absolute top-3 right-3 bg-black/40 text-white px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-[2px]">
          {currentQuestion + 1}/{totalQuestions}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity">
          <ZoomIn className="w-8 h-8 text-gray-700" />
        </div>
        <AnimatePresence mode="wait">
          <motion.img
            key={image}
            src={image}
            alt="Question image"
            className="w-full h-full object-contain transition-transform group-hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.15,
              ease: "easeInOut"
            }}
          />
        </AnimatePresence>
      </div>

      <Dialog open={isImageOpen} onOpenChange={handleDialogClose}>
        <DialogContent 
          className="max-w-[95vw] w-auto h-[95vh] p-0 overflow-hidden border-none bg-transparent backdrop-blur-md"
          hideCloseButton={true}
        >
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit={true}
            limitToBounds={true}
            wheel={{ wheelDisabled: false }}
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
            {({ resetTransform }) => (
              <>
                <div className="right-4 top-4 absolute z-50 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDialogClose}
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
    </>
  );
};

export default QuestionImage;