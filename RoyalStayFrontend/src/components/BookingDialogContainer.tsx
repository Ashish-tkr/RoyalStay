// BookingDialogContainer.tsx
import { useState } from 'react';
import { useBooking } from '@/hooks/use-booking';
import { BookingDialog } from './BookingDialog';
import { RoomSelectionModal } from './RoomSelectionModal';
import { PrivacyConsentModal } from './PrivacyConsentModal';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { HotelRulesModal } from './HotelRulesModal';

export function BookingDialogContainer() {
  const { 
    isBookingOpen, 
    currentStep, 
    closeBooking, 
    setStep,
    resetBookingFlow,
    propertyName, 
    propertyImage, 
    initialDateRange,
    selectedApartment, // Get apartment data
    selectedFlat, // Get flat data
    selectedRoom // Get room data
  } = useBooking();
  
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const handlePrivacyAccept = () => {
    setStep('rules');
  };

  const handlePrivacyDecline = () => {
    resetBookingFlow();
  };

  const handleViewPolicy = () => {
    setShowPrivacyPolicy(true);
  };

  const handleClosePolicy = () => {
    setShowPrivacyPolicy(false);
  };

  const handleRulesAccept = () => {
    setStep('form');
  };

  const handleRulesDecline = () => {
    resetBookingFlow();
  };

  const handleFormClose = () => {
    closeBooking();
  };

  // Don't render anything if booking is not open
  if (!isBookingOpen) return null;

  return (
    <>
      {/* Room Selection Modal */}
      <RoomSelectionModal
        open={currentStep === 'room-selection'}
        apartment={selectedApartment} // Pass apartment data
        flat={selectedFlat} // Pass flat data
      />

      {/* Privacy Consent Modal */}
      <PrivacyConsentModal
        open={currentStep === 'privacy'}
        onAccept={handlePrivacyAccept}
        onDecline={handlePrivacyDecline}
        onViewPolicy={handleViewPolicy}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        open={showPrivacyPolicy}
        onClose={handleClosePolicy}
      />

      {/* Hotel Rules Modal */}
      <HotelRulesModal
        open={currentStep === 'rules'}
        onAccept={handleRulesAccept}
        onDecline={handleRulesDecline}
  
      />

      {/* Booking Form */}
      {(currentStep === 'form' || currentStep === 'confirmation') && (
        <BookingDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) handleFormClose();
          }}
          propertyName={propertyName}
          propertyImage={propertyImage}
          initialDateRange={initialDateRange}
          apartment={selectedApartment} // Pass apartment data
          flat={selectedFlat} // Pass flat data
        />
      )}
    </>
  );
}