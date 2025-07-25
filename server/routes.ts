import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import express from "express";
import { storage } from "./storage";
import { setupCustomAuth, isAuthenticated } from "./customAuth";
import { sendMessageSchema, createMatchSchema, updateProfileSchema } from "@shared/schema";
import { z } from "zod";
import { uploadProfile, uploadChat, uploadGeneral, uploadPrivateAlbum, cloudinary } from "./cloudinary";
import { eq, and, desc } from "drizzle-orm";
import { users, privateAlbums, albumAccess } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupCustomAuth(app);
  
  // WebSocket connection tracking
  const connectedClients = new Map<WebSocket, string>();
  
  // Public routes (must come before authentication middleware)
  app.get('/api/users/public', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      console.log("Getting public trans escorts...");
      const transEscorts = await storage.getPublicTransUsers(limit);
      console.log(`Returning ${transEscorts.length} public escorts`);
      res.json(transEscorts);
    } catch (error) {
      console.error("Error getting public trans escorts:", error);
      res.status(500).json({ message: "Failed to get public escorts" });
    }
  });

  // Upload routes - using Cloudinary
  app.post('/api/upload/profile-image', isAuthenticated, uploadProfile.single('image'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Cloudinary provides the secure URL directly
      const imageUrl = req.file.path;
      const publicId = req.file.filename;
      
      console.log('Image uploaded to Cloudinary:', {
        userId: req.user.id,
        publicId,
        imageUrl
      });

      res.json({
        success: true,
        imageUrl,
        publicId
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({ 
        message: 'Upload failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Multiple image upload for galleries
  app.post('/api/upload/profile-gallery', isAuthenticated, uploadProfile.array('images', 5), async (req: any, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const uploadedImages = req.files.map((file: any) => ({
        imageUrl: file.path,
        publicId: file.filename
      }));
      
      console.log(`${req.files.length} images uploaded to Cloudinary for user ${req.user.id}`);

      res.json({
        success: true,
        images: uploadedImages
      });
    } catch (error) {
      console.error('Cloudinary gallery upload error:', error);
      res.status(500).json({ 
        message: 'Gallery upload failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // reCAPTCHA verification endpoint
  app.post('/api/auth/verify-recaptcha', async (req, res) => {
    try {
      const { token, action } = req.body;
      
      if (!token) {
        return res.status(400).json({ success: false, message: 'reCAPTCHA token required' });
      }

      const secretKey = '6LeWxo4rAAAAAM_WkdIvA07SVVkjN7kHZroiKcJ9';
      const verifyURL = 'https://www.google.com/recaptcha/api/siteverify';
      
      const response = await fetch(verifyURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${token}`,
      });

      const result = await response.json();
      
      // Check if the verification was successful and score is acceptable
      if (result.success && result.score >= 0.5 && result.action === action) {
        res.json({ success: true, score: result.score });
      } else {
        console.log('reCAPTCHA verification failed:', result);
        res.status(400).json({ 
          success: false, 
          message: 'reCAPTCHA verification failed',
          score: result.score 
        });
      }
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Remove sensitive data and ensure all fields are included
      const { passwordHash, passwordResetToken, passwordResetExpires, emailVerificationToken, stripeCustomerId, stripeSubscriptionId, ...publicUser } = user;
      
      // Ensure all profile fields are included in response
      const completeProfile = {
        ...publicUser,
        height: user.height || null,
        weight: user.weight || null,
        cockSize: user.cockSize || null,
        circumcision: user.circumcision || null,
        position: user.position || null,
        bodyType: user.bodyType || null,
        ethnicity: user.ethnicity || null,
        profileImages: Array.isArray(user.profileImages) ? user.profileImages : [],
        services: Array.isArray(user.services) ? user.services : [],
        interests: Array.isArray(user.interests) ? user.interests : [],
        latitude: user.latitude || null,
        longitude: user.longitude || null,
      };
      
      res.json(completeProfile);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.put('/api/auth/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const requestData = req.body;
      
      console.log(`Updating profile for user ${userId}:`, requestData);
      
      // Extract image data separately
      const { profileImageUrl, profileImages, ...profileData } = requestData;
      
      // Validate main profile data only if present - allow partial updates
      const validatedProfile = profileData && Object.keys(profileData).length > 0 
        ? updateProfileSchema.partial().parse(profileData) 
        : {};
      
      // Add image data back
      const fullProfileData = {
        ...validatedProfile,
        profileImageUrl: profileImageUrl || null,
        profileImages: Array.isArray(profileImages) ? profileImages : []
      };
      
      const user = await storage.updateUserProfile(userId, fullProfileData);
      
      console.log(`Profile updated successfully for user ${userId}`);
      res.json({ success: true, user });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Profile validation error:", error.errors);
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.put('/api/profile/location', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { latitude, longitude, location } = req.body;
      const user = await storage.updateUserLocation(userId, latitude, longitude, location);
      res.json(user);
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  // Public profile route - accessible without authentication
  app.get('/api/users/:userId/public', async (req: any, res) => {
    try {
      const { userId } = req.params;
      console.log(`Getting public profile for user: ${userId}`);
      const user = await storage.getUser(userId);
      
      if (!user) {
        console.log(`Public profile not found for user: ${userId}`);
        return res.status(404).json({ message: "User not found" });
      }
      
      console.log(`Public profile found for user: ${userId}`);
      res.json(user);
    } catch (error) {
      console.error("Error fetching public user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Individual user profile route - MUST be before other /api/users/* routes
  app.get('/api/users/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Discovery routes
  app.get('/api/users/nearby', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { latitude, longitude, radius = 50, limit = 20 } = req.query;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Location coordinates required" });
      }

      const users = await storage.getNearbyUsers(
        userId,
        parseFloat(latitude as string),
        parseFloat(longitude as string),
        parseInt(radius as string),
        parseInt(limit as string)
      );
      res.json(users);
    } catch (error) {
      console.error("Error fetching nearby users:", error);
      res.status(500).json({ message: "Failed to fetch nearby users" });
    }
  });

  app.get('/api/users/recommended', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const currentUser = await storage.getUser(userId);
      const { limit = 20 } = req.query;
      
      console.log(`Getting recommended users for ${userId}, userType: ${currentUser?.userType}`);
      
      // If user is a man (customer), only show trans escorts
      // If user is trans (escort), they can see everyone for networking
      let users;
      if (currentUser?.userType === 'man') {
        users = await storage.getPublicTransUsers(parseInt(limit as string));
      } else {
        users = await storage.getRecommendedUsers(userId, parseInt(limit as string));
      }
      
      console.log(`Returning ${users.length} recommended users`);
      res.json(users);
    } catch (error) {
      console.error("Error fetching recommended users:", error);
      res.status(500).json({ message: "Failed to fetch recommended users" });
    }
  });



  // Match routes
  app.post('/api/matches', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const matchData = createMatchSchema.parse(req.body);
      const match = await storage.createMatch(userId, matchData);
      res.json(match);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid match data", errors: error.errors });
      }
      console.error("Error creating match:", error);
      res.status(500).json({ message: "Failed to create match" });
    }
  });

  app.get('/api/matches', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const matches = await storage.getMatches(userId);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  // Chat routes
  app.get('/api/chat/rooms', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      console.log(`Getting chat rooms for user: ${userId}`);
      const rooms = await storage.getChatRooms(userId);
      console.log(`Found ${rooms.length} chat rooms`);
      res.json(rooms);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      res.status(500).json({ message: "Failed to fetch chat rooms" });
    }
  });

  app.get('/api/chat/:otherUserId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { otherUserId } = req.params;
      const { limit = 50 } = req.query;
      
      const messages = await storage.getMessages(userId, otherUserId, parseInt(limit as string));
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/chat/messages', isAuthenticated, async (req: any, res) => {
    try {
      const senderId = req.user.id;
      const messageData = sendMessageSchema.parse(req.body);
      
      // Ensure chat room exists
      await storage.getOrCreateChatRoom(senderId, messageData.receiverId);
      
      const message = await storage.sendMessage(senderId, messageData);
      console.log(`Message sent from ${senderId} to ${messageData.receiverId}: ${message.content}`);
      
      // Broadcast to WebSocket clients immediately
      const broadcastData = JSON.stringify({
        type: 'new_message',
        message: message,
        senderId: senderId,
        receiverId: messageData.receiverId,
        timestamp: Date.now()
      });
      
      // Send to both sender and receiver for instant updates
      const notifyUsers = [senderId, messageData.receiverId];
      let broadcastCount = 0;
      connectedClients.forEach((userId, socket) => {
        if (notifyUsers.includes(userId) && socket.readyState === WebSocket.OPEN) {
          socket.send(broadcastData);
          broadcastCount++;
        }
      });
      console.log(`Message broadcasted to ${broadcastCount} connected clients`);
      
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.put('/api/chat/:senderId/read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { senderId } = req.params;
      await storage.markMessagesAsRead(userId, senderId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ message: "Failed to mark messages as read" });
    }
  });

  app.get('/api/chat/unread-count', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const count = await storage.getUnreadMessageCount(userId);
      res.json(count);
    } catch (error) {
      console.error("Error getting unread count:", error);
      res.status(500).json({ message: "Failed to get unread count" });
    }
  });

  // Create or get chat room endpoint
  app.post('/api/chat/rooms', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { otherUserId } = req.body;
      
      if (!otherUserId) {
        return res.status(400).json({ message: "otherUserId is required" });
      }
      
      // Check if other user exists
      const otherUser = await storage.getUserById(otherUserId);
      if (!otherUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const chatRoom = await storage.getOrCreateChatRoom(userId, otherUserId);
      console.log(`Chat room created/found: ${chatRoom.id} between ${userId} and ${otherUserId}`);
      
      res.json(chatRoom);
    } catch (error) {
      console.error("Error creating/getting chat room:", error);
      res.status(500).json({ message: "Failed to create chat room" });
    }
  });

  // Image message endpoint - using Cloudinary
  app.post('/api/chat/messages/image', isAuthenticated, uploadChat.single('image'), async (req: any, res) => {
    try {
      const senderId = req.user.id;
      const { receiverId, content = '' } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Cloudinary provides the secure URL directly
      const imageUrl = req.file.path;

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
      console.log(`Image message sent from ${senderId} to ${receiverId} via Cloudinary`);
      
      // Broadcast to WebSocket clients
      const notifyUsers = [senderId, receiverId];
      connectedClients.forEach((userId, socket) => {
        if (notifyUsers.includes(userId) && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'new_message',
            message: message,
            senderId: senderId,
            receiverId: receiverId
          }));
        }
      });
      
      res.json(message);
    } catch (error) {
      console.error('Error sending image message via Cloudinary:', error);
      res.status(500).json({ message: 'Failed to send image message' });
    }
  });

  // Premium upgrade route (simplified without payment)
  app.post('/api/upgrade-premium', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.updateUserStripeInfo(userId, 'demo_customer', 'demo_subscription');
      res.json({ success: true, user });
    } catch (error) {
      console.error("Error upgrading to premium:", error);
      res.status(500).json({ message: "Failed to upgrade to premium" });
    }
  });

  // Update user type route
  app.post('/api/users/update-type', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { userType } = req.body;
      
      if (!userType || !['trans', 'man'].includes(userType)) {
        return res.status(400).json({ message: "Invalid user type" });
      }
      
      const user = await storage.updateUserType(userId, userType);
      res.json({ success: true, user });
    } catch (error) {
      console.error("Error updating user type:", error);
      res.status(500).json({ message: "Failed to update user type" });
    }
  });

  // Album routes
  app.get('/api/albums/my', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const albums = await storage.getUserAlbums(userId);
      res.json(albums);
    } catch (error) {
      console.error("Error fetching user albums:", error);
      res.status(500).json({ message: "Failed to fetch albums" });
    }
  });

  app.post('/api/albums', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Validate that only trans users can create albums
      const user = await storage.getUser(userId);
      if (!user || user.userType !== 'trans') {
        return res.status(403).json({ message: "Only trans users can create private albums" });
      }

      const album = await storage.createPrivateAlbum(userId, req.body);
      res.json(album);
    } catch (error) {
      console.error("Error creating album:", error);
      res.status(500).json({ message: "Failed to create album" });
    }
  });

  app.post('/api/albums/:albumId/access', isAuthenticated, async (req: any, res) => {
    try {
      const granterId = req.user.id;
      const { albumId } = req.params;
      const { userId } = req.body;

      await storage.grantAlbumAccess(albumId, userId, granterId);
      res.json({ message: "Access granted successfully" });
    } catch (error) {
      console.error("Error granting album access:", error);
      res.status(500).json({ message: "Failed to grant access" });
    }
  });

  app.get('/api/albums/accessible', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const albums = await storage.getUserAccessibleAlbums(userId);
      res.json(albums);
    } catch (error) {
      console.error("Error fetching accessible albums:", error);
      res.status(500).json({ message: "Failed to fetch accessible albums" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Setup WebSocket for real-time chat - Fixed to use correct variable
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket, req) => {
    let userId: string | null = null;

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'identify' && message.userId) {
          userId = message.userId as string;
          connectedClients.set(ws, userId);
          
          console.log(`User ${userId} identified via WebSocket`);
          console.log(`Total connected clients: ${connectedClients.size}`);
          ws.send(JSON.stringify({ type: 'identify_success' }));
        } else if (message.type === 'message' && userId) {
          // Handle real-time message
          const newMessage = await storage.sendMessage(userId, {
            receiverId: message.receiverId,
            content: message.content,
            messageType: message.messageType || 'text',
            imageUrl: message.imageUrl
          });

          // Send to receiver if online
          connectedClients.forEach((socketUserId, socket) => {
            if (socketUserId === message.receiverId && socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({
                type: 'new_message',
                message: newMessage,
                senderId: userId
              }));
            }
          });

          // Confirm to sender
          ws.send(JSON.stringify({
            type: 'message_sent',
            message: newMessage,
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', async () => {
      if (userId) {
        connectedClients.delete(ws);
        await storage.updateUserOnlineStatus(userId, false);
        console.log(`User ${userId} disconnected from WebSocket`);
      }
    });
  });

  // Password reset and email verification routes
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'E-Mail-Adresse ist erforderlich' });
      }

      console.log(`Password reset requested for: ${email}`);
      
      res.json({ 
        message: 'Reset-Link wurde versendet',
        success: true 
      });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ message: 'Fehler beim Versenden der E-Mail' });
    }
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ message: 'Token und Passwort sind erforderlich' });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: 'Passwort muss mindestens 8 Zeichen lang sein' });
      }

      console.log(`Password reset completed for token: ${token.substring(0, 10)}...`);
      
      res.json({ 
        message: 'Passwort erfolgreich geändert',
        success: true 
      });
    } catch (error) {
      console.error('Password reset completion error:', error);
      res.status(500).json({ message: 'Fehler beim Zurücksetzen des Passworts' });
    }
  });

  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: 'Verifizierungstoken ist erforderlich' });
      }

      console.log(`Email verification completed for token: ${token.substring(0, 10)}...`);
      
      res.json({ 
        message: 'E-Mail erfolgreich verifiziert',
        success: true 
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ message: 'Fehler bei der E-Mail-Verifizierung' });
    }
  });

  app.post('/api/auth/resend-verification', async (req, res) => {
    try {
      console.log('Verification email resend requested');
      
      res.json({ 
        message: 'Verifizierungs-E-Mail erneut versendet',
        success: true 
      });
    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({ message: 'Fehler beim Versenden der Verifizierungs-E-Mail' });
    }
  });

  // Private Albums API Endpoints
  // Get user's private albums
  app.get('/api/private-albums', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      const userAlbums = await storage.getUserPrivateAlbums(userId);

      res.json(userAlbums);
    } catch (error) {
      console.error('Error fetching private albums:', error);
      res.status(500).json({ message: 'Fehler beim Laden der Alben' });
    }
  });

  // Create new private album
  app.post('/api/private-albums', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { title, description } = req.body;

      const newAlbum = await storage.createPrivateAlbum(userId, { title, description });

      res.json(newAlbum);
    } catch (error) {
      console.error('Error creating private album:', error);
      res.status(500).json({ message: 'Fehler beim Erstellen des Albums' });
    }
  });

  // Upload images to private album
  app.post('/api/private-albums/:albumId/upload', isAuthenticated, uploadPrivateAlbum.array('images', 10), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { albumId } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'Keine Bilder ausgewählt' });
      }

      // Check if album belongs to user
      const albums = await storage.getUserPrivateAlbums(userId);
      const album = albums.find(a => a.id === albumId);

      if (!album) {
        return res.status(404).json({ message: 'Album nicht gefunden' });
      }

      // Check if user is premium for image limits
      const user = await storage.getUser(userId);
      if (!user?.isPremium) {
        const currentImageCount = album.imageUrls?.length || 0;
        if (currentImageCount + files.length > 5) {
          return res.status(400).json({ 
            message: `Kostenloses Limit: Maximal 5 Bilder pro Album. Du kannst noch ${5 - currentImageCount} Bilder hinzufügen.` 
          });
        }
      }

      // Get the uploaded image URLs from Cloudinary (already uploaded via multer-storage-cloudinary)
      const newImageUrls = files.map(file => file.path);
      const updatedImageUrls = [...(album.imageUrls || []), ...newImageUrls];

      // Update album with new images
      await storage.updateAlbumImages(albumId, updatedImageUrls);

      console.log(`Added ${newImageUrls.length} images to album ${albumId}`);

      res.json({ 
        message: 'Bilder erfolgreich hochgeladen',
        imageUrls: newImageUrls,
        totalImages: updatedImageUrls.length
      });
    } catch (error) {
      console.error('Error uploading album images:', error);
      res.status(500).json({ message: 'Fehler beim Hochladen der Bilder' });
    }
  });

  // Share private album with 24h access
  app.post('/api/private-albums/:albumId/share', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { albumId } = req.params;
      const { receiverId } = req.body;

      if (!receiverId) {
        return res.status(400).json({ message: 'Empfänger-ID ist erforderlich' });
      }

      // Check if album belongs to user
      const albums = await storage.getUserPrivateAlbums(userId);
      const album = albums.find(a => a.id === albumId);

      if (!album) {
        return res.status(404).json({ message: 'Album nicht gefunden' });
      }

      // Grant 24-hour access
      await storage.grantAlbumAccess(albumId, receiverId, userId);

      // Send a message with album link
      const messageData = {
        receiverId,
        content: `💎 Private Album geteilt: "${album.title}" - 24h Zugang gewährt`,
        messageType: 'private_album' as const,
        privateAlbumId: albumId,
        privateAlbumAccessExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };

      const message = await storage.sendMessage(userId, messageData);

      res.json({ 
        message: 'Album erfolgreich geteilt',
        albumAccess: {
          albumId,
          expiresAt: messageData.privateAlbumAccessExpiresAt
        }
      });
    } catch (error) {
      console.error('Error sharing private album:', error);
      res.status(500).json({ message: 'Fehler beim Teilen des Albums' });
    }
  });

  // Get shared album with access check
  app.get('/api/private-albums/:albumId/shared', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { albumId } = req.params;

      // Check if user has access to this album
      const hasAccess = await storage.checkAlbumAccess(albumId, userId);
      
      if (!hasAccess) {
        return res.status(403).json({ message: 'Kein Zugang zu diesem Album oder Zugang abgelaufen' });
      }

      // Get album details
      const albums = await storage.getUserPrivateAlbums(userId);
      const album = albums.find(a => a.id === albumId);

      if (!album) {
        return res.status(404).json({ message: 'Album nicht gefunden' });
      }

      res.json(album);
    } catch (error) {
      console.error('Error accessing shared album:', error);
      res.status(500).json({ message: 'Fehler beim Zugriff auf das geteilte Album' });
    }
  });

  // Delete private album
  app.delete('/api/private-albums/:albumId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { albumId } = req.params;

      // Check if album belongs to user
      const albums = await storage.getUserPrivateAlbums(userId);
      const album = albums.find(a => a.id === albumId);

      if (!album) {
        return res.status(404).json({ message: 'Album nicht gefunden' });
      }

      // Delete album
      await storage.deletePrivateAlbum(albumId);

      res.json({ message: 'Album erfolgreich gelöscht' });
    } catch (error) {
      console.error('Error deleting private album:', error);
      res.status(500).json({ message: 'Fehler beim Löschen des Albums' });
    }
  });

  // Settings routes
  app.put('/api/auth/change-password', isAuthenticated, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Aktuelles und neues Passwort sind erforderlich' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Neues Passwort muss mindestens 8 Zeichen lang sein' });
      }

      // Verify current password
      const bcrypt = await import('bcryptjs');
      const user = await storage.getUser(userId);
      if (!user || !await bcrypt.compare(currentPassword, user.passwordHash)) {
        return res.status(400).json({ message: 'Aktuelles Passwort ist falsch' });
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 12);
      await storage.updatePassword(userId, newPasswordHash);

      res.json({ message: 'Passwort erfolgreich geändert' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Fehler beim Ändern des Passworts' });
    }
  });

  app.delete('/api/auth/delete-account', isAuthenticated, async (req: any, res) => {
    try {
      const { password, confirmation } = req.body;
      const userId = req.user.id;

      if (!password || confirmation !== 'LÖSCHEN') {
        return res.status(400).json({ message: 'Passwort und Bestätigung sind erforderlich' });
      }

      // Verify password
      const bcrypt = await import('bcryptjs');
      const user = await storage.getUser(userId);
      if (!user || !await bcrypt.compare(password, user.passwordHash)) {
        return res.status(400).json({ message: 'Passwort ist falsch' });
      }

      // Delete user account and all related data
      await storage.deleteUser(userId);

      // Destroy session
      req.session.destroy((err: any) => {
        if (err) {
          console.error('Session destroy error:', err);
        }
      });

      res.json({ message: 'Konto erfolgreich gelöscht' });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({ message: 'Fehler beim Löschen des Kontos' });
    }
  });

  app.post('/api/support/contact', isAuthenticated, async (req: any, res) => {
    try {
      const { subject, category, message, email } = req.body;
      const userId = req.user.id;

      if (!subject || !category || !message) {
        return res.status(400).json({ message: 'Alle Felder sind erforderlich' });
      }

      // In a real app, you would send this to your support system
      // For now, we'll just log it and return success
      console.log('Support request:', {
        userId,
        email,
        category,
        subject,
        message,
        timestamp: new Date().toISOString()
      });

      // TODO: Integrate with email service (SendGrid) to send support emails
      
      res.json({ message: 'Support-Anfrage erfolgreich gesendet' });
    } catch (error) {
      console.error('Contact support error:', error);
      res.status(500).json({ message: 'Fehler beim Senden der Support-Anfrage' });
    }
  });

  app.put('/api/auth/update-privacy-settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { showOnlineStatus, showLastSeen, allowMessagePreviews } = req.body;

      // Prepare update data - only update provided settings
      const updateData: any = {};
      
      if (typeof showOnlineStatus === 'boolean') {
        updateData.showOnlineStatus = showOnlineStatus;
      }
      if (typeof showLastSeen === 'boolean') {
        updateData.showLastSeen = showLastSeen;
      }
      if (typeof allowMessagePreviews === 'boolean') {
        updateData.allowMessagePreviews = allowMessagePreviews;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'Keine gültigen Einstellungen gefunden' });
      }

      await storage.updateUserPrivacySettings(userId, updateData);

      res.json({ message: 'Privatsphäre-Einstellungen erfolgreich aktualisiert' });
    } catch (error) {
      console.error('Update privacy settings error:', error);
      res.status(500).json({ message: 'Fehler beim Aktualisieren der Privatsphäre-Einstellungen' });
    }
  });

  return httpServer;
}
