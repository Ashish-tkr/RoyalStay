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
import { Building2, Check, X, Clock, Shield, AlertTriangle } from 'lucide-react';

interface HotelRulesModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function HotelRulesModal({
  open,
  onAccept,
  onDecline
}: HotelRulesModalProps) {
  const rules = [
    {
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      title: "No Alcohol or Drugs",
      description: "Strictly prohibited on premises for safety and legal compliance."
    },
    {
      icon: <Clock className="w-5 h-5 text-blue-400" />,
      title: "Visitor Policy",
      description: "No outside visitors allowed after 9:00 PM for security reasons."
    },
    {
      icon: <Shield className="w-5 h-5 text-green-400" />,
      title: "ID Proof Mandatory",
      description: "Valid Aadhar Card, PAN Card, or Passport required at check-in."
    },
    {
      icon: <Clock className="w-5 h-5 text-royal-400" />,
      title: "Check-in & Check-out",
      description: "Timings must be strictly followed as per booking confirmation."
    },
    {
      icon: <Building2 className="w-5 h-5 text-red-400" />,
      title: "Property Damage",
      description: "Any damage to hotel property will be charged to the guest."
    },
    {
      icon: <X className="w-5 h-5 text-orange-400" />,
      title: "No Pets Policy",
      description: "Pets are not allowed unless specifically mentioned in booking."
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-purple-400" />,
      title: "No Illegal Activities",
      description: "Any illegal activities on premises will result in immediate eviction."
    },
    {
      icon: <Clock className="w-5 h-5 text-indigo-400" />,
      title: "Quiet Hours",
      description: "Maintain silence after 10:00 PM to respect other guests."
    }
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDecline()}>
      <DialogContent className="bg-luxury-900 border-luxury-700 text-white max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-royal-400" />
            Hotel Rules & Regulations
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Please read and accept our hotel policies before proceeding with your booking
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            <div className="bg-royal-900/30 p-4 rounded-lg border border-royal-700/50">
              <p className="text-royal-200 text-sm leading-relaxed">
                <strong>Important:</strong> These rules are in accordance with Indian hospitality laws and regulations. 
                Violation of any rule may result in booking cancellation without refund.
              </p>
            </div>

            <div className="grid gap-4">
              {rules.map((rule, index) => (
                <div 
                  key={index}
                  className="bg-luxury-800/50 p-4 rounded-lg border border-luxury-700 hover:border-luxury-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {rule.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{rule.title}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{rule.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-700/30 mt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-200 mb-1">Important Notice</h4>
                  <p className="text-amber-100 text-sm leading-relaxed">
                    By accepting these rules, you agree to comply with all hotel policies during your stay. 
                    Non-compliance may result in immediate eviction without refund and potential legal action.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
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
            Accept Rules & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 