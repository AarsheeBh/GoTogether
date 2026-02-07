import { formatDistanceToNow } from '../utils/helpers';

function ActivityCard({ activity, currentUser }) {
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
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
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
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[activity.category]}`}>
          {activity.category}
        </span>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-2">{activity.title}</h2>
      
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

      {!isOwn && (
        <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200">
          Join Activity
        </button>
      )}
    </div>
  );
}

export default ActivityCard;

