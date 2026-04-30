const io = require('socket.io')(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

console.log('Socket.io server running on port 3001');

// Keep track of active chat sessions and history
const activeChats = new Map();
const messageHistory = new Map(); // roomId -> messages[]

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // User joins a support chat
  socket.on('join_support', (data) => {
    const roomId = data.userId || data.roomId || socket.id;
    socket.join(roomId);
    console.log(`User/Admin joined room: ${roomId}`);
    
    // If it's an admin (or someone just wanting history)
    if (messageHistory.has(roomId)) {
      socket.emit('chat_history', { 
        roomId: roomId, 
        messages: messageHistory.get(roomId) 
      });
    }

    // Special case: Admin joining the dashboard
    if (data.isAdmin) {
      socket.isAdmin = true;
      socket.join('admins');
      console.log(`Admin joined admin room: ${socket.id}`);
      
      // Send all existing roomIds from history to the admin
      const activeRoomIds = Array.from(messageHistory.keys()).filter(id => {
        const history = messageHistory.get(id);
        return history.some(m => m.sender === 'user');
      });

      socket.emit('admin_all_active_chats', activeRoomIds.map(id => ({
        roomId: id,
        lastMessage: messageHistory.get(id).slice(-1)[0]?.text || 'Active session'
      })));
    } else {
      // Notify admins a new user is online
      io.to('admins').emit('admin_user_online', { socketId: socket.id, userId: roomId });
    }
  });

  // Relay messages between user and admin
  socket.on('chat_message', (data) => {
    const roomId = data.roomId || socket.id;
    const sender = data.sender || 'user';
    
    const message = {
      sender: sender,
      text: data.text,
      time: new Date(),
      roomId: roomId
    };

    // Store in history
    if (!messageHistory.has(roomId)) {
      messageHistory.set(roomId, []);
    }
    const history = messageHistory.get(roomId);
    history.push(message);
    if (history.length > 50) history.shift(); // Keep last 50

    // Broadcast to others in the specific room (e.g. the specific user or the admin handling this room)
    socket.to(roomId).emit('message', message);

    // Notify the target user if targetId is provided
    if (data.targetId) {
      console.log(`Sending notification to user: notifications_${data.targetId}`);
      io.to(`notifications_${data.targetId}`).emit('new_notification', {
        type: 'chat_message',
        sender: sender,
        text: data.text,
        roomId: roomId
      });
    }

    // If it's a user message, notify all admins and send the message to the admins room
    if (sender === 'user') {
      io.to('admins').emit('message', message); // Ensure all admins get the message for their sidebars
      io.to('admins').emit('admin_notification', {
        type: 'chat',
        title: 'New Support Message',
        message: data.text.substring(0, 50) + '...',
        roomId: roomId
      });
    }
  });

  // Join notifications room
  socket.on('join_notifications', (data) => {
    if (data.userId) {
      socket.join(`notifications_${data.userId}`);
      console.log(`User joined notifications room: notifications_${data.userId}`);
    }
  });


  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
  });
});
