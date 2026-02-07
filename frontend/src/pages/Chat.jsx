import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';

function Chat() {
  const { activityId, userId } = useParams();
  const { user } = useContext(AuthContext);
  const { socket, sendMessage } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activity, setActivity] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [requestStatus, setRequestStatus] = useState('pending'); // pending, accepted, declined
  const [requestType, setRequestType] = useState('chat'); // chat, join
  const [loading, setLoading] = useState(true);
  const [initialMessageAdded, setInitialMessageAdded] = useState(false);
  
  // Get request type from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const type = urlParams.get('type') || 'chat';
    setRequestType(type);
  }, [location.search]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Reset initial message flag when parameters change
    setInitialMessageAdded(false);
    fetchActivityAndUser();
  }, [activityId, userId, user]);

  useEffect(() => {
    if (socket && userId) {
      // Listen for new messages
      const handleNewMessage = (data) => {
        if (data.fromUser._id === userId) {
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: data.message,
            sender: 'other',
            timestamp: data.timestamp
          }]);
        }
      };

      // Listen for request responses
      const handleRequestResponse = (data) => {
        if (data.fromUser._id === userId) {
          setRequestStatus(data.response);
          if (data.response === 'accepted') {
            addSystemMessage(`${otherUser?.name || 'User'} has accepted your ${requestType} request! You can now chat freely.`);
          } else if (data.response === 'declined') {
            addSystemMessage(`${otherUser?.name || 'User'} has declined your ${requestType} request.`);
          }
        }
      };

      socket.on('new-message', handleNewMessage);
      socket.on('request-response', handleRequestResponse);

      return () => {
        socket.off('new-message', handleNewMessage);
        socket.off('request-response', handleRequestResponse);
      };
    }
  }, [socket, userId, otherUser?.name, requestType]);

  const fetchActivityAndUser = async () => {
    try {
      const activityRes = await api.get(`/activities/${activityId}`);
      setActivity(activityRes.data);
      
      // Determine if this is the activity creator or a requester
      if (activityRes.data.user._id === user._id) {
        // User is the activity creator, get the requester info
        const userRes = await api.get(`/auth/user/${userId}`);
        setOtherUser(userRes.data);
      } else {
        // User is the requester, get the activity creator info
        setOtherUser(activityRes.data.user);
      }
      
      // Add initial system message only once
      if (!initialMessageAdded) {
        const initialMessage = requestType === 'chat' 
          ? `Chat request sent to ${activityRes.data.user._id === user._id ? 'requester' : activityRes.data.user.name}. Waiting for response...`
          : `Join request sent to ${activityRes.data.user._id === user._id ? 'requester' : activityRes.data.user.name}. Waiting for response...`;
        
        addSystemMessage(initialMessage);
        setInitialMessageAdded(true);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activity/user:', error);
      setLoading(false);
    }
  };

  const addSystemMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender: 'system',
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && requestStatus === 'accepted') {
      const messageData = {
        id: Date.now(),
        text: newMessage.trim(),
        sender: 'me',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, messageData]);
      sendMessage(userId, newMessage.trim(), user);
      setNewMessage('');
    }
  };

  const handleAcceptRequest = async () => {
    if (socket) {
      socket.emit('respond-to-request', {
        fromUser: user._id,
        toUser: userId,
        activity,
        response: 'accepted'
      });
      setRequestStatus('accepted');
      addSystemMessage(`You have accepted the ${requestType} request. Chat is now open!`);
      
      // Award points for accepting the request
      try {
        const response = await api.post('/points/accept-request', {
          activityId: activity._id,
          requesterId: userId
        });
        if (response.data) {
          addSystemMessage(`🎉 Both users earned ${response.data.creator.pointsAdded} points for connecting!`);
        }
      } catch (error) {
        console.error('Error awarding points:', error);
      }
    }
  };

  const handleDeclineRequest = () => {
    if (socket) {
      socket.emit('respond-to-request', {
        fromUser: user._id,
        toUser: userId,
        activity,
        response: 'declined'
      });
      setRequestStatus('declined');
      addSystemMessage(`You have declined the ${requestType} request.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-amber-600 hover:text-amber-700 text-xl"
              >
                ←
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                  Chat with {otherUser?.name}
                </h1>
                <p className="text-sm text-gray-500">{activity?.title}</p>
              </div>
            </div>
            
            {/* Request Status Badge */}
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              requestStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              requestStatus === 'accepted' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {requestStatus === 'pending' ? '⏳ Pending' :
               requestStatus === 'accepted' ? '✅ Accepted' :
               '❌ Declined'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Activity Context Card */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {activity?.category === 'grocery' ? '🛒' :
               activity?.category === 'walk' ? '🚶' :
               activity?.category === 'carpool' ? '🚗' :
               activity?.category === 'shopping' ? '🛍️' :
               activity?.category === 'gym' ? '💪' :
               activity?.category === 'dining' ? '🍽️' : '📍'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{activity?.title}</h3>
              <p className="text-sm text-gray-500">📍 {activity?.location}</p>
              <p className="text-sm text-gray-500">
                🕒 {activity?.isImmediate ? 'Right Now!' : new Date(activity?.scheduledTime).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === 'me'
                      ? 'bg-amber-500 text-white'
                      : message.sender === 'system'
                      ? 'bg-gray-100 text-gray-600 text-center mx-auto'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'me' ? 'text-amber-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Request Actions (for activity creators) */}
          {requestStatus === 'pending' && user._id === activity?.user._id && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="text-center mb-3">
                <p className="text-sm text-gray-600">
                  {otherUser?.name} wants to {requestType} about this activity
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleAcceptRequest}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={handleDeclineRequest}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          )}

          {/* Message Input */}
          {requestStatus === 'accepted' && (
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={requestStatus !== 'accepted'}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || requestStatus !== 'accepted'}
                  className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
