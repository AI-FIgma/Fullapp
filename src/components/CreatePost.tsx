import { useState, useRef } from 'react';
import { ArrowLeft, Dog, Cat, Hash, ChevronDown, Image, Video, X, MapPin, AlertCircle, Plus, Trash2, Shield } from 'lucide-react';
import { ForumHeader } from './ForumHeader';
import { HealthDisclaimerModal } from './HealthDisclaimerModal';
import { AppealForm } from './AppealForm';
import { ImagePreview } from './ImagePreview';
import { MentionAutocomplete } from './MentionAutocomplete';
import { categories, currentUser, mockPosts, mockUsers } from '../data/mockData';
import { checkSpam, recordPostCreation, canUserPost, getUserRestrictionsSummary } from '../utils/spamProtection';
import { moderatePost, getModerationMessage, recordViolation, shouldBanUser } from '../utils/contentModeration';
import { addToModerationQueue, BlockedContent } from '../utils/moderationQueue';

interface CreatePostProps {
  onBack: () => void;
  onPostCreated: () => void;
  unreadNotifications: number;
  onNavigate: (view: 'notifications' | 'saved' | 'settings') => void;
}

export function CreatePost({ onBack, onPostCreated, unreadNotifications, onNavigate }: CreatePostProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('community');
  const [subcategory, setSubcategory] = useState<string>('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [attachedVideo, setAttachedVideo] = useState<string | null>(null);
  const [showHealthDisclaimer, setShowHealthDisclaimer] = useState(false);
  const [healthDisclaimerAccepted, setHealthDisclaimerAccepted] = useState(false);
  
  // New fields
  const [location, setLocation] = useState('');
  const [hasPoll, setHasPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [pollDuration, setPollDuration] = useState<number>(7); // days
  const [isChecking, setIsChecking] = useState(false);
  const [blockedContent, setBlockedContent] = useState<BlockedContent | null>(null);
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);

  const selectedCategory = categories.find(c => c.id === category);
  const subcategories = selectedCategory?.subcategories || [];

  // Check if subcategory is health-related
  const isHealthCategory = subcategory.includes('health') || subcategory === 'health';

  const addPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, upload to server and get URLs
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setAttachedImages([...attachedImages, ...newImages]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload to server and get URL
      setAttachedVideo(URL.createObjectURL(file));
    }
  };

  const removeImage = (index: number) => {
    setAttachedImages(attachedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !subcategory) return;
    
    setIsChecking(true);
    
    try {
      // 1. Content Moderation Check (text, images, video)
      const fullContent = `${title} ${content} ${pollQuestion}`;
      const moderationResult = await moderatePost({
        text: fullContent,
        images: attachedImages,
        video: attachedVideo || undefined
      });
      
      if (!moderationResult.isClean) {
        const errorMessage = getModerationMessage(moderationResult);
        
        // Add to moderation queue
        const queueId = addToModerationQueue({
          type: 'post',
          userId: currentUser.id,
          username: currentUser.username,
          userAvatar: currentUser.avatar,
          title: title,
          content: content,
          images: attachedImages.length > 0 ? attachedImages : undefined,
          video: attachedVideo || undefined,
          category: category,
          subcategory: subcategory,
          blockReason: moderationResult.reason || 'profanity',
          blockedWords: moderationResult.blockedWords,
          severity: moderationResult.severity
        });
        
        // Store blocked content for appeal
        const blockedItem: BlockedContent = {
          id: queueId,
          type: 'post',
          userId: currentUser.id,
          username: currentUser.username,
          userAvatar: currentUser.avatar,
          title: title,
          content: content,
          images: attachedImages.length > 0 ? attachedImages : undefined,
          video: attachedVideo || undefined,
          category: category,
          subcategory: subcategory,
          blockReason: moderationResult.reason || 'profanity',
          blockedAt: new Date(),
          blockedWords: moderationResult.blockedWords,
          severity: moderationResult.severity,
          status: 'pending',
          autoBlocked: true
        };
        
        setBlockedContent(blockedItem);
        
        // Record violation
        const violations = recordViolation(currentUser.id);
        
        // Check if user should be banned
        if (shouldBanUser(currentUser.id)) {
          alert(`🚫 Your account has been blocked due to repeated community guideline violations (${violations} violations). Please contact an admin.`);
          setIsChecking(false);
          return;
        }
        
        // Show error with appeal option
        alert(`${errorMessage}\n\nYour content has been automatically blocked and sent to moderators for review.`);
        
        setIsChecking(false);
        return;
      }
      
      // 2. Spam protection check
      const spamCheck = checkSpam(fullContent, currentUser, mockPosts, 'post');
      
      if (!spamCheck.allowed) {
        alert(`❌ ${spamCheck.reason}`);
        setIsChecking(false);
        return;
      }
      
      // 3. Record post creation for rate limiting
      recordPostCreation(currentUser.id);
      
      // 4. In a real app, this would save to the database
      alert('✅ Post created successfully!');
      onPostCreated();
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('❌ Error creating post. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };
  
  // Get user restrictions for display
  const restrictions = getUserRestrictionsSummary(currentUser);
  const postCheck = canUserPost(currentUser);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-gray-600 hover:text-teal-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base">Create Post</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !subcategory || isChecking}
              className="px-4 py-1.5 bg-gradient-to-r from-teal-400 to-teal-500 text-white text-sm rounded-full hover:from-teal-500 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isChecking ? 'Checking...' : !subcategory ? 'Select Channel' : 'Post'}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-3">
        {/* Blocked Content Warning */}
        {blockedContent && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
            <div className="flex items-start gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm text-red-900 mb-1">⚠️ Turinys užblokuotas</h3>
                <p className="text-xs text-red-700 mb-2">
                  Jūsų turinys buvo automatiškai užblokuotas dėl galimo bendruomenės taisyklių pažeidimo.
                  Moderatorius peržiūrės jūsų turinį per 24 valandas.
                </p>
                <div className="p-2 bg-white rounded-lg mb-2">
                  <p className="text-xs text-gray-600 mb-1">Blokavimo priežastis:</p>
                  <p className="text-sm text-gray-900">
                    {blockedContent.blockReason === 'profanity' && '🔇 Necenzūriniai žodžiai'}
                    {blockedContent.blockReason === 'hate-speech' && '🚫 Neapykantos kalba'}
                    {blockedContent.blockReason === 'spam' && '📧 Spam/Reklama'}
                    {blockedContent.blockReason === 'inappropriate-content' && '🔞 Netinkamas turinys'}
                  </p>
                  {blockedContent.blockedWords && blockedContent.blockedWords.length > 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      Užblokuoti žodžiai: <strong>{blockedContent.blockedWords.join(', ')}</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAppealForm(true)}
              className="w-full px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Pateikti apeliaciją
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Jei manote, kad turinys buvo užblokuotas klaidingai, galite pateikti apeliaciją
            </p>
          </div>
        )}
        
        {/* Category Selection */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">Category</label>
          <div className="space-y-2">
            {/* Main Category */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 border-0 rounded-2xl hover:bg-gray-100 transition-colors text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedCategory?.icon}</span>
                  <span>{selectedCategory?.name}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Dropdown */}
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 overflow-hidden">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategory(cat.id);
                        setSubcategory('');
                        setShowCategoryDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-teal-50 transition-colors text-sm"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subcategory */}
            {subcategories.length > 0 && (
              <div>
                <label className="block text-xs text-gray-600 mb-1.5">
                  Channel <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {subcategories.map(sub => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSubcategory(sub.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border transition-all text-xs ${
                        subcategory === sub.id
                          ? 'bg-teal-50 border-teal-300 text-teal-700'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {sub.icon && <span className="text-sm">{sub.icon}</span>}
                      <span className="truncate">{sub.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="mb-3">
          <label htmlFor="title" className="block text-sm text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-3 py-2.5 text-sm bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            maxLength={100}
          />
        </div>

        {/* Content */}
        <div className="mb-3">
          <label htmlFor="content" className="block text-sm text-gray-700 mb-2">
            Content <span className="text-gray-400 text-xs ml-1">(Optional)</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, ask questions, or give advice..."
            rows={6}
            className="w-full px-3 py-2.5 text-sm bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
          />
        </div>

        {/* Health Disclaimer Warning */}
        {isHealthCategory && !healthDisclaimerAccepted && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-900 font-medium mb-1">Health Category Notice</p>
                <p className="text-xs text-amber-800 mb-2">
                  Posting about pet health requires acknowledging our medical disclaimer.
                </p>
                <button
                  type="button"
                  onClick={() => setShowHealthDisclaimer(true)}
                  className="text-xs text-teal-600 hover:text-teal-700 underline"
                >
                  Read Disclaimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Additional Options Section */}
        <div className="mb-4 p-3 bg-gray-50 rounded-2xl">
          <button
            type="button"
            onClick={() => setShowAdditionalOptions(!showAdditionalOptions)}
            className="w-full flex items-center justify-between text-sm text-gray-700 font-medium"
          >
            <span>Additional Options</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdditionalOptions ? 'rotate-180' : ''}`} />
          </button>

          {showAdditionalOptions && (
            <div className="mt-3 space-y-3">
              {/* Location Input */}
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-700 mb-1.5">
                  <MapPin className="w-4 h-4 text-teal-500" />
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Vingis Park, Vilnius"
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              {/* Poll Toggle */}
              <label className="flex items-center justify-between p-2 bg-white rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <div>
                    <span className="text-sm text-gray-900">Add a Poll</span>
                    <p className="text-xs text-gray-500">Let community vote on options</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasPoll}
                  onChange={(e) => setHasPoll(e.target.checked)}
                  className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-400"
                />
              </label>

              {/* Poll Creation */}
              {hasPoll && (
                <div className="p-3 bg-white rounded-xl border border-teal-200">
                  <div className="mb-3">
                    <label className="block text-sm text-gray-700 mb-1.5">Poll Question</label>
                    <input
                      type="text"
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      placeholder="What do you want to ask?"
                      className="w-full px-3 py-2 text-sm bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm text-gray-700 mb-1.5">Options (2-6)</label>
                    <div className="space-y-2">
                      {pollOptions.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updatePollOption(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 px-3 py-2 text-sm bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                          />
                          {pollOptions.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removePollOption(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {pollOptions.length < 6 && (
                      <button
                        type="button"
                        onClick={addPollOption}
                        className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Option
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Poll Duration</label>
                    <select
                      value={pollDuration}
                      onChange={(e) => setPollDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                      <option value={1}>1 day</option>
                      <option value={3}>3 days</option>
                      <option value={7}>7 days</option>
                      <option value={14}>14 days</option>
                      <option value={30}>30 days</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Media Upload */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-2xl cursor-pointer transition-colors text-sm">
              <Image className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">Add Images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-2xl cursor-pointer transition-colors text-sm">
              <Video className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">Add Video</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Image Previews */}
        {attachedImages.length > 0 && (
          <div className="mb-3 grid grid-cols-2 gap-2">
            {attachedImages.map((img, index) => (
              <div key={index} className="relative group rounded-xl overflow-hidden">
                <img src={img} alt={`Upload ${index + 1}`} className="w-full h-32 object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-gray-900/70 hover:bg-red-500 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Video Preview */}
        {attachedVideo && (
          <div className="mb-3 relative rounded-xl overflow-hidden">
            <video src={attachedVideo} controls className="w-full max-h-64 bg-black" />
            <button
              type="button"
              onClick={() => setAttachedVideo(null)}
              className="absolute top-2 right-2 p-1 bg-gray-900/70 hover:bg-red-500 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Guidelines */}
        <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100">
          <h4 className="text-sm text-teal-900 mb-1.5">Community Guidelines</h4>
          <ul className="text-xs text-teal-700 space-y-0.5">
            <li>• Be respectful and kind to all members</li>
            <li>• Share helpful and accurate information</li>
            <li>• No spam, self-promotion, promo codes, or ads</li>
            <li>• No profanity, hate speech, or inappropriate content</li>
            <li>• No nudity or explicit content in images/videos</li>
            <li>• Seek professional help for emergencies</li>
          </ul>
        </div>
        
        {/* Spam Protection Info */}
        <div className="mt-3 p-3 bg-purple-50 rounded-2xl border border-purple-100">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm text-purple-900 mb-1">Spam Protection</h4>
              <div className="text-xs text-purple-700 space-y-1">
                {restrictions.isTrusted ? (
                  <p className="text-[11px] bg-teal-100 border border-teal-200 rounded-lg px-2 py-1">
                    ✅ <strong>Patikimas vartotojas:</strong> Neturite apribojimų
                  </p>
                ) : (
                  <>
                    {restrictions.isNew && (
                      <p className="text-[11px] bg-yellow-100 border border-yellow-200 rounded-lg px-2 py-1 mb-1.5">
                        ⚠️ <strong>Naujas vartotojas:</strong> Turite apribojimus {7 - restrictions.accountAge} dienoms
                      </p>
                    )}
                    <p>• Dieninis limitas: <strong>{postCheck.postsToday || 0}/{restrictions.postLimit}</strong> įrašų</p>
                    {!postCheck.allowed && postCheck.cooldownSeconds && (
                      <p className="text-red-700">• Cooldown: <strong>{Math.ceil(postCheck.cooldownSeconds / 60)} min.</strong> liko</p>
                    )}
                    {restrictions.maxLinks === 0 ? (
                      <p>• Nuorodos: <strong>draudžiamos</strong> naujiems vartotojams</p>
                    ) : (
                      <p>• Nuorodos: iki <strong>{restrictions.maxLinks}</strong> per įrašą</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Health Disclaimer Modal */}
      <HealthDisclaimerModal
        isOpen={showHealthDisclaimer}
        onClose={() => setShowHealthDisclaimer(false)}
        onAccept={() => {
          setHealthDisclaimerAccepted(true);
          setShowHealthDisclaimer(false);
        }}
      />

      {/* Appeal Form Modal */}
      {showAppealForm && blockedContent && (
        <AppealForm
          blockedContent={blockedContent}
          onClose={() => setShowAppealForm(false)}
          onSubmit={() => {
            setShowAppealForm(false);
            onBack();
          }}
        />
      )}
    </div>
  );
}