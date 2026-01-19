import { ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react';
import { ForumHeader } from './ForumHeader';

interface PrivacyPolicyProps {
  onBack: () => void;
  unreadNotifications: number;
  onNavigate: (view: 'notifications' | 'saved' | 'settings') => void;
  isForumContext?: boolean;
}

export function PrivacyPolicy({ onBack, unreadNotifications, onNavigate, isForumContext = false }: PrivacyPolicyProps) {
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
            <h2 className="text-base font-semibold">Privacy Policy</h2>
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
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white text-center">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h2 className="text-xl font-bold mb-2">Privacy Policy</h2>
          <p className="text-sm text-blue-100">Last updated: December 16, 2024</p>
        </div>

        {/* Key Points */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <Lock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-xs font-medium">Secure Storage</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <Eye className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-xs font-medium">Transparent</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <Database className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-xs font-medium">Your Control</div>
          </div>
        </div>

        {/* Privacy Content */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
          {/* Introduction */}
          <section>
            <h3 className="font-semibold text-lg mb-3">Introduction</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              At Pet Community, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">1. Information We Collect</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  When you register, we collect:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4 mt-2">
                  <li>Username and display name</li>
                  <li>Email address</li>
                  <li>Profile picture and cover photo</li>
                  <li>Bio and pet information (optional)</li>
                  <li>Professional credentials (for verification)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Content Information</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We store content you create:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4 mt-2">
                  <li>Posts, comments, and poll responses</li>
                  <li>Photos and videos you upload</li>
                  <li>Messages and interactions</li>
                  <li>Saved posts and bookmarks</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Usage Information</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We automatically collect:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4 mt-2">
                  <li>Device information (model, OS version)</li>
                  <li>App usage patterns and preferences</li>
                  <li>IP address and location data</li>
                  <li>Analytics and performance data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">2. How We Use Your Information</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 ml-4">
              <li>Provide and maintain our services</li>
              <li>Personalize your experience and content feed</li>
              <li>Process verification requests for professionals</li>
              <li>Send notifications about activity and updates</li>
              <li>Moderate content and enforce Community Guidelines</li>
              <li>Analyze usage patterns to improve the app</li>
              <li>Respond to support requests and inquiries</li>
              <li>Prevent fraud, spam, and abuse</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">3. Information Sharing</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Public Content</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Posts, comments, and profile information you share publicly are visible to all users. Be mindful of what you share.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Third-Party Services</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We may share data with:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4 mt-2">
                  <li>Cloud storage providers (for content hosting)</li>
                  <li>Analytics services (to improve performance)</li>
                  <li>Payment processors (for premium features)</li>
                  <li>Moderation tools (for content safety)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Legal Requirements</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We may disclose information if required by law, court order, or to protect rights and safety.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">What We Don't Share</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We never sell your personal information to third parties for advertising or marketing purposes.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">4. Data Security</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Secure cloud storage with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Password hashing and authentication</li>
              <li>Monitoring for suspicious activity</li>
            </ul>
            <p className="text-gray-700 text-sm leading-relaxed mt-3">
              However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">5. Your Privacy Rights</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct your information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Export:</strong> Download your content and data</li>
              <li><strong>Opt-Out:</strong> Disable notifications and personalization</li>
              <li><strong>Privacy Settings:</strong> Control who sees your content</li>
            </ul>
            <p className="text-gray-700 text-sm leading-relaxed mt-3">
              To exercise these rights, go to Settings → Privacy or contact us at{' '}
              <a href="mailto:privacy@petcommunity.app" className="text-blue-600 hover:underline">
                privacy@petcommunity.app
              </a>
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">6. Data Retention</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              We retain your data for as long as your account is active or as needed to provide services. Deleted content may remain in backups for up to 90 days. Some information (like moderation records) may be retained longer for legal compliance.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">7. Children's Privacy</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Our Service is not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">8. Cookies and Tracking</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze app performance</li>
              <li>Personalize content recommendations</li>
            </ul>
            <p className="text-gray-700 text-sm leading-relaxed mt-3">
              You can control cookie preferences in your device settings.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">9. International Data Transfers</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Your data may be transferred to and stored on servers in different countries. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">10. Changes to Privacy Policy</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or via email. Your continued use after changes constitutes acceptance.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h3 className="font-semibold text-lg mb-3">11. Contact Us</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              For questions about this Privacy Policy or your data, contact us at:
            </p>
            <div className="mt-3 text-sm text-gray-700 space-y-1">
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@petcommunity.app" className="text-blue-600 hover:underline">
                  privacy@petcommunity.app
                </a>
              </p>
              <p>
                <strong>Data Protection Officer:</strong>{' '}
                <a href="mailto:dpo@petcommunity.app" className="text-blue-600 hover:underline">
                  dpo@petcommunity.app
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* GDPR/CCPA Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Your Privacy Matters</h4>
          <p className="text-sm text-blue-800">
            We comply with GDPR, CCPA, and other data protection regulations. You have full control over your personal information.
          </p>
        </div>
      </div>
    </div>
  );
}
