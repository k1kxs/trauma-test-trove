import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import ImagePreview from "./image/ImagePreview";
import ImageDialog from "./image/ImageDialog";

interface QuestionImageProps {
  image: string;
  currentQuestion: number;
  totalQuestions: number;
}

const QuestionImage = ({ 
  image, 
  currentQuestion, 
  totalQuestions 
}: QuestionImageProps) => {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleImageClick = () => setIsImageOpen(true);
  const handleDialogClose = () => setIsImageOpen(false);

  return (
    <>
      <ImagePreview
        image={image}
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        onImageClick={handleImageClick}
      />

      <ImageDialog
        isOpen={isImageOpen}
        onClose={handleDialogClose}
        image={image}
        isMobile={isMobile}
      />
    </>
  );
};

export default QuestionImage;