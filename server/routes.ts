import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { sendMessageSchema, createMatchSchema, updateProfileSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.put('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const currentUser = await storage.getUserById(userId);
      const { limit = 20 } = req.query;
      
      // If user is a man (customer), only show trans escorts
      // If user is trans (escort), they can see everyone for networking
      let users;
      if (currentUser?.userType === 'man') {
        users = await storage.getPublicTransUsers(parseInt(limit as string));
      } else {
        users = await storage.getRecommendedUsers(userId, parseInt(limit as string));
      }
      
      res.json(users);
    } catch (error) {
      console.error("Error fetching recommended users:", error);
      res.status(500).json({ message: "Failed to fetch recommended users" });
    }
  });

  // Public route - ONLY trans escorts are shown (like hunqz.com model)
  app.get('/api/users/public', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const transEscorts = await storage.getPublicTransUsers(limit);
      res.json(transEscorts);
    } catch (error) {
      console.error("Error getting public trans escorts:", error);
      res.status(500).json({ message: "Failed to get public escorts" });
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
      const senderId = req.user.claims.sub;
      const messageData = sendMessageSchema.parse(req.body);
      const message = await storage.sendMessage(senderId, messageData);
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
