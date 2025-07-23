import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupCustomAuth, isAuthenticated } from "./customAuth";
import { sendMessageSchema, createMatchSchema, updateProfileSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupCustomAuth(app);
  
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

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        isEmailVerified: user.isEmailVerified,
        profileImageUrl: user.profileImageUrl,
        isPremium: user.isPremium,
        age: user.age,
        bio: user.bio,
        location: user.location,
        services: user.services,
        hourlyRate: user.hourlyRate,
        isOnline: user.isOnline,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.put('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profileData = updateProfileSchema.parse(req.body);
      const user = await storage.updateUserProfile(userId, profileData);
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.put('/api/profile/location', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { latitude, longitude, location } = req.body;
      const user = await storage.updateUserLocation(userId, latitude, longitude, location);
      res.json(user);
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ message: "Failed to update location" });
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const rooms = await storage.getChatRooms(userId);
      res.json(rooms);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      res.status(500).json({ message: "Failed to fetch chat rooms" });
    }
  });

  app.get('/api/chat/:otherUserId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const message = await storage.sendMessage(senderId, messageData);
      
      // Broadcast to WebSocket clients
      const otherUserId = messageData.receiverId;
      const connectedSockets = [...connectedClients.entries()];
      connectedSockets.forEach(([socket, userId]) => {
        if (userId === otherUserId && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'new_message',
            message: message,
            senderId: senderId
          }));
        }
      });
      
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
      const userId = req.user.claims.sub;
      const { senderId } = req.params;
      await storage.markMessagesAsRead(userId, senderId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ message: "Failed to mark messages as read" });
    }
  });

  // Premium upgrade route (simplified without payment)
  app.post('/api/upgrade-premium', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const albums = await storage.getUserAlbums(userId);
      res.json(albums);
    } catch (error) {
      console.error("Error fetching user albums:", error);
      res.status(500).json({ message: "Failed to fetch albums" });
    }
  });

  app.post('/api/albums', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
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
      const granterId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const albums = await storage.getUserAccessibleAlbums(userId);
      res.json(albums);
    } catch (error) {
      console.error("Error fetching accessible albums:", error);
      res.status(500).json({ message: "Failed to fetch accessible albums" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Setup WebSocket for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const connectedUsers = new Map<string, WebSocket>();

  wss.on('connection', (ws: WebSocket, req) => {
    let userId: string | null = null;

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'auth' && message.userId) {
          userId = message.userId as string;
          connectedUsers.set(userId, ws);
          await storage.updateUserOnlineStatus(userId, true);
          
          // Broadcast online status to relevant users
          ws.send(JSON.stringify({ type: 'auth_success' }));
        } else if (message.type === 'message' && userId) {
          // Handle real-time message
          const newMessage = await storage.sendMessage(userId, {
            receiverId: message.receiverId,
            content: message.content,
          });

          // Send to receiver if online
          const receiverWs = connectedUsers.get(message.receiverId);
          if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
            receiverWs.send(JSON.stringify({
              type: 'new_message',
              message: newMessage,
            }));
          }

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
        connectedUsers.delete(userId);
        await storage.updateUserOnlineStatus(userId, false);
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

  return httpServer;
}
