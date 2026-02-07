import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';
import CreateActivityModal from '../components/CreateActivityModal';
import ActivityMap from '../components/ActivityMap';
import ActivityPinModal from '../components/ActivityPinModal';
import PointsDisplay from '../components/PointsDisplay';
import CompleteActivityModal from '../components/CompleteActivityModal';

function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [activityToComplete, setActivityToComplete] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const { joinUserRoom } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Join user's socket room for notifications
    joinUserRoom(user._id);
    
    fetchActivities();
    fetchUserStats();
  }, [user, authLoading, joinUserRoom]);

  const fetchUserStats = async () => {
    try {
      const res = await api.get('/points/my-stats');
      setUserStats(res.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await api.get('/activities');
      setActivities(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  const handleCreateActivity = async (activityData) => {
    try {
      await api.post('/activities', activityData);
      setShowModal(false);
      fetchActivities();
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  };

  const handlePinClick = (activity) => {
    setSelectedActivity(activity);
  };

  const handleCompleteActivity = (activity) => {
    setActivityToComplete(activity);
    setShowCompleteModal(true);
    setSelectedActivity(null);
  };

  const handleActivityCompletion = async (completionData) => {
    try {
      const res = await api.post('/points/complete-activity', completionData);
      alert(`🎉 Activity completed! You earned ${res.data.totalPoints} points!`);
      fetchUserStats(); // Refresh stats
      fetchActivities(); // Refresh activities
      setShowCompleteModal(false);
      setActivityToComplete(null);
    } catch (error) {
      console.error('Error completing activity:', error);
      throw error;
    }
  };


  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen w-screen fixed inset-0 overflow-hidden" style={{ backgroundColor: '#f4f1e8' }}>
      {/* Full Screen Ancient Map */}
      <div className="absolute inset-0 w-full h-full">
        <ActivityMap 
          activities={activities} 
          onPinClick={handlePinClick}
        />
      </div>

      {/* Points Display */}
      {userStats && (
        <PointsDisplay 
          points={userStats.points}
          level={userStats.level}
          discountTier={userStats.discountTier}
          completedActivities={userStats.completedActivities}
        />
      )}

      {/* Floating UI Elements */}
      <div className="relative z-10">
        {/* Top Right Corner - Actions */}
        <div className="absolute top-6 right-6 flex items-center gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-bold shadow-xl backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2 border border-green-500 border-opacity-30 hover:scale-105 w-40"
            style={{ fontFamily: 'serif' }}
          >
            <span className="text-xl">+</span>
            Post Activity
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-bold shadow-xl backdrop-blur-sm transition-all duration-300 border border-red-500 border-opacity-30 hover:scale-105 w-40"
            style={{ fontFamily: 'serif' }}
          >
            Logout
          </button>
        </div>


        {/* Bottom Left Corner - Legend (only show when there are activities) */}
        {activities.length > 0 && (
          <div className="absolute bottom-6 left-6 bg-gradient-to-r from-black from-opacity-80 to-black to-opacity-70 text-white p-5 rounded-xl backdrop-blur-md border border-yellow-600 border-opacity-20 shadow-xl">
            <div className="font-bold mb-4 text-sm" style={{ fontFamily: 'serif', letterSpacing: '1px' }}>Activity Legend</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 font-medium"><span className="text-lg">🛒</span> Grocery</div>
              <div className="flex items-center gap-2 font-medium"><span className="text-lg">🚶</span> Walk</div>
              <div className="flex items-center gap-2 font-medium"><span className="text-lg">🚗</span> Carpool</div>
              <div className="flex items-center gap-2 font-medium"><span className="text-lg">🛍️</span> Shopping</div>
              <div className="flex items-center gap-2 font-medium"><span className="text-lg">💪</span> Gym</div>
              <div className="flex items-center gap-2 font-medium"><span className="text-lg">🍽️</span> Dining</div>
            </div>
          </div>
        )}

      </div>

      {/* Create Activity Modal */}
      {showModal && (
        <CreateActivityModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateActivity}
        />
      )}

      {/* Activity Pin Modal */}
      {selectedActivity && (
        <ActivityPinModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onComplete={handleCompleteActivity}
          currentUser={user}
        />
      )}

      {/* Complete Activity Modal */}
      {showCompleteModal && activityToComplete && (
        <CompleteActivityModal
          activity={activityToComplete}
          onClose={() => {
            setShowCompleteModal(false);
            setActivityToComplete(null);
          }}
          onComplete={handleActivityCompletion}
        />
      )}
    </div>
  );
}

export default Dashboard;

