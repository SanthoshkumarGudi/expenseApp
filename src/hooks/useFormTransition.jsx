import { useState } from 'react';

export const useFormTransition = () => {
  const [transitionClass, setTransitionClass] = useState('');

  const handleSwitch = () => {
    setTransitionClass('opacity-0 scale-95');
    setTimeout(() => {
      setTransitionClass('opacity-100 scale-100');
    }, 150);
  };

  return { transitionClass, handleSwitch };
};