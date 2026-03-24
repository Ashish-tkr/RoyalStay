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
import { FileText, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyModalProps {
  open: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({
  open,
  onClose
}: PrivacyPolicyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-luxury-900 border-luxury-700 text-white max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-royal-400" />
            Privacy Policy
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Complete privacy policy and data protection information
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            <section>
              <h3 className="text-lg font-semibold text-royal-300 mb-3">1. Information We Collect</h3>
              <p className="text-gray-200 leading-relaxed mb-3">
                We collect information you provide directly to us, such as when you create an account, make a reservation,
                or contact us for support. This includes your name, email address, phone number, payment information,
                and any other information you choose to provide.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-royal-300 mb-3">2. How We Use Your Information</h3>
              <div className="text-gray-200 leading-relaxed space-y-2">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Process your reservations and provide our services</li>
                  <li>Communicate with you about your bookings and our services</li>
                  <li>Improve our website and services</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-royal-300 mb-3">3. Cookies and Tracking Technologies</h3>
              <p className="text-gray-200 leading-relaxed mb-3">
                We use cookies, pixels, and other tracking technologies to enhance site navigation, analyze site usage,
                and assist in our marketing efforts. You can control cookies through your browser settings.
              </p>
              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/30">
                <p className="text-blue-200 text-sm">
                  <strong>Mobile App Users:</strong> We do not store cookies or other technologies on your device
                  that track you across third-party apps or websites.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-royal-300 mb-3">4. Data Sharing and Disclosure</h3>
              <p className="text-gray-200 leading-relaxed mb-3">
                We do not sell, trade, or otherwise transfer your personal information to third parties except as
                described in this policy. We may share your information with service providers, business partners,
                or as required by law.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-royal-300 mb-3">5. Data Security</h3>
              <p className="text-gray-200 leading-relaxed mb-3">
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no method of transmission over the internet
                is 100% secure.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-royal-300 mb-3">6. Your Rights</h3>
              <div className="text-gray-200 leading-relaxed space-y-2">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your information</li>
                  <li>Object to processing of your information</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-royal-300 mb-3">7. Contact Information</h3>
              <p className="text-gray-200 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-luxury-800/50 p-4 rounded-lg border border-luxury-700 mt-3">
                <p className="text-white">
                  <strong>Email:</strong> privacy@RoyalStay.com<br />
                  <strong>Phone:</strong> +91 98765 43210<br />
                  <strong>Address:</strong> RoyalStay Hospitality, Bangalore, India
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-royal-300 mb-3">8. Changes to This Policy</h3>
              <p className="text-gray-200 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Last Updated: {new Date().toLocaleDateString('en-IN')}
              </p>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Consent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 