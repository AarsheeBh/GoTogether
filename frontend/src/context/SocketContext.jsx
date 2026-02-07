import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    
    newSocket.on('connect', () => {
      console.log('🔌 Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from server');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinUserRoom = (userId) => {
    if (socket) {
      socket.emit('join-user', userId);
    }
  };

  const sendChatRequest = (fromUser, toUser, activity, requestType) => {
    if (socket) {
      socket.emit('send-chat-request', {
        fromUser,
        toUser,
        activity,
        requestType
      });
    }
  };

  const respondToRequest = (fromUser, toUser, activity, response) => {
    if (socket) {
      socket.emit('respond-to-request', {
        fromUser,
        toUser,
        activity,
        response
      });
    }
  };

  const sendMessage = (toUser, message, fromUser) => {
    if (socket) {
      socket.emit('send-message', {
        toUser,
        message,
        fromUser
      });
    }
  };

  const value = {
    socket,
    isConnected,
    joinUserRoom,
    sendChatRequest,
    respondToRequest,
    sendMessage
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

