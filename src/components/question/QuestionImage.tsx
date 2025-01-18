import { useState, useEffect } from "react";
import { ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomOut, RotateCcw, X } from "lucide-react";

interface QuestionImageProps {
  image: string;
  currentQuestion: number;
  totalQuestions: number;
}

const QuestionImage = ({ image, currentQuestion, totalQuestions }: QuestionImageProps) => {
  const [isImageOpen, setIsImageOpen] = useState(false);

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
              duration: 0.3,
              ease: "easeInOut"
            }}
          />
        </AnimatePresence>
      </div>

      <Dialog open={isImageOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-[95vw] h-auto p-0 overflow-hidden bg-black/95 border-none">
          <DialogTitle className="sr-only">Просмотр изображения</DialogTitle>
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit={true}
            limitToBounds={false}
            wheel={{ wheelDisabled: false }}
            pinch={{ disabled: false }}
            doubleClick={{ disabled: true }}
            panning={{ velocityDisabled: true }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="absolute right-4 top-4 z-50 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => zoomIn()}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                  >
                    <ZoomIn className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => zoomOut()}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                  >
                    <ZoomOut className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => resetTransform()}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                  >
                    <RotateCcw className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDialogClose}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                  >
                    <X className="h-4 w-4 text-white" />
                  </Button>
                </div>
                <TransformComponent
                  wrapperClass="!w-auto !h-auto max-h-[90vh] cursor-grab active:cursor-grabbing"
                  contentClass="!w-auto !h-auto flex items-center justify-center"
                >
                  <motion.img
                    key={image}
                    src={image}
                    alt="Question image"
                    className="max-w-[90vw] max-h-[85vh] w-auto h-auto select-none"
                    draggable={false}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
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