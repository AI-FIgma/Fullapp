import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Plus, Edit2, Trash2, Eye, EyeOff, X, 
  Calendar, Target, BarChart3, MousePointerClick, Upload,
  Check, ArrowLeft, CheckCircle, Clock, PlayCircle, Loader2
} from 'lucide-react';
import { getAds, createAd, updateAd, deleteAd } from '../utils/adsApi';
import type { SponsoredAd } from './SponsoredBanner';

interface AdminDashboardProps {
  ads?: SponsoredAd[]; // Optional now as we fetch
  onBack: () => void;
  hideHeader?: boolean;
  showCreateButton?: boolean;
}

export function AdminDashboard({ ads: initialAds, onBack, hideHeader = false, showCreateButton = true }: AdminDashboardProps) {
  const [adsState, setAdsState] = useState<SponsoredAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAd, setEditingAd] = useState<SponsoredAd | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'scheduled' | 'completed'>('all');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'quarter' | 'year' | 'all'>('all');

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formCtaText, setFormCtaText] = useState('Shop Now');
  const [formTargetUrl, setFormTargetUrl] = useState('');
  const [formSponsor, setFormSponsor] = useState('');
  const [formSponsorLogo, setFormSponsorLogo] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formTargetCategories, setFormTargetCategories] = useState<string[]>(['all']);

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    setLoading(true);
    const data = await getAds();
    setAdsState(data);
    setLoading(false);
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormImageUrl('');
    setFormVideoUrl('');
    setFormCtaText('Shop Now');
    setFormTargetUrl('');
    setFormSponsor('');
    setFormSponsorLogo('');
    setFormStartDate('');
    setFormEndDate('');
    setFormTargetCategories(['all']);
  };

  const handleCreateAd = async () => {
    setSubmitting(true);
    const newAd: Partial<SponsoredAd> = {
      title: formTitle,
      description: formDescription,
      imageUrl: formImageUrl,
      videoUrl: formVideoUrl,
      ctaText: formCtaText,
      targetUrl: formTargetUrl,
      sponsor: formSponsor,
      sponsorLogo: formSponsorLogo,
      isActive: true,
      impressions: 0,
      clicks: 0,
      startDate: formStartDate ? new Date(formStartDate) : undefined,
      endDate: formEndDate ? new Date(formEndDate) : undefined,
      targetCategories: formTargetCategories
    };
    
    const created = await createAd(newAd);
    if (created) {
        setAdsState([...adsState, created]);
        setShowCreateModal(false);
        resetForm();
    }
    setSubmitting(false);
  };

  const handleUpdateAd = async () => {
    if (!editingAd) return;
    setSubmitting(true);
    
    const updates: Partial<SponsoredAd> = {
        title: formTitle,
        description: formDescription,
        imageUrl: formImageUrl,
        videoUrl: formVideoUrl,
        ctaText: formCtaText,
        targetUrl: formTargetUrl,
        sponsor: formSponsor,
        sponsorLogo: formSponsorLogo,
        startDate: formStartDate ? new Date(formStartDate) : undefined,
        endDate: formEndDate ? new Date(formEndDate) : undefined,
        targetCategories: formTargetCategories
    };

    const updated = await updateAd(editingAd.id, updates);
    if (updated) {
        setAdsState(adsState.map(ad => ad.id === editingAd.id ? updated : ad));
        setEditingAd(null);
        resetForm();
    }
    setSubmitting(false);
  };

  const handleEditAd = (ad: SponsoredAd) => {
    setEditingAd(ad);
    setFormTitle(ad.title);
    setFormDescription(ad.description);
    setFormImageUrl(ad.imageUrl);
    setFormVideoUrl(ad.videoUrl || '');
    setFormCtaText(ad.ctaText);
    setFormTargetUrl(ad.targetUrl);
    setFormSponsor(ad.sponsor);
    setFormSponsorLogo(ad.sponsorLogo || '');
    setFormStartDate(ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : '');
    setFormEndDate(ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : '');
    setFormTargetCategories(ad.targetCategories || ['all']);
  };

  const handleToggleActive = async (adId: string) => {
    const ad = adsState.find(a => a.id === adId);
    if (!ad) return;

    // Optimistic
    setAdsState(adsState.map(a => a.id === adId ? { ...a, isActive: !a.isActive } : a));
    await updateAd(adId, { isActive: !ad.isActive });
  };

  const handleDeleteAd = async (adId: string) => {
    if (confirm('Delete this ad? This action cannot be undone.')) {
      // Optimistic
      setAdsState(adsState.filter(ad => ad.id !== adId));
      await deleteAd(adId);
    }
  };

  const handleMarkAsCompleted = async (adId: string) => {
    // Optimistic
    const now = new Date();
    setAdsState(adsState.map(ad => 
      ad.id === adId ? { ...ad, isActive: false, endDate: now } : ad
    ));
    await updateAd(adId, { isActive: false, endDate: now });
  };

  // Get ad status
  const getAdStatus = (ad: SponsoredAd): 'active' | 'scheduled' | 'completed' => {
    const now = new Date();
    
    if (ad.endDate && ad.endDate < now) {
      return 'completed';
    }
    
    if (ad.startDate && ad.startDate > now) {
      return 'scheduled';
    }
    
    if (ad.isActive) {
      return 'active';
    }
    
    return 'completed';
  };

  // Filter ads by status
  const filteredAdsByStatus = adsState.filter(ad => {
    if (statusFilter === 'all') return true;
    return getAdStatus(ad) === statusFilter;
  });

  // Calculate date range for time filter
  const getDateRange = () => {
    const now = new Date();
    const ranges: Record<typeof timeFilter, Date> = {
      week: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()),
      month: new Date(now.getFullYear(), now.getMonth(), 1),
      quarter: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1),
      year: new Date(now.getFullYear(), 0, 1),
      all: new Date(0) // Beginning of time
    };
    return ranges[timeFilter];
  };

  // Filter ads by time period
  const filteredAds = filteredAdsByStatus.filter(ad => {
    if (timeFilter === 'all') return true;
    
    const rangeStart = getDateRange();
    const now = new Date();
    
    // Check if ad was active during the selected time period
    const adStart = ad.startDate || new Date(0);
    const adEnd = ad.endDate || now;
    
    // Ad is included if it was active at any point during the selected period
    return adEnd >= rangeStart && adStart <= now;
  });

  // Calculate stats for filtered ads
  const totalImpressions = filteredAds.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = filteredAds.reduce((sum, ad) => sum + ad.clicks, 0);
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
  const activeAds = adsState.filter(ad => getAdStatus(ad) === 'active').length;
  const scheduledAds = adsState.filter(ad => getAdStatus(ad) === 'scheduled').length;
  const completedAds = adsState.filter(ad => getAdStatus(ad) === 'completed').length;

  const getCategoryBadgeColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'dogs': 'bg-amber-100 text-amber-700',
      'cats': 'bg-purple-100 text-purple-700',
      'general': 'bg-gray-100 text-gray-700',
      'shelters': 'bg-green-100 text-green-700',
      'events': 'bg-blue-100 text-blue-700',
      'lost-found': 'bg-red-100 text-red-700',
      'all': 'bg-teal-100 text-teal-700'
    };
    return colors[category] || colors['all'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      {!hideHeader && (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Sponsored Ads Dashboard</h1>
                  <p className="text-sm text-gray-500">Manage native advertising campaigns</p>
                </div>
              </div>
              {showCreateButton && (
                <button
                  onClick={() => {
                    resetForm();
                    setShowCreateModal(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-xl flex items-center gap-2 hover:from-teal-500 hover:to-teal-600 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Ad</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button - when header is hidden */}
      {hideHeader && showCreateButton && (
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="fixed bottom-20 right-6 z-30 w-14 h-14 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-full shadow-lg hover:from-teal-500 hover:to-teal-600 transition-all hover:scale-110 flex items-center justify-center"
          title="Create New Ad"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Compact Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">All Ads ({adsState.length})</option>
              <option value="active">🟢 Active ({activeAds})</option>
              <option value="scheduled">🔵 Scheduled ({scheduledAds})</option>
              <option value="completed">⚫ Completed ({completedAds})</option>
            </select>
            
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Compact Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {/* Total Impressions */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-blue-700 font-medium">Impressions</p>
            </div>
            <p className="text-2xl font-bold text-blue-900">{totalImpressions.toLocaleString()}</p>
          </div>

          {/* Total Clicks */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200">
            <div className="flex items-center gap-2 mb-1">
              <MousePointerClick className="w-4 h-4 text-teal-600" />
              <p className="text-xs text-teal-700 font-medium">Clicks</p>
            </div>
            <p className="text-2xl font-bold text-teal-900">{totalClicks.toLocaleString()}</p>
          </div>

          {/* Average CTR */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <p className="text-xs text-purple-700 font-medium">CTR</p>
            </div>
            <p className="text-2xl font-bold text-purple-900">{avgCTR}%</p>
          </div>

          {/* Total Ads */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <p className="text-xs text-green-700 font-medium">Showing</p>
            </div>
            <p className="text-2xl font-bold text-green-900">{filteredAds.length} <span className="text-base text-green-700">/ {adsState.length}</span></p>
          </div>
        </div>

        {/* Ads List */}
        <div className="space-y-4">
          {filteredAds.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-300 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-1">No ads found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            filteredAds.map(ad => {
              const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0.00';
              const status = getAdStatus(ad);
              
              return (
                <div 
                  key={ad.id}
                  className={`bg-white p-4 sm:p-6 rounded-2xl border-2 transition-all ${
                    status === 'active'
                      ? 'border-green-200 shadow-sm'
                      : status === 'scheduled'
                      ? 'border-blue-200 shadow-sm'
                      : 'border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Ad Preview */}
                    <div className="flex-shrink-0 w-full sm:w-40 lg:w-48">
                      {ad.videoUrl ? (
                        <video 
                          src={ad.videoUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-40 sm:h-28 lg:h-32 object-cover rounded-xl bg-black"
                        />
                      ) : (
                        <img 
                          src={ad.imageUrl} 
                          alt={ad.title}
                          className="w-full h-40 sm:h-28 lg:h-32 object-cover rounded-xl"
                        />
                      )}
                    </div>

                    {/* Ad Info */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">{ad.title}</h3>
                          {status === 'active' && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium flex-shrink-0 flex items-center gap-1">
                              <PlayCircle className="w-3 h-3" />
                              Active
                            </span>
                          )}
                          {status === 'scheduled' && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium flex-shrink-0 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Scheduled
                            </span>
                          )}
                          {status === 'completed' && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium flex-shrink-0 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 break-words mb-2">{ad.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                          <span className="font-medium break-words">{ad.sponsor}</span>
                          <span className="flex-shrink-0">•</span>
                          <span className="break-words">{ad.ctaText}</span>
                        </div>
                        {(ad.startDate || ad.endDate) && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Calendar className="w-3 h-3" />
                            {ad.startDate && <span>{ad.startDate.toLocaleDateString()}</span>}
                            {ad.startDate && ad.endDate && <span>→</span>}
                            {ad.endDate && <span>{ad.endDate.toLocaleDateString()}</span>}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {ad.targetCategories?.map(cat => (
                            <span 
                              key={cat}
                              className={`px-2 py-0.5 text-xs rounded-full ${getCategoryBadgeColor(cat)}`}
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <button
                          onClick={() => handleToggleActive(ad.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            ad.isActive 
                              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={ad.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {ad.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        {status !== 'completed' && (
                          <button
                            onClick={() => handleMarkAsCompleted(ad.id)}
                            className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditAd(ad)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{ad.impressions.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Views</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <MousePointerClick className="w-3.5 h-3.5 text-gray-500" />
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{ad.clicks.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Clicks</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <BarChart3 className="w-3.5 h-3.5 text-gray-500" />
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{ctr}%</p>
                          <p className="text-xs text-gray-500">CTR</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingAd) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAd ? 'Edit Ad' : 'Create New Ad'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingAd(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sponsor Name *
                </label>
                <input
                  type="text"
                  value={formSponsor}
                  onChange={(e) => setFormSponsor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
                  placeholder="e.g., PetFood Premium LT"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Title *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
                  placeholder="e.g., Premium Pet Food - 20% OFF"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
                  placeholder="Brief description of the offer..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
                  placeholder="https://example.com/image.jpg"
                />
                {formImageUrl && !formVideoUrl && (
                  <img 
                    src={formImageUrl} 
                    alt="Preview"
                    className="mt-2 w-full h-32 object-cover rounded-xl"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">Fallback image (shown if no video)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
                  placeholder="https://example.com/video.mp4"
                />
                {formVideoUrl && (
                  <video 
                    src={formVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="mt-2 w-full h-32 object-cover rounded-xl bg-black"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">Short video ad (MP4, WebM) - autoplay, loop, muted</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sponsor Logo URL
                </label>
                <input
                  type="url"
                  value={formSponsorLogo}
                  onChange={(e) => setFormSponsorLogo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
                  placeholder="https://example.com/logo.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CTA Text *
                  </label>
                  <input
                    type="text"
                    value={formCtaText}
                    onChange={(e) => setFormCtaText(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
                    placeholder="Shop Now"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target URL *
                  </label>
                  <input
                    type="url"
                    value={formTargetUrl}
                    onChange={(e) => setFormTargetUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'dogs', 'cats', 'general', 'shelters', 'events', 'lost-found'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        if (formTargetCategories.includes(cat)) {
                          setFormTargetCategories(formTargetCategories.filter(c => c !== cat));
                        } else {
                          setFormTargetCategories([...formTargetCategories, cat]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        formTargetCategories.includes(cat)
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingAd(null);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingAd ? handleUpdateAd : handleCreateAd}
                disabled={!formTitle || !formDescription || !formImageUrl || !formTargetUrl || !formSponsor}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-xl hover:from-teal-500 hover:to-teal-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {editingAd ? 'Update Ad' : 'Create Ad'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}