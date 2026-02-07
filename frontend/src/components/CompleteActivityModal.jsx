import React, { useState } from 'react';

function CompleteActivityModal({ activity, onClose, onComplete }) {
  const [proofType, setProofType] = useState('photo');
  const [proofFile, setProofFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = proofType === 'photo' 
      ? ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      : ['video/mp4', 'video/quicktime', 'video/webm'];

    if (!validTypes.includes(file.type)) {
      alert(`Please select a valid ${proofType} file`);
      return;
    }

    setProofFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!proofFile) {
      alert('Please upload a photo or video');
      return;
    }

    setUploading(true);

    // For now, we'll use the base64 preview as proofMedia
    // In production, you'd upload to a storage service (AWS S3, Cloudinary, etc.)
    const proofMedia = preview;

    try {
      await onComplete({
        activityId: activity._id,
        proofMedia,
        proofType
      });
      onClose();
    } catch (error) {
      console.error('Error completing activity:', error);
      alert('Failed to complete activity. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div 
        className="rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(145deg, rgba(26, 15, 10, 0.98) 0%, rgba(44, 24, 16, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(139, 69, 19, 0.4)',
          boxShadow: `
            0 25px 50px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(218, 165, 32, 0.2)
          `
        }}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(145deg, #FFD700 0%, #FFA500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Georgia, serif'
              }}
            >
              Complete Activity
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-3xl"
            >
              ×
            </button>
          </div>

          {/* Activity Info */}
          <div 
            className="mb-6 p-4 rounded-xl"
            style={{
              background: 'rgba(139, 69, 19, 0.2)',
              border: '1px solid rgba(139, 69, 19, 0.3)'
            }}
          >
            <div className="text-lg font-semibold text-yellow-600 mb-1">
              {activity.title}
            </div>
            <div className="text-sm text-gray-400">
              📍 {activity.location}
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6 text-center">
            <p className="text-gray-300 text-sm mb-2">
              Upload a photo or video to prove you completed this activity and earn
            </p>
            <div 
              className="inline-block text-3xl font-bold"
              style={{
                background: 'linear-gradient(145deg, #FFD700 0%, #FFA500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              50 Points! 🎉
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Proof Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Proof Type
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setProofType('photo');
                    setProofFile(null);
                    setPreview(null);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    proofType === 'photo'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  📷 Photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProofType('video');
                    setProofFile(null);
                    setPreview(null);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    proofType === 'video'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  🎥 Video
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label 
                className="block w-full cursor-pointer"
                style={{
                  background: 'rgba(139, 69, 19, 0.3)',
                  border: '2px dashed rgba(139, 69, 19, 0.5)',
                  borderRadius: '12px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 69, 19, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(218, 165, 32, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 69, 19, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(139, 69, 19, 0.5)';
                }}
              >
                <input
                  type="file"
                  accept={proofType === 'photo' ? 'image/*' : 'video/*'}
                  onChange={handleFileChange}
                  className="hidden"
                />
                {preview ? (
                  <div>
                    {proofType === 'photo' ? (
                      <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                    ) : (
                      <video src={preview} controls className="max-h-48 mx-auto rounded-lg" />
                    )}
                    <p className="text-sm text-gray-400 mt-3">Click to change {proofType}</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-5xl mb-3">{proofType === 'photo' ? '📸' : '🎬'}</div>
                    <p className="text-gray-300 font-medium">
                      Click to upload {proofType}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {proofType === 'photo' ? 'PNG, JPG, GIF up to 10MB' : 'MP4, MOV, WEBM up to 50MB'}
                    </p>
                  </div>
                )}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!proofFile || uploading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                proofFile && !uploading
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {uploading ? 'Uploading...' : '✓ Complete & Earn Points'}
            </button>
          </form>
        </div>

        {/* Decorative Corners */}
        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-yellow-600 opacity-40 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-yellow-600 opacity-40 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-yellow-600 opacity-40 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-yellow-600 opacity-40 rounded-br-lg" />
      </div>
    </div>
  );
}

export default CompleteActivityModal;


