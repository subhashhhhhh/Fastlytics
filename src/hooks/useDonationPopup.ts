import { useState } from 'react';

interface UseDonationPopupReturn {
  shouldShowPopup: boolean;
  hidePopup: () => void;
}

export const useDonationPopup = (): UseDonationPopupReturn => {
  const [shouldShowPopup, setShouldShowPopup] = useState(true);

  const hidePopup = () => {
    setShouldShowPopup(false);
  };

  return {
    shouldShowPopup,
    hidePopup,
  };
};
