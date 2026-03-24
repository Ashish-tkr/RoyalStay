import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Eye, X, Check } from 'lucide-react';

interface PrivacyConsentModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onViewPolicy: () => void;
}

export function PrivacyConsentModal({
  open,
  onAccept,
  onDecline,
  onViewPolicy
}: PrivacyConsentModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDecline()}>
      <DialogContent className="bg-luxury-900 border-luxury-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-royal-400" />
            Privacy & Cookie Consent
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Please review our privacy practices before proceeding
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-luxury-800/50 p-4 rounded-lg border border-luxury-700">
            <p className="text-gray-200 leading-relaxed">
              We use cookies, pixels and other technology to collect information you provide to us and information about your interaction with our site to enhance site navigation, analyse site usage, and assist in our marketing efforts.
            </p>
          </div>

          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/30">
            <p className="text-blue-200 text-sm leading-relaxed">
              <strong>Mobile App Users:</strong> We do not store cookies or other technologies on your device that track you across third-party apps or websites.
            </p>
          </div>

          <div className="text-center">
            <p className="text-gray-300 text-sm">
              For more information, please see our{' '}
              <button 
                onClick={onViewPolicy}
                className="text-royal-400 hover:text-royal-300 underline"
              >
                Privacy Policy
              </button>
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onViewPolicy}
            className="border-royal-400 text-royal-400 hover:bg-royal-400/20 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Full Privacy Policy
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onDecline}
              className="border-red-500 text-red-400 hover:bg-red-500/20 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Decline
            </Button>
            <Button 
              onClick={onAccept}
              className="bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Accept & Continue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 