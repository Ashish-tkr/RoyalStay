import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AnimatedLogo = () => {
  const englishText = "RoyalStay";
  const kannadaText = "ಸಿರಿನಿಲಯ";


  const [displayText, setDisplayText] = useState(englishText);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTypingKannada, setIsTypingKannada] = useState(false);
  const [index, setIndex] = useState(englishText.length);
  const [isAnimating, setIsAnimating] = useState(true);

  // Controls the typing/deleting animation
  useEffect(() => {
    if (!isAnimating) return;

    const timeout = setTimeout(() => {
      // Deleting English text
      if (isDeleting && !isTypingKannada) {
        if (index > 0) {
          setDisplayText(englishText.substring(0, index - 1));
          setIndex(index - 1);
        } else {
          setIsDeleting(false);
          setIsTypingKannada(true);
          setIndex(0);
        }
      }
      // Typing Kannada text
      else if (isTypingKannada) {
        if (index < kannadaText.length) {
          setDisplayText(kannadaText.substring(0, index + 1));
          setIndex(index + 1);
        } else {
          // Animation complete, wait and restart
          setTimeout(() => {
            setIsDeleting(true);
            setIsTypingKannada(false);
            setIndex(kannadaText.length);
            setDisplayText(kannadaText);
          }, 1000); // Wait 3 seconds before restarting
        }
      }
      // Initial state - start deleting after a delay
      else {
        setTimeout(() => {
          setIsDeleting(true);
        }, 1000); // Wait 1.5 seconds before starting to delete
      }
    }, isDeleting ? 100 : 150); // Deleting is slightly faster than typing

    return () => clearTimeout(timeout);
  }, [isDeleting, isTypingKannada, index, isAnimating]);

  // Restart animation when hovering over the logo
  const handleMouseEnter = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsDeleting(true);
      setIsTypingKannada(false);
      setIndex(englishText.length);
      setDisplayText(englishText);
    }
  };

  return (
    <Link to="/">
      <h1
        className="text-2xl font-bold gradient-text cursor-pointer relative"
        onMouseEnter={handleMouseEnter}
      >
        {displayText}
        <span className={`absolute right-0 top-0 h-full w-1 bg-royal-400 ${isAnimating ? 'animate-blink' : 'opacity-0'}`}></span>
      </h1>
    </Link>
  );
};

export default AnimatedLogo; 