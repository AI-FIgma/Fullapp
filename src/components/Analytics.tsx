import { 
  ArrowLeft, Users, UserPlus, TrendingUp, MessageCircle, FileText, 
  Calendar, Clock, Eye, ThumbsUp, Award, Shield, BadgeCheck, 
  Activity, BarChart3, PieChart, Target, Zap, CheckCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { useState } from 'react';
import { ForumHeader } from './ForumHeader';
import { mockUsers, mockPosts, mockComments, categories } from '../data/mockData';
import type { User } from '../App';

interface AnalyticsProps {
  onBack: () => void;
  unreadNotifications: number;
  onNavigate: (view: 'notifications' | 'saved' | 'settings') => void;
}

type TimeRange = 'today' | 'week' | 'month' | 'year' | 'all';

export function Analytics({ onBack, unreadNotifications, onNavigate }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  
  // Collapse states for each section
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    registrations: false,
    onlineStatus: false,
    roles: false,
    postActivity: false,
    categories: false,
    quality: false,
    contributors: false,
    patterns: false,
    engagement: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate date ranges
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);

  // Helper to check if date is in range
  const isInRange = (date: Date) => {
    if (timeRange === 'all') return true;
    if (timeRange === 'today') return date >= today;
    if (timeRange === 'week') return date >= weekAgo;
    if (timeRange === 'month') return date >= monthAgo;
    if (timeRange === 'year') return date >= yearAgo;
    return true;
  };

  // USER STATISTICS
  const totalUsers = mockUsers.length;
  const usersWithMemberSince = mockUsers.filter(u => u.memberSince);
  
  const newUsersToday = usersWithMemberSince.filter(u => 
    u.memberSince && u.memberSince >= today
  ).length;
  
  const newUsersThisWeek = usersWithMemberSince.filter(u => 
    u.memberSince && u.memberSince >= weekAgo
  ).length;
  
  const newUsersThisMonth = usersWithMemberSince.filter(u => 
    u.memberSince && u.memberSince >= monthAgo
  ).length;

  // Role distribution
  const roleStats = {
    admin: mockUsers.filter(u => u.role === 'admin').length,
    moderator: mockUsers.filter(u => u.role === 'moderator').length,
    vet: mockUsers.filter(u => u.role === 'vet').length,
    trainer: mockUsers.filter(u => u.role === 'trainer').length,
    member: mockUsers.filter(u => u.role === 'member' || u.role === 'user').length
  };

  // Online status (mock - would be real-time in production)
  const onlineUsers = mockUsers.filter(u => u.onlineStatus === 'online').length;
  const awayUsers = mockUsers.filter(u => u.onlineStatus === 'away').length;
  const offlineUsers = mockUsers.filter(u => !u.onlineStatus || u.onlineStatus === 'offline').length;

  // POST STATISTICS
  const postsInRange = mockPosts.filter(p => isInRange(p.timestamp));
  const totalPosts = mockPosts.length;
  const postsToday = mockPosts.filter(p => p.timestamp >= today).length;
  const postsThisWeek = mockPosts.filter(p => p.timestamp >= weekAgo).length;
  const postsThisMonth = mockPosts.filter(p => p.timestamp >= monthAgo).length;

  // Category breakdown
  const postsByCategory = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    count: postsInRange.filter(p => p.category === cat.id).length,
    percentage: totalPosts > 0 
      ? Math.round((postsInRange.filter(p => p.category === cat.id).length / postsInRange.length) * 100)
      : 0
  })).sort((a, b) => b.count - a.count);

  // ENGAGEMENT STATISTICS
  const totalPawvotes = postsInRange.reduce((sum, p) => sum + p.pawvotes, 0);
  const totalComments = Object.values(mockComments).flat().length;
  const averagePawvotesPerPost = postsInRange.length > 0 
    ? Math.round(totalPawvotes / postsInRange.length) 
    : 0;
  const averageCommentsPerPost = postsInRange.length > 0 
    ? Math.round(totalComments / postsInRange.length) 
    : 0;

  // Top contributors
  const userPostCounts = mockUsers.map(user => ({
    user,
    postCount: mockPosts.filter(p => p.author.id === user.id).length,
    totalPawvotes: mockPosts
      .filter(p => p.author.id === user.id)
      .reduce((sum, p) => sum + p.pawvotes, 0)
  })).sort((a, b) => b.postCount - a.postCount).slice(0, 5);

  // Activity by day of week
  const dayOfWeekStats = Array(7).fill(0);
  postsInRange.forEach(post => {
    const day = post.timestamp.getDay();
    dayOfWeekStats[day]++;
  });
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mostActiveDay = daysOfWeek[dayOfWeekStats.indexOf(Math.max(...dayOfWeekStats))];

  // Activity by hour (would need more data in production)
  const peakHour = Math.floor(Math.random() * 12) + 8; // Mock: 8am-8pm

  // Content quality metrics
  const highQualityPosts = postsInRange.filter(p => p.pawvotes >= 50).length;
  const popularPosts = postsInRange.filter(p => p.commentCount >= 20).length;
  const pinnedPosts = postsInRange.filter(p => p.isPinned).length;
  const globalPinnedPosts = postsInRange.filter(p => p.isGlobalPin).length;

  // Growth rate calculation
  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const userGrowthRate = calculateGrowthRate(newUsersThisMonth, totalUsers - newUsersThisMonth);
  const postGrowthRate = calculateGrowthRate(postsThisMonth, totalPosts - postsThisMonth);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-gray-600 hover:text-teal-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base">Forum Analytics</h2>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
          <ForumHeader
            unreadNotifications={unreadNotifications}
            onOpenNotifications={() => onNavigate('notifications')}
            onOpenSaved={() => onNavigate('saved')}
            onOpenSettings={() => onNavigate('settings')}
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Overview Stats Section with Time Range Filter */}
        <div className="space-y-3">
          {/* Section Header with Time Range */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-gray-600">Overview Statistics</h3>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>

          {/* Overview Stats - Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-xs text-blue-900">Total Users</span>
              </div>
              <p className="text-2xl text-blue-900 mb-1">{totalUsers.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs text-blue-700">
                <TrendingUp className="w-3 h-3" />
                <span>{userGrowthRate > 0 ? '+' : ''}{userGrowthRate}% this month</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="text-xs text-purple-900">Total Posts</span>
              </div>
              <p className="text-2xl text-purple-900 mb-1">{totalPosts.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs text-purple-700">
                <TrendingUp className="w-3 h-3" />
                <span>{postGrowthRate > 0 ? '+' : ''}{postGrowthRate}% this month</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsUp className="w-5 h-5 text-teal-600" />
                <span className="text-xs text-teal-900">Total Pawvotes</span>
              </div>
              <p className="text-2xl text-teal-900 mb-1">{totalPawvotes.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs text-teal-700">
                <Target className="w-3 h-3" />
                <span>{averagePawvotesPerPost} avg/post</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-orange-600" />
                <span className="text-xs text-orange-900">Total Comments</span>
              </div>
              <p className="text-2xl text-orange-900 mb-1">{totalComments.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs text-orange-700">
                <Target className="w-3 h-3" />
                <span>{averageCommentsPerPost} avg/post</span>
              </div>
            </div>
          </div>
        </div>

        {/* New User Registrations */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <UserPlus className="w-5 h-5 text-green-500" />
            <h3 className="text-sm">New User Registrations</h3>
            <button
              onClick={() => toggleSection('registrations')}
              className="ml-auto text-gray-500 hover:text-gray-700 transition-colors"
            >
              {expandedSections.registrations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          {expandedSections.registrations && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Today</span>
                </div>
                <span className="text-lg text-green-600">{newUsersToday}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">This Week</span>
                </div>
                <span className="text-lg text-blue-600">{newUsersThisWeek}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">This Month</span>
                </div>
                <span className="text-lg text-purple-600">{newUsersThisMonth}</span>
              </div>
            </div>
          )}
        </div>

        {/* Online Status Distribution */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-teal-500" />
            <h3 className="text-sm">User Activity Status</h3>
            <button
              onClick={() => toggleSection('onlineStatus')}
              className="ml-auto text-gray-500 hover:text-gray-700 transition-colors"
            >
              {expandedSections.onlineStatus ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          {expandedSections.onlineStatus && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-700">Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900">{onlineUsers}</span>
                  <span className="text-xs text-gray-500">
                    ({totalUsers > 0 ? Math.round((onlineUsers / totalUsers) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${totalUsers > 0 ? (onlineUsers / totalUsers) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-700">Away</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900">{awayUsers}</span>
                  <span className="text-xs text-gray-500">
                    ({totalUsers > 0 ? Math.round((awayUsers / totalUsers) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all"
                  style={{ width: `${totalUsers > 0 ? (awayUsers / totalUsers) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-sm text-gray-700">Offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900">{offlineUsers}</span>
                  <span className="text-xs text-gray-500">
                    ({totalUsers > 0 ? Math.round((offlineUsers / totalUsers) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-400 h-2 rounded-full transition-all"
                  style={{ width: `${totalUsers > 0 ? (offlineUsers / totalUsers) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Role Distribution */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-purple-500" />
            <h3 className="text-sm">User Role Distribution</h3>
            <button
              onClick={() => toggleSection('roles')}
              className="ml-auto text-gray-500 hover:text-gray-700 transition-colors"
            >
              {expandedSections.roles ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          {expandedSections.roles && (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                <span className="text-xs text-red-700">Administrators</span>
                <span className="text-sm text-red-900">{roleStats.admin}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                <span className="text-xs text-purple-700">Moderators</span>
                <span className="text-sm text-purple-900">{roleStats.moderator}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <span className="text-xs text-blue-700">Verified Vets</span>
                <span className="text-sm text-blue-900">{roleStats.vet}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                <span className="text-xs text-green-700">Certified Trainers</span>
                <span className="text-sm text-green-900">{roleStats.trainer}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-700">Regular Members</span>
                <span className="text-sm text-gray-900">{roleStats.member}</span>
              </div>
            </div>
          )}
        </div>

        {/* Post Activity */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm">Post Activity</h3>
            <button
              onClick={() => toggleSection('postActivity')}
              className="ml-auto text-gray-500 hover:text-gray-700 transition-colors"
            >
              {expandedSections.postActivity ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          {expandedSections.postActivity && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Today</span>
                </div>
                <span className="text-lg text-blue-600">{postsToday}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">This Week</span>
                </div>
                <span className="text-lg text-purple-600">{postsThisWeek}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span className="text-sm text-gray-700">This Month</span>
                </div>
                <span className="text-lg text-teal-600">{postsThisMonth}</span>
              </div>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm">Posts by Category</h3>
            <span className="text-xs text-gray-500">
              ({timeRange === 'all' ? 'All Time' : 
                timeRange === 'today' ? 'Today' : 
                timeRange === 'week' ? 'This Week' :
                timeRange === 'month' ? 'This Month' : 'This Year'})
            </span>
            <button
              onClick={() => toggleSection('categories')}
              className="ml-auto text-gray-500 hover:text-gray-700 transition-colors"
            >
              {expandedSections.categories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          {expandedSections.categories && (
            <div className="space-y-2">
              {postsByCategory.map(cat => (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{cat.icon}</span>
                      <span className="text-xs text-gray-700">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">{cat.count}</span>
                      <span className="text-xs text-gray-500">({cat.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-teal-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content Quality Metrics */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-yellow-500" />
            <h3 className="text-sm">Content Quality</h3>
            <button
              onClick={() => toggleSection('quality')}
              className="ml-auto text-gray-500 hover:text-gray-700 transition-colors"
            >
              {expandedSections.quality ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          {expandedSections.quality && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-1 mb-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-600" />
                  <span className="text-xs text-yellow-900">High Quality</span>
                </div>
                <p className="text-xl text-yellow-900">{highQualityPosts}</p>
                <p className="text-[10px] text-yellow-700">50+ pawvotes</p>
              </div>
              <div className="p-3 bg-pink-50 rounded-xl border border-pink-200">
                <div className="flex items-center gap-1 mb-1">
                  <MessageCircle className="w-3.5 h-3.5 text-pink-600" />
                  <span className="text-xs text-pink-900">Popular</span>
                </div>
                <p className="text-xl text-pink-900">{popularPosts}</p>
                <p className="text-[10px] text-pink-700">20+ comments</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-1 mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs text-blue-900">Pinned</span>
                </div>
                <p className="text-xl text-blue-900">{pinnedPosts}</p>
                <p className="text-[10px] text-blue-700">Category pins</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-sm">📢</span>
                  <span className="text-xs text-purple-900">Global</span>
                </div>
                <p className="text-xl text-purple-900">{globalPinnedPosts}</p>
                <p className="text-[10px] text-purple-700">Announcements</p>
              </div>
            </div>
          )}
        </div>

        {/* Top Contributors */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-teal-500" />
            <h3 className="text-sm">Top Contributors</h3>
            <span className="text-xs text-gray-500">(All Time)</span>
            <button
              onClick={() => toggleSection('contributors')}
              className="ml-auto text-gray-500 hover:text-gray-700 transition-colors"
            >
              {expandedSections.contributors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          {expandedSections.contributors && (
            <div className="space-y-2">
              {userPostCounts.map((contributor, index) => (
                <div 
                  key={contributor.user.id} 
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500 text-white text-xs">
                    {index + 1}
                  </div>
                  <img 
                    src={contributor.user.avatar} 
                    alt={contributor.user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{contributor.user.username}</p>
                    <p className="text-xs text-gray-500">
                      {contributor.postCount} posts • {contributor.totalPawvotes} pawvotes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Patterns */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm">Activity Patterns</h3>
            <button
              onClick={() => toggleSection('patterns')}
              className="ml-auto text-gray-500 hover:text-gray-700 transition-colors"
            >
              {expandedSections.patterns ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          {expandedSections.patterns && (
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-indigo-900">Most Active Day</span>
                  <span className="text-sm text-indigo-900">{mostActiveDay}</span>
                </div>
                <div className="flex gap-1">
                  {daysOfWeek.map((day, index) => {
                    const maxPosts = Math.max(...dayOfWeekStats);
                    const height = maxPosts > 0 ? (dayOfWeekStats[index] / maxPosts) * 100 : 0;
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-indigo-200 rounded-sm relative" style={{ height: '40px' }}>
                          <div 
                            className="absolute bottom-0 w-full bg-indigo-500 rounded-sm transition-all"
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-gray-600">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-orange-900">Peak Activity Hour</span>
                  <span className="text-sm text-orange-900">
                    {peakHour}:00 - {peakHour + 1}:00
                  </span>
                </div>
                <p className="text-xs text-orange-700 mt-1">
                  Most posts are created during this time
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Engagement Rate */}
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm text-teal-900">Engagement Metrics</h3>
            <button
              onClick={() => toggleSection('engagement')}
              className="ml-auto text-gray-500 hover:text-gray-700 transition-colors"
            >
              {expandedSections.engagement ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          {expandedSections.engagement && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/70 p-3 rounded-xl">
                <p className="text-xs text-gray-600 mb-1">Avg Pawvotes/Post</p>
                <p className="text-xl text-teal-900">{averagePawvotesPerPost}</p>
              </div>
              <div className="bg-white/70 p-3 rounded-xl">
                <p className="text-xs text-gray-600 mb-1">Avg Comments/Post</p>
                <p className="text-xl text-teal-900">{averageCommentsPerPost}</p>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50 border-2 border-purple-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm text-purple-900">Forum Health Summary</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              ✅ <span className="font-medium">{totalUsers}</span> total users with{' '}
              <span className="font-medium text-green-600">{onlineUsers} currently online</span>
            </p>
            <p>
              ✅ <span className="font-medium">{totalPosts}</span> total posts with{' '}
              <span className="font-medium text-purple-600">{postsThisMonth} this month</span>
            </p>
            <p>
              ✅ <span className="font-medium">{totalPawvotes.toLocaleString()}</span> total engagement with{' '}
              <span className="font-medium text-teal-600">{averagePawvotesPerPost} avg/post</span>
            </p>
            <p>
              ✅ <span className="font-medium">{mostActiveDay}</span> is the most active day
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}