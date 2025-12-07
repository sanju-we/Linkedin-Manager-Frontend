"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ExternalLink, Calendar, Shield, Loader2, Plus, Upload, TrendingUp, TrendingDown, Save } from "lucide-react";
import { USER_SERVICE } from "@/service/APIs/user.api";
import { UserData } from "@/types";
import { formatDate, getInitials, getRoleBadgeColor, isFriday, formatGrowth } from "@/lib/utils";
import ImageUploadModal from "@/components/ImageUploadModal";
import toast from "react-hot-toast";

const getUserProfile = async () => {
  const user = await USER_SERVICE.GETPROFILE();
  if (process.env.NODE_ENV === 'development') {
    console.log('User profile data:', user?.data);
  }
  return user?.data;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [updatingCount, setUpdatingCount] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [countInput, setCountInput] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Update count input when user data changes
  useEffect(() => {
    if (user) {
      setCountInput(user.currentCount?.toString() || "0");
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUserProfile();
      setUser(data as UserData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCount = async () => {
    const newCount = parseInt(countInput, 10);
    
    // Validate input
    if (isNaN(newCount) || newCount < 0) {
      toast.error("Please enter a valid number (0 or greater)");
      return;
    }

    // Check if it's Friday (if you want to keep this restriction)
    // if (!isFriday()) {
    //   toast.error("Count can only be updated on Fridays");
    //   return;
    // }

    setUpdatingCount(true);
    try {
      const response = await USER_SERVICE.UPDATE_COUNT(newCount);
      if (response?.success && response.data) {
        // Optimistic update
        setUser((prev) => prev ? { ...prev, ...response.data } : null);
        toast.success("Count updated successfully!");
      } else {
        toast.error("Failed to update count");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update count");
    } finally {
      setUpdatingCount(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      console.log('Uploading image');
      console.log(`file = ${JSON.stringify(file)}`);
      const response = await USER_SERVICE.UPLOAD_IMAGE(file);
      if (response?.success && response.data) {
        // Optimistic update - add new image to the array
        setUser((prev) => {
          if (!prev) return null;
          const newImages = [...(prev.weeklyLimitPic || []), response.data?.weeklyLimitPic?.[response.data.weeklyLimitPic.length - 1] || ''].filter(Boolean);
          return { ...prev, weeklyLimitPic: newImages, ...response.data };
        });
        toast.success("Image uploaded successfully!");
        return response.data.weeklyLimitPic?.[response.data.weeklyLimitPic.length - 1] || null;
      } else {
        toast.error("Failed to upload image");
        return null;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const growthData = formatGrowth(user?.growth);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Card */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          
          {/* Profile Content */}
          <div className="px-6 md:px-8 pb-8">
            
            {/* Avatar and Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center border-4 border-white shadow-xl">
                  <span className="text-4xl font-bold text-white">
                    {getInitials(user.name)}
                  </span>
                </div>
                <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold border-2 shadow-md ${getRoleBadgeColor(user.role)}`}>
                  <div className="flex items-center gap-1">
                    <Shield size={12} />
                    {user.role.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 capitalize">{user.name}</h1>
                {user.profile ? (
                  <p className="text-gray-600 mt-2 text-lg">{user.profile}</p>
                ) : (
                  <p className="text-gray-400 mt-2 text-sm italic">No bio added yet</p>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              
              {/* Current Count Card */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-600 font-medium text-sm mb-1">Current Count</p>
                    <p className="text-4xl font-bold text-blue-600">{user.currentCount || 0}</p>
                  </div>
                  <div className="bg-blue-200 p-4 rounded-2xl">
                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="countInput" className="block text-sm font-medium text-gray-700 mb-2">
                      Update Count
                    </label>
                    <input
                      id="countInput"
                      type="number"
                      min="0"
                      value={countInput}
                      onChange={(e) => setCountInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateCount();
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder="Enter count"
                      disabled={updatingCount}
                    />
                  </div>
                  <button
                    onClick={handleUpdateCount}
                    disabled={updatingCount || countInput === (user.currentCount?.toString() || "0")}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {updatingCount ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Update Count
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Growth Card */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-medium text-sm mb-1">Growth</p>
                    <div className="flex items-center gap-2">
                      <p className={`text-4xl font-bold ${growthData.color}`}>
                        {growthData.value}
                      </p>
                      {growthData.isPositive ? (
                        <TrendingUp size={24} className="text-green-600" />
                      ) : (
                        <TrendingDown size={24} className="text-red-600" />
                      )}
                    </div>
                  </div>
                  <div className="bg-green-200 p-4 rounded-2xl">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Weekly Pictures Count Card */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-600 font-medium text-sm mb-1">Weekly Pictures</p>
                    <p className="text-4xl font-bold text-purple-600">{user.weeklyLimitPic?.length || 0}</p>
                  </div>
                  <div className="bg-purple-200 p-4 rounded-2xl">
                    <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={18} />
                  Upload Image
                </button>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-4">
              
              {/* Linked Account */}
              {user.linkedAcc && (
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 font-semibold mb-1">LinkedIn Profile</p>
                      <a
                        href={user.linkedAcc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors text-sm break-all"
                      >
                        {user.linkedAcc.replace('https://', '')}
                        <ExternalLink size={16} className="flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Information */}
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="text-gray-700 font-semibold text-lg mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={18} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500">Member since:</span>
                      <span className="text-gray-900 font-medium ml-2">{formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={18} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500">Last updated:</span>
                      <span className="text-gray-900 font-medium ml-2">{formatDate(user.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Pictures Gallery */}
            <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Weekly Pictures
                  {user.weeklyLimitPic && user.weeklyLimitPic.length > 0 && (
                    <span className="text-sm font-normal text-gray-500">({user.weeklyLimitPic.length})</span>
                  )}
                </h3>
              </div>
              {user.weeklyLimitPic && user.weeklyLimitPic.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {user.weeklyLimitPic.map((pic, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105">
                      <Image
                        src={pic}
                        fill
                        alt={`Weekly picture ${index + 1}`}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                  <p>No images uploaded yet</p>
                  <p className="text-sm mt-2">Click "Upload Image" to add your first weekly picture</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleImageUpload}
        existingImages={user.weeklyLimitPic || []}
      />
    </div>
  );
}
