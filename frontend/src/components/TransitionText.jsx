import { useState, useEffect } from "react";

export default function TransitionText({ text, as: Component = "span", className = "", id = "" }) {
  const [displayText, setDisplayText] = useState(text);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Quando o texto mudar, inicia a transição de saída
    if (text !== displayText) {
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        // Atualiza o texto real no meio da transição e remove a classe de saída
        setDisplayText(text);
        setIsTransitioning(false);
      }, 300); // 300ms casa com o CSS transition

      return () => clearTimeout(timer);
    }
  }, [text, displayText]);

  return (
    <Component 
      id={id} 
      className={`transition-text ${isTransitioning ? "text-exit" : "text-enter"} ${className}`}
    >
      {displayText}
    </Component>
  );
}
