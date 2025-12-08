"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft, Activity, TrendingUp, Clock, CheckCircle,
  X, Image as ImageIcon, AlertCircle, History, Upload, Eye
} from "lucide-react";
import { useParams } from "next/navigation";

import { ADMIN_SERVICE } from "@/service/APIs/admin.api";

interface PendingRequest {
  id: string;
  newCount: number;
  uploadedImage: string;
  uploadedAt: string;
  status: string;
  note: string;
}

interface CountHistory {
  date: string;
  count: number;
  approved: boolean;
  approvedBy: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  currentCount: number;
  weeklyLimit: number;
  previousCount: number;
  status: string;
  joinedDate: string;
  lastUpdated: string;
  weeklyLimitPic: string[];
  pendingRequest: PendingRequest | null;
  countHistory: CountHistory[];
}

interface Props {
  params: {
    userId: string; // MUST match folder name
  };
}

export default function UserDetails({ params }: Props) {

  const urlParams = useParams();
  const userId = urlParams?.userId as string;
  console.log("Fetched User ID:", userId);

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (userId) fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const res = await ADMIN_SERVICE.GETUSER<UserData>(userId);

      if (res?.success) {
        console.log(res.data)
        setUser(res.data || null);
      } else {
        setError("Unable to load user details");
      }
    } catch (err: any) {
      setError("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const calculateDifference = () => {
    if (!user) return 0;
    return user.currentCount - user.previousCount;
  };

  const calculateProgress = () => {
    if (!user) return 0;
    return Math.min((user.currentCount / user.weeklyLimit) * 100, 100);
  };

  const viewImage = (img: string) => {
    setModalImage(img);
    setShowImageModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading User...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  const difference = calculateDifference();
  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            // onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Weekly Progress</h1>
              <p className="text-sm text-gray-500 mt-1">Review and approve count updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-24"></div>
              <div className="px-6 pb-6">
                <div className="flex flex-col items-center -mt-12">
                  <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-3xl font-bold text-blue-600">
                        {user.name}
                      </span>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${user.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {user.status}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Joined Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date(user.joinedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium text-gray-900">
                      {new Date(user.lastUpdated).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Weekly Limit Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Current Limit Image</h3>
                <ImageIcon className="w-5 h-5 text-gray-400" />
              </div>

              {user.weeklyLimitPic?.length > 0 ? (
                <div
                  className="relative rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() =>
                    viewImage(user.weeklyLimitPic[user.weeklyLimitPic.length - 1])
                  }
                >
                  <img
                    src={user.weeklyLimitPic[user.weeklyLimitPic.length - 1]}
                    alt="Weekly limit"
                    className="w-full h-48 object-cover"
                  />

                  <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                  <p className="text-gray-500 text-sm">No images available</p>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">Click to view full size</p>
            </div>
          </div>

          {/* Right Column - Stats & Requests */}
          <div className="lg:col-span-2 space-y-6">
            {/* Count Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Current Count</p>
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{user.currentCount}</p>
                <p className="text-xs text-gray-500 mt-1">of {user.weeklyLimit} limit</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Previous Count</p>
                  <History className="w-5 h-5 text-gray-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{user.previousCount}</p>
                <p className="text-xs text-gray-500 mt-1">Last week's total</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Difference</p>
                  <TrendingUp className={`w-5 h-5 ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <p className={`text-3xl font-bold ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {difference >= 0 ? '+' : ''}{difference}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {difference >= 0 ? 'Increased' : 'Decreased'} from last week
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Weekly Progress</h3>
                <span className="text-sm font-medium text-gray-600">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${progress >= 100 ? 'bg-green-600' : progress >= 75 ? 'bg-blue-600' : 'bg-blue-400'
                    }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                <span>0</span>
                <span>{user.weeklyLimit}</span>
              </div>
            </div>

            {/* Pending Request */}
            {user.pendingRequest && (
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl shadow-sm border-2 border-orange-200 overflow-hidden">
                <div className="bg-orange-600 px-6 py-3 flex items-center gap-3">
                  <Upload className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-semibold text-white">Pending Approval Request</h3>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Request Details */}
                    <div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Requested Count Update</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">{user.currentCount}</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-2xl font-bold text-orange-600">{user.pendingRequest.newCount}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Change: <span className={`font-semibold ${user.pendingRequest.newCount > user.currentCount ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {user.pendingRequest.newCount > user.currentCount ? '+' : ''}
                              {user.pendingRequest.newCount - user.currentCount}
                            </span>
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-1">Uploaded At</p>
                          <div className="flex items-center gap-2 text-gray-900">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {new Date(user.pendingRequest.uploadedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>

                        {user.pendingRequest.note && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Note</p>
                            <p className="text-sm text-gray-900 bg-white rounded-lg p-3 border border-gray-200">
                              {user.pendingRequest.note}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Uploaded Image */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Uploaded Image</p>
                      <div
                        className="relative rounded-lg overflow-hidden cursor-pointer group border-2 border-orange-300"
                        onClick={() => viewImage(user.pendingRequest!.uploadedImage)}
                      >
                        <img
                          src={user.pendingRequest.uploadedImage}
                          alt="Pending request"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                          <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Click to view full size</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button
                      // onClick={handleApprove}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {actionLoading ? "Approving..." : "Approve Request"}
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-semibold"
                    >
                      <X className="w-5 h-5" />
                      Reject Request
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!user.pendingRequest && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Pending Requests</h3>
                <p className="text-sm text-gray-500">All updates have been processed</p>
              </div>
            )}

            {/* Count History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Count History</h3>
                <p className="text-sm text-gray-500 mt-1">Previous approved updates</p>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {user.countHistory?.map((history, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Count: {history.count}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(history.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Approved by</p>
                        <p className="text-sm font-medium text-gray-900">{history.approvedBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={modalImage}
              alt="Full size"
              className="w-full h-auto rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Reject Request</h3>
            </div>

            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this count update request.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
              rows={4}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                // onClick={handleReject}
                disabled={actionLoading || !rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
