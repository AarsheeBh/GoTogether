import { formatDistanceToNow } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

function ActivityPinModal({ activity, onClose, onComplete, currentUser }) {
  if (!activity) return null;

  const navigate = useNavigate();
  const { sendChatRequest, joinUserRoom } = useSocket();
  const isOwn = activity.user._id === currentUser._id;

  const categoryColors = {
    grocery: 'bg-blue-100 text-blue-800',
    walk: 'bg-green-100 text-green-800',
    carpool: 'bg-purple-100 text-purple-800',
    errands: 'bg-yellow-100 text-yellow-800',
    shopping: 'bg-pink-100 text-pink-800',
    gym: 'bg-red-100 text-red-800',
    dining: 'bg-orange-100 text-orange-800',
    other: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Activity Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {activity.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {activity.user.name}
                  {isOwn && <span className="text-sm text-blue-500 ml-2">(You)</span>}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(activity.createdAt)}
                </p>
              </div>
            </div>

            {/* Activity Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-800">{activity.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[activity.category]}`}>
                  {activity.category}
                </span>
              </div>
              
              {activity.description && (
                <p className="text-gray-600 mb-4">{activity.description}</p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold mr-2">📍 Location:</span>
                  {activity.location}
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold mr-2">🕒 When:</span>
                  {activity.isImmediate ? (
                    <span className="text-green-600 font-semibold">Right Now!</span>
                  ) : (
                    new Date(activity.scheduledTime).toLocaleString()
                  )}
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold mr-2">👥 Looking for:</span>
                  {activity.companionsNeeded} companion{activity.companionsNeeded > 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* User Profile Info */}
            {activity.user.age && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-1">About {activity.user.name}</h4>
                <div className="text-sm text-blue-700">
                  {activity.user.age && <span>Age: {activity.user.age} • </span>}
                  {activity.user.gender && <span>Gender: {activity.user.gender}</span>}
                </div>
              </div>
            )}

            {/* Actions */}
            {!isOwn ? (
              <div className="space-y-3">
                {/* Connect/Chat Button */}
                <button
                  onClick={() => {
                    // Send chat request and navigate to chat
                    sendChatRequest(currentUser._id, activity.user._id, activity, 'chat');
                    navigate(`/chat/${activity._id}/${activity.user._id}?type=chat`);
                    onClose();
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  Connect & Chat
                </button>
                
                {/* Join Activity Button */}
                <button
                  onClick={() => {
                    // Send join request and navigate to chat
                    sendChatRequest(currentUser._id, activity.user._id, activity, 'join');
                    navigate(`/chat/${activity._id}/${activity.user._id}?type=join`);
                    onClose();
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  <span>🤝</span>
                  Join Activity
                </button>
                
                {/* Quick Info */}
                <div className="text-center text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                  <p><strong>💬 Connect:</strong> Chat for details about location, timing, etc.</p>
                  <p><strong>🤝 Join:</strong> Confirm you're participating in this activity</p>
                </div>
              </div>
            ) : (
              <div>
                {/* Complete Activity Button - For activity creator */}
                <button
                  onClick={() => {
                    onComplete(activity);
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <span className="text-xl">✓</span>
                  Complete Activity & Earn Points
                </button>
                <div className="text-center text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg mt-3 border border-yellow-200">
                  <p className="font-medium text-yellow-800 mb-1">🎉 Earn 50 Points!</p>
                  <p>Upload a photo or video to complete this activity</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityPinModal;
