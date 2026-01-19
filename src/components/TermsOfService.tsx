import { ArrowLeft, FileText, AlertCircle } from 'lucide-react';
import { ForumHeader } from './ForumHeader';

interface TermsOfServiceProps {
  onBack: () => void;
  unreadNotifications: number;
  onNavigate: (view: 'notifications' | 'saved' | 'settings') => void;
  isForumContext?: boolean;
}

export function TermsOfService({ onBack, unreadNotifications, onNavigate, isForumContext = false }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-teal-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-semibold">Terms of Service</h2>
          </div>
          {isForumContext && (
            <ForumHeader
              unreadNotifications={unreadNotifications}
              onOpenNotifications={() => onNavigate('notifications')}
              onOpenSaved={() => onNavigate('saved')}
              onOpenSettings={() => onNavigate('settings')}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white text-center">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h2 className="text-xl font-bold mb-2">Terms of Service</h2>
          <p className="text-sm text-teal-100">Last updated: December 16, 2024</p>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            By using Pet Community, you agree to these terms. Please read them carefully.
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
          {/* Section 1 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">1. Acceptance of Terms</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              By accessing or using Pet Community ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this Service.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              We reserve the right to modify these terms at any time. Your continued use of the Service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">2. User Accounts</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              <strong>Account Creation:</strong> You must be at least 13 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              <strong>Account Responsibility:</strong> You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Account Termination:</strong> We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful behavior.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">3. User Content</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              <strong>Your Content:</strong> You retain ownership of content you post on Pet Community. By posting, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              <strong>Prohibited Content:</strong> You may not post content that:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
              <li>Depicts animal abuse or cruelty</li>
              <li>Contains hate speech, harassment, or bullying</li>
              <li>Includes graphic violence or adult content</li>
              <li>Violates intellectual property rights</li>
              <li>Contains spam or misleading information</li>
              <li>Promotes illegal activities</li>
            </ul>
            <p className="text-gray-700 text-sm leading-relaxed mt-3">
              <strong>Content Moderation:</strong> We reserve the right to remove any content that violates these terms without prior notice.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">4. Verified Professionals</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              <strong>Verification Process:</strong> Veterinarians and trainers may apply for verification by submitting valid credentials. We verify licenses and certifications but do not guarantee the quality of services.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Professional Conduct:</strong> Verified professionals must maintain ethical standards. Verification may be revoked for misconduct or credential expiration.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">5. Community Guidelines</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              All users must follow our Community Guidelines, which promote respectful, safe, and constructive interactions. Violations may result in content removal, suspension, or permanent ban.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">6. Privacy and Data</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Your use of the Service is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information. Please review our Privacy Policy for detailed information.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">7. Intellectual Property</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              The Service and its original content (excluding user-generated content), features, and functionality are owned by Pet Community and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              You may not copy, modify, distribute, sell, or lease any part of our Service without explicit written permission.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">8. Disclaimer of Warranties</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Medical Disclaimer:</strong> Pet Community is not a substitute for professional veterinary advice. Always consult a licensed veterinarian for medical concerns about your pet.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">9. Limitation of Liability</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              In no event shall Pet Community, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">10. Third-Party Services</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              The Service may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of third-party sites.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">11. Termination</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the Service will cease immediately.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">12. Governing Law</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">13. Changes to Terms</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. Material changes will be notified through the Service or via email. Your continued use after changes constitutes acceptance.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">14. Contact Information</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you have any questions about these Terms, please contact us at:
              <br />
              <a href="mailto:legal@petcommunity.app" className="text-teal-600 hover:underline">
                legal@petcommunity.app
              </a>
            </p>
          </section>
        </div>

        {/* Agreement Notice */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center">
          <p className="text-sm text-teal-800">
            By using Pet Community, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
