import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { nanoid } from 'nanoid';
import { isAuthenticated } from '../auth';
import type { IStorage } from '../storage';

export function setupImageRoutes(app: Router, storage: IStorage, connectedClients: Map<any, string>) {
  // Configure multer for image uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
      }
    },
  });

  // Image message endpoint
  app.post('/api/chat/messages/image', isAuthenticated, upload.single('image'), async (req: any, res) => {
    try {
      const senderId = req.user.id;
      const { receiverId, content = '' } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Convert image to base64 data URL for simple storage
      const imageData = req.file.buffer.toString('base64');
      const imageUrl = `data:${req.file.mimetype};base64,${imageData}`;

      // Create message with image
      const messageData = {
        receiverId,
        content,
        messageType: 'image' as const,
        imageUrl
      };

      // Ensure chat room exists
      await storage.getOrCreateChatRoom(senderId, receiverId);
      
      const message = await storage.sendMessage(senderId, messageData);
      console.log(`Image message sent from ${senderId} to ${receiverId}`);
      
      // Broadcast to WebSocket clients
      const notifyUsers = [senderId, receiverId];
      for (const [socket, userId] of connectedClients.entries()) {
        if (notifyUsers.includes(userId) && socket.readyState === 1) {
          socket.send(JSON.stringify({
            type: 'new_message',
            message: message,
            senderId: senderId,
            receiverId: receiverId
          }));
        }
      }
      
      res.json(message);
    } catch (error) {
      console.error('Error sending image message:', error);
      res.status(500).json({ message: 'Failed to send image message' });
    }
  });

  return app;
}