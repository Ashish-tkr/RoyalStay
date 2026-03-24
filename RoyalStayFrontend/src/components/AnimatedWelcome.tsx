import { useState, useEffect } from 'react';

const AnimatedWelcome = () => {
  const englishText = "Sirinilaya";
  const kannadaText = "ಸಿರಿನಿಲಯ";
  
  const [displayText, setDisplayText] = useState(englishText);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTypingKannada, setIsTypingKannada] = useState(false);
  const [index, setIndex] = useState(englishText.length);
  const [isPaused, setIsPaused] = useState(true); // Start with a pause
  
  // Controls the typing/deleting animation
  useEffect(() => {
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
      }, 3000); // Pause for 3 seconds before starting animation to ensure text is fully visible
      
      return () => clearTimeout(pauseTimeout);
    }
    
    const timeout = setTimeout(() => {
      // Deleting text
      if (isDeleting) {
        if (index > 0) {
          setDisplayText(isTypingKannada ? kannadaText.substring(0, index - 1) : englishText.substring(0, index - 1));
          setIndex(index - 1);
        } else {
          setIsDeleting(false);
          setIsTypingKannada(!isTypingKannada); // Toggle between English and Kannada
          setIndex(0);
        }
      } 
      // Typing text
      else {
        const currentText = isTypingKannada ? kannadaText : englishText;
        
        if (index < currentText.length) {
          setDisplayText(currentText.substring(0, index + 1));
          setIndex(index + 1);
        } else {
          // Finished typing, pause before deleting to ensure full text is visible
          setIsPaused(true);
          
          const pauseTimeout = setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, 3000); // Wait 3 seconds before deleting
          
          return () => clearTimeout(pauseTimeout);
        }
      }
    }, isDeleting ? 150 : 200); // Slower typing/deleting for better readability
    
    return () => clearTimeout(timeout);
  }, [isDeleting, isTypingKannada, index, isPaused]);

  return (
    <span className="gradient-text relative">
      {displayText}
      <span className={`absolute right-0 top-1/2 transform -translate-y-1/2 h-[60%] w-1 bg-royal-400 ${isPaused ? 'animate-blink' : 'animate-blink-fast'}`}></span>
    </span>
  );
};

export default AnimatedWelcome; 