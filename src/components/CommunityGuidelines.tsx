import { ArrowLeft, Heart, Shield, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { ForumHeader } from './ForumHeader';

interface CommunityGuidelinesProps {
  onBack: () => void;
  unreadNotifications: number;
  onNavigate: (view: 'notifications' | 'saved' | 'settings') => void;
}

export function CommunityGuidelines({ onBack, unreadNotifications, onNavigate }: CommunityGuidelinesProps) {
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
            <h2 className="text-base font-semibold">Community Guidelines</h2>
          </div>
          <ForumHeader
            unreadNotifications={unreadNotifications}
            onOpenNotifications={() => onNavigate('notifications')}
            onOpenSaved={() => onNavigate('saved')}
            onOpenSettings={() => onNavigate('settings')}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white text-center">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h2 className="text-xl font-bold mb-2">Community Guidelines</h2>
          <p className="text-sm text-purple-100">Building a safe, respectful space for all pet lovers</p>
        </div>

        {/* Our Values */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Our Community Values
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Kindness</h4>
                <p className="text-sm text-gray-600">Treat everyone with respect and compassion</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Safety</h4>
                <p className="text-sm text-gray-600">Keep our community safe for all members and their pets</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Inclusivity</h4>
                <p className="text-sm text-gray-600">Welcome diverse perspectives and experiences</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Authenticity</h4>
                <p className="text-sm text-gray-600">Share genuine experiences and helpful information</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Allowed */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            What We Encourage ✅
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Helpful advice</strong> - Share your knowledge and experiences to help other pet owners
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Cute pet photos & videos</strong> - We love seeing your furry friends!
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Support & encouragement</strong> - Be there for others during difficult times
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Educational content</strong> - Share training tips, nutrition info, and care guides
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Community events</strong> - Organize or promote pet-friendly meetups and events
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Lost & Found posts</strong> - Help reunite pets with their families
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Respectful debates</strong> - Discuss different viewpoints constructively
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Shelter & rescue promotions</strong> - Help animals find forever homes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Not Allowed */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            What's Not Allowed ❌
          </h3>
          
          <div className="space-y-4">
            {/* Animal Abuse */}
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-900 mb-1">🚫 Animal Abuse or Cruelty</h4>
              <p className="text-sm text-gray-700">
                Any content depicting, promoting, or glorifying animal abuse, neglect, cruelty, or exploitation. This includes:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4 space-y-1">
                <li>Physical abuse or violence toward animals</li>
                <li>Neglect or dangerous living conditions</li>
                <li>Animal fighting or baiting</li>
                <li>Harmful "pranks" or experiments</li>
              </ul>
              <p className="text-xs text-red-600 mt-2 font-medium">⚠️ Zero tolerance - Immediate ban</p>
            </div>

            {/* Hate Speech */}
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-orange-900 mb-1">🚫 Hate Speech & Harassment</h4>
              <p className="text-sm text-gray-700">
                Bullying, harassment, hate speech, or discrimination based on race, ethnicity, religion, gender, sexual orientation, disability, or any other protected characteristic.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4 space-y-1">
                <li>Personal attacks or doxxing</li>
                <li>Targeted harassment or stalking</li>
                <li>Hateful symbols or slurs</li>
                <li>Threats or intimidation</li>
              </ul>
            </div>

            {/* Graphic Content */}
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-yellow-900 mb-1">🚫 Graphic or Disturbing Content</h4>
              <p className="text-sm text-gray-700">
                Excessively graphic, violent, or disturbing content:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4 space-y-1">
                <li>Graphic injuries or medical procedures (without warning)</li>
                <li>Dead or dying animals (except memorial posts with warnings)</li>
                <li>Gore or extreme violence</li>
                <li>Adult or sexual content</li>
              </ul>
              <p className="text-xs text-yellow-700 mt-2">💡 Tip: Use content warnings for sensitive veterinary content</p>
            </div>

            {/* Spam */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-purple-900 mb-1">🚫 Spam & Scams</h4>
              <p className="text-sm text-gray-700">
                Repetitive, irrelevant, or deceptive content:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4 space-y-1">
                <li>Excessive self-promotion or advertising</li>
                <li>Pyramid schemes or get-rich-quick scams</li>
                <li>Phishing or fraudulent links</li>
                <li>Bot activity or fake engagement</li>
              </ul>
            </div>

            {/* Misinformation */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-900 mb-1">🚫 Dangerous Misinformation</h4>
              <p className="text-sm text-gray-700">
                False or misleading information that could harm pets:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4 space-y-1">
                <li>Fake medical advice or anti-vaccine propaganda</li>
                <li>Dangerous DIY treatments</li>
                <li>Toxic foods promoted as safe</li>
                <li>Fraudulent professional credentials</li>
              </ul>
              <p className="text-xs text-blue-700 mt-2">⚕️ Always consult a licensed vet for medical issues</p>
            </div>

            {/* Other Prohibited */}
            <div className="border-l-4 border-gray-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-1">🚫 Other Prohibited Content</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Selling or trading animals (use authorized platforms)</li>
                <li>Illegal activities or drug use</li>
                <li>Copyright infringement</li>
                <li>Impersonation of others or verified professionals</li>
                <li>Brigading or vote manipulation</li>
                <li>Off-topic content unrelated to pets</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4">💡 Best Practices</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• <strong>Be respectful:</strong> Disagree without being disagreeable</p>
            <p>• <strong>Stay on topic:</strong> Keep posts relevant to the category</p>
            <p>• <strong>Give context:</strong> Provide details when asking for advice</p>
            <p>• <strong>Credit sources:</strong> Give credit when sharing others' content</p>
            <p>• <strong>Use warnings:</strong> Tag sensitive content appropriately</p>
            <p>• <strong>Report issues:</strong> Help us by reporting rule violations</p>
            <p>• <strong>Be patient:</strong> Remember everyone is here to learn</p>
          </div>
        </div>

        {/* Enforcement */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Enforcement & Consequences
          </h3>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Minor Violations</h4>
              <p className="text-sm text-gray-600">
                First offense: Content removal + warning
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-1">Moderate Violations</h4>
              <p className="text-sm text-gray-600">
                Repeated offenses: Temporary suspension (1-30 days)
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-1">Severe Violations</h4>
              <p className="text-sm text-gray-600">
                Serious violations (abuse, threats, scams): Permanent ban
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-1">Appeals Process</h4>
              <p className="text-sm text-gray-600">
                Believe a decision was made in error? Submit an appeal through Settings → Help & Support. Appeals are reviewed within 3-5 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Reporting */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-3">📢 How to Report Violations</h3>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
            <li>Tap the three dots (⋮) on any post or comment</li>
            <li>Select "Report"</li>
            <li>Choose the violation type</li>
            <li>Add context (optional but helpful)</li>
            <li>Submit - Our team will review within 24 hours</li>
          </ol>
          <p className="text-sm text-gray-600 mt-3">
            Your report is anonymous. We take all reports seriously and investigate thoroughly.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center">
          <p className="text-sm text-purple-900 mb-2">
            <strong>Questions about these guidelines?</strong>
          </p>
          <p className="text-sm text-purple-700">
            Contact our Community Team at{' '}
            <a href="mailto:community@petcommunity.app" className="text-purple-600 hover:underline font-medium">
              community@petcommunity.app
            </a>
          </p>
        </div>

        {/* Thank You */}
        <div className="text-center text-sm text-gray-600 pb-4">
          <p className="mb-2">Thank you for helping us build a positive, supportive community! 🐾❤️</p>
          <p className="text-xs">Last updated: December 16, 2024</p>
        </div>
      </div>
    </div>
  );
}
