import { ArrowLeft, Heart, Users, Shield, Sparkles, Mail, Github, Twitter } from 'lucide-react';
import { ForumHeader } from './ForumHeader';

interface AboutProps {
  onBack: () => void;
  unreadNotifications: number;
  onNavigate: (view: 'notifications' | 'saved' | 'settings') => void;
  isForumContext?: boolean;
}

export function About({ onBack, unreadNotifications, onNavigate, isForumContext = false }: AboutProps) {
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
            <h2 className="text-base font-semibold">About</h2>
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
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-8 text-white text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-2xl font-bold mb-2">Pet Community</h2>
          <p className="text-teal-100">
            Connecting pet lovers worldwide
          </p>
          <div className="mt-4 text-sm text-teal-100">
            Version 1.0.0
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Our Mission
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Pet Community is dedicated to creating a supportive, informative, and engaging platform for pet owners, veterinarians, and trainers. We believe that by connecting passionate pet lovers, we can improve the lives of animals everywhere.
          </p>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Key Features
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Community Forums</h4>
                <p className="text-sm text-gray-600">
                  Discuss topics about dogs, cats, shelters, events, and more
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Verified Professionals</h4>
                <p className="text-sm text-gray-600">
                  Connect with certified veterinarians and trainers
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Lost & Found</h4>
                <p className="text-sm text-gray-600">
                  Help reunite lost pets with their families
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Events & Meetups</h4>
                <p className="text-sm text-gray-600">
                  Discover local pet events and connect with other owners
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-teal-600">50K+</div>
            <div className="text-xs text-gray-600 mt-1">Active Users</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-teal-600">1M+</div>
            <div className="text-xs text-gray-600 mt-1">Posts</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-teal-600">500+</div>
            <div className="text-xs text-gray-600 mt-1">Verified Pros</div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="font-semibold text-lg mb-3">Our Team</h3>
          <p className="text-gray-700 leading-relaxed">
            Pet Community is built by a passionate team of pet lovers, developers, and community managers who are dedicated to creating the best platform for animal enthusiasts worldwide.
          </p>
        </div>

        {/* Contact & Social */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
          <div className="space-y-3">
            <a
              href="mailto:support@petcommunity.app"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Email</div>
                <div className="text-sm text-gray-600">support@petcommunity.app</div>
              </div>
            </a>

            <a
              href="https://twitter.com/petcommunity"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Twitter className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Twitter</div>
                <div className="text-sm text-gray-600">@petcommunity</div>
              </div>
            </a>

            <a
              href="https://github.com/petcommunity"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Github className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">GitHub</div>
                <div className="text-sm text-gray-600">github.com/petcommunity</div>
              </div>
            </a>
          </div>
        </div>

        {/* Legal Links */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="font-semibold text-lg mb-3">Legal</h3>
          <div className="space-y-2">
            <button onClick={() => onNavigate('terms')} className="block text-sm text-teal-600 hover:underline">
              Terms of Service
            </button>
            <button onClick={() => onNavigate('privacy')} className="block text-sm text-teal-600 hover:underline">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('guidelines')} className="block text-sm text-teal-600 hover:underline">
              Community Guidelines
            </button>
            <a href="#" className="block text-sm text-teal-600 hover:underline">
              Cookie Policy
            </a>
          </div>
        </div>

        {/* Credits */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <h3 className="font-semibold text-lg mb-2">Made with Love</h3>
          <p className="text-sm text-gray-700">
            Built by pet lovers, for pet lovers. Thank you to our amazing community for making this platform special. 🐾❤️
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500 pb-4">
          <p>© 2024 Pet Community. All rights reserved.</p>
          <p className="mt-1">Version 1.0.0 • Last updated December 2024</p>
        </div>
      </div>
    </div>
  );
}
