const io = require('socket.io')(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

console.log('Socket.io server running on port 3001');


const activeChats = new Map();
const messageHistory = new Map(); 

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  
  socket.on('join_support', (data) => {
    const roomId = data.roomId || data.userId || socket.id;
    socket.join(roomId);
    console.log(`User/Admin joined room: ${roomId}`);
    
    
    if (messageHistory.has(roomId)) {
      socket.emit('chat_history', { 
        roomId: roomId, 
        messages: messageHistory.get(roomId) 
      });
    }

    
    if (data.isAdmin) {
      socket.isAdmin = true;
      socket.join('admins');
      console.log(`Admin joined admin room: ${socket.id}`);
      
      
      const activeRoomIds = Array.from(messageHistory.keys()).filter(id => {
        const history = messageHistory.get(id);
        return history.some(m => m.sender === 'user');
      });

      socket.emit('admin_all_active_chats', activeRoomIds.map(id => ({
        roomId: id,
        lastMessage: messageHistory.get(id).slice(-1)[0]?.text || 'Active session'
      })));
    } else {
      
      io.to('admins').emit('admin_user_online', { socketId: socket.id, userId: roomId });
    }
  });

  
  socket.on('chat_message', (data) => {
    const roomId = data.roomId || socket.id;
    const sender = data.sender || 'user';
    
    const message = {
      sender: sender,
      text: data.text,
      time: new Date(),
      roomId: roomId
    };

    
    if (!messageHistory.has(roomId)) {
      messageHistory.set(roomId, []);
    }
    const history = messageHistory.get(roomId);
    history.push(message);
    if (history.length > 50) history.shift(); 

    
    socket.to(roomId).emit('message', message);

    
    if (data.targetId) {
      console.log(`Sending notification to user: notifications_${data.targetId}`);
      io.to(`notifications_${data.targetId}`).emit('new_notification', {
        type: 'chat_message',
        sender: sender,
        text: data.text,
        roomId: roomId
      });
    }

    
    if (sender === 'user') {
      io.to('admins').emit('message', message); 
      io.to('admins').emit('admin_notification', {
        type: 'chat',
        title: 'New Support Message',
        message: data.text.substring(0, 50) + '...',
        roomId: roomId
      });
    }
  });

  
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
