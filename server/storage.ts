import {
  users,
  matches,
  messages,
  chatRooms,
  privateAlbums,
  albumAccess,
  type User,
  type UpsertUser,
  type Match,
  type InsertMatch,
  type Message,
  type InsertMessage,
  type ChatRoom,
  type InsertChatRoom,
  type PrivateAlbum,
  type InsertPrivateAlbum,
  type AlbumAccess,
  type InsertAlbumAccess,
  type UpdateProfile,
  type CreateMatch,
  type SendMessage,
  imageModeration,
  adminLogs,
  type ImageModeration,
  type InsertImageModeration,
  type AdminLog,
  type InsertAdminLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc, sql, ne, inArray, like, count } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByEmailVerificationToken(token: string): Promise<User | undefined>;
  getUserByPasswordResetToken(token: string): Promise<User | undefined>;
  createUser(user: Partial<User>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User>;
  updateUserProfile(userId: string, profile: UpdateProfile): Promise<User>;
  updateUserLocation(userId: string, latitude: number, longitude: number, location: string): Promise<User>;
  updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<User>;
  updatePassword(userId: string, passwordHash: string): Promise<void>;
  setPasswordResetToken(userId: string, token: string, expires: Date): Promise<void>;
  verifyUserEmail(userId: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  updateUserPrivacySettings(userId: string, settings: { showOnlineStatus?: boolean; showLastSeen?: boolean; allowMessagePreviews?: boolean }): Promise<void>;
  updateUserPremiumStatus(userId: string, isPremium: boolean): Promise<void>;
  
  // Discovery operations
  getNearbyUsers(userId: string, latitude: number, longitude: number, radius: number, limit: number): Promise<User[]>;
  getRecommendedUsers(userId: string, limit: number): Promise<User[]>;
  getPublicTransUsers(limit: number): Promise<User[]>;
  
  // Album operations
  createPrivateAlbum(ownerId: string, albumData: any): Promise<PrivateAlbum>;
  getUserPrivateAlbums(userId: string): Promise<PrivateAlbum[]>;
  updateAlbumImages(albumId: string, imageUrls: string[]): Promise<PrivateAlbum>;
  deletePrivateAlbum(albumId: string): Promise<void>;
  grantAlbumAccess(albumId: string, userId: string, grantedBy: string): Promise<void>;
  checkAlbumAccess(albumId: string, userId: string): Promise<boolean>;
  getUserAccessibleAlbums(userId: string): Promise<any[]>;
  
  // Match operations
  createMatch(userId: string, match: CreateMatch): Promise<Match>;
  getMatches(userId: string): Promise<(Match & { user: User })[]>;
  checkMutualMatch(userId: string, targetUserId: string): Promise<boolean>;
  
  // Message operations
  sendMessage(senderId: string, message: SendMessage): Promise<Message>;
  getMessages(userId: string, otherUserId: string, limit: number): Promise<Message[]>;
  markMessagesAsRead(userId: string, senderId: string): Promise<void>;
  getUnreadMessageCount(userId: string): Promise<number>;
  
  // Chat room operations
  getChatRooms(userId: string): Promise<(ChatRoom & { otherUser: User; lastMessage: Message | null; unreadCount: number })[]>;
  getOrCreateChatRoom(user1Id: string, user2Id: string): Promise<ChatRoom>;
  
  // Admin operations
  getAllUsers(page: number, limit: number, search?: string, userType?: 'trans' | 'man'): Promise<{ users: User[]; total: number }>;
  blockUser(adminId: string, userId: string, reason?: string): Promise<void>;
  unblockUser(adminId: string, userId: string): Promise<void>;
  activatePremium(adminId: string, userId: string, days: number): Promise<void>;
  deactivatePremium(adminId: string, userId: string): Promise<void>;
  updateUserAsAdmin(adminId: string, userId: string, updates: Partial<User>): Promise<User>;
  deleteUserAsAdmin(adminId: string, userId: string, reason?: string): Promise<void>;
  
  // Image moderation operations
  getPendingImages(page: number, limit: number): Promise<{ images: (ImageModeration & { user: User })[]; total: number }>;
  approveImage(adminId: string, imageId: string): Promise<void>;
  rejectImage(adminId: string, imageId: string, reason: string): Promise<void>;
  createImageModeration(userId: string, imageUrl: string, imageType: 'profile' | 'gallery'): Promise<ImageModeration>;
  
  // Admin logs
  logAdminAction(adminId: string, action: string, targetUserId?: string, details?: any, ipAddress?: string): Promise<void>;
  getAdminLogs(page: number, limit: number, adminId?: string): Promise<{ logs: (AdminLog & { admin: User; targetUser?: User })[]; total: number }>;
  
  // Statistics
  getUserStats(): Promise<{ totalUsers: number; transUsers: number; customers: number; premiumUsers: number; onlineUsers: number }>;
  getRevenueStats(): Promise<{ totalRevenue: number; monthlyRevenue: number; premiumSubscriptions: number }>;
}

export class DatabaseStorage implements IStorage {
  // Initialize demo data
  async initializeDemoData(): Promise<void> {
    // Import bcrypt for demo password hashing
    const bcrypt = await import('bcryptjs');
    const demoPassword = await bcrypt.hash('demo123', 12);

    const demoTransUsers = [
      {
        id: 'demo_trans_1',
        email: 'lena@example.com',
        passwordHash: demoPassword,
        isEmailVerified: true,
        firstName: 'Lena',
        lastName: 'Schmidt',
        bio: 'Hallo! Ich bin Lena, 28 Jahre alt und biete diskrete Services in Berlin. Professionell und sinnlich. Nur ernsthafte Anfragen! ✨',
        age: 28,
        height: 175,
        weight: 65,
        cockSize: 18,
        position: 'versatile' as const,
        bodyType: 'Schlank',
        ethnicity: 'Europäisch',
        services: ['GF6', 'Anal aktiv', 'Anal passiv', 'Oral ohne', 'Küssen'],
        hourlyRate: 200,
        location: 'Berlin',
        latitude: 52.5200,
        longitude: 13.4050,
        interests: ['Kunst', 'Musik'],
        userType: 'trans' as const,
        profileImageUrl: 'https://i.postimg.cc/MZsQW6gn/photo-1612461988667-14697dc88205.avif',
        isOnline: true,
        isPremium: true,
      },
      {
        id: 'demo_trans_2',
        email: 'sofia@example.com',
        passwordHash: demoPassword,
        isEmailVerified: true,
        firstName: 'Sofia',
        lastName: 'Müller',
        bio: 'Sofia hier! 25 Jahre, Hamburg. Luxus-Escort mit viel Erfahrung. Diskret und professionell. 💋',
        age: 25,
        height: 168,
        weight: 58,
        cockSize: 16,
        position: 'bottom' as const,
        bodyType: 'Zierlich',
        ethnicity: 'Lateinamerikanisch',
        services: ['GF6', 'Anal passiv', 'Oral ohne', 'Küssen', 'Massage'],
        hourlyRate: 180,
        location: 'Hamburg',
        latitude: 53.5511,
        longitude: 9.9937,
        interests: ['Mode', 'Wellness'],
        userType: 'trans' as const,
        profileImageUrl: 'https://i.postimg.cc/9FnZBmB6/photo-1716004657433-08aed0c63f50.avif',
        isOnline: false,
        isPremium: true,
      },
      {
        id: 'demo_trans_3',
        email: 'maya@example.com',
        passwordHash: demoPassword,
        isEmailVerified: true,
        firstName: 'Maya',
        lastName: 'Weber',
        bio: 'Maya, 30 Jahre, München. Exklusive Services für anspruchsvolle Herren. Sehr diskret! 🌹',
        age: 30,
        height: 172,
        weight: 62,
        cockSize: 20,
        position: 'top' as const,
        bodyType: 'Sportlich',
        ethnicity: 'Asiatisch',
        services: ['GF6', 'Anal aktiv', 'Oral ohne', 'Küssen', 'Dominanz'],
        hourlyRate: 250,
        location: 'München',
        latitude: 48.1351,
        longitude: 11.5820,
        interests: ['Fitness', 'Kochen'],
        userType: 'trans' as const,
        profileImageUrl: 'https://i.postimg.cc/cCDY20G8/photo-1698251127457-38da75299c05.avif',
        isOnline: true,
        isPremium: false,

      },
      {
        id: 'demo_trans_4',
        email: 'zara@example.com',
        passwordHash: demoPassword,
        isEmailVerified: true,
        firstName: 'Zara',
        lastName: 'Fischer',
        bio: 'Hi, ich bin Zara! 26 Jahre, Köln. Neue Escort mit viel Leidenschaft. Diskret und professionell! 💖',
        age: 26,
        height: 169,
        weight: 59,
        cockSize: 17,
        position: 'versatile' as const,
        bodyType: 'Schlank',
        ethnicity: 'Europäisch',
        services: ['GF6', 'Anal aktiv', 'Anal passiv', 'Oral ohne', 'Küssen', 'Massage'],
        hourlyRate: 170,
        location: 'Köln',
        latitude: 50.9375,
        longitude: 6.9603,
        interests: ['Reisen', 'Tanz'],
        userType: 'trans' as const,
        profileImageUrl: 'https://i.postimg.cc/FzF3T184/photo-1575186083127-03641b958f61.avif',
        isOnline: false,
        isPremium: false,

      },
      {
        id: 'demo_trans_5',
        email: 'lucia@example.com',
        passwordHash: demoPassword,
        isEmailVerified: true,
        firstName: 'Lucia',
        lastName: 'Rossi',
        bio: 'Ciao! Lucia hier, 29 Jahre aus Frankfurt. Italienisches Temperament trifft deutsche Gründlichkeit! 🇮🇹',
        age: 29,
        height: 174,
        weight: 64,
        cockSize: 19,
        position: 'top' as const,
        bodyType: 'Kurvig',
        ethnicity: 'Südeuropäisch',
        services: ['GF6', 'Anal aktiv', 'Oral ohne', 'Küssen', 'Roleplay'],
        hourlyRate: 220,
        location: 'Frankfurt am Main',
        latitude: 50.1109,
        longitude: 8.6821,
        interests: ['Kultur', 'Kulinarik'],
        userType: 'trans' as const,
        profileImageUrl: 'https://i.postimg.cc/P50bdXpW/photo-1583900985737-6d0495555783.avif',
        isOnline: true,
        isPremium: true,

      },
    ];

    for (const user of demoTransUsers) {
      await this.upsertUser(user);
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    console.log(`Getting user ${id}:`, user ? 'found' : 'not found');
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.getUser(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByEmailVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.emailVerificationToken, token));
    return user;
  }

  async getUserByPasswordResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users)
      .where(
        and(
          eq(users.passwordResetToken, token),
          sql`${users.passwordResetExpires} > NOW()`
        )
      );
    return user;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData as any)
      .returning();
    return user;
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async setPasswordResetToken(userId: string, token: string, expires: Date): Promise<void> {
    await db
      .update(users)
      .set({ 
        passwordResetToken: token,
        passwordResetExpires: expires,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async verifyUserEmail(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        isEmailVerified: true,
        emailVerificationToken: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        isPremium: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserProfile(userId: string, profile: UpdateProfile & { profileImageUrl?: string; profileImages?: string[] }): Promise<User> {
    const updateData: any = {
      ...profile,
      updatedAt: new Date(),
    };
    
    // Explicitly handle profile images - ensure they're saved
    updateData.profileImageUrl = profile.profileImageUrl || null;
    updateData.profileImages = Array.isArray(profile.profileImages) ? profile.profileImages : [];
    
    console.log(`Updating user ${userId} with data:`, updateData);
    
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    console.log(`Updated user:`, user);
    return user;
  }

  async updateUserLocation(userId: string, latitude: number, longitude: number, location: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        latitude,
        longitude,
        location,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        isOnline,
        lastSeen: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // Discovery operations
  async getNearbyUsers(userId: string, latitude: number, longitude: number, radius: number, limit: number): Promise<User[]> {
    // Using basic distance calculation (for production, consider PostGIS)
    const nearbyUsers = await db
      .select()
      .from(users)
      .where(
        and(
          sql`${users.id} != ${userId}`,
          sql`${users.latitude} IS NOT NULL`,
          sql`${users.longitude} IS NOT NULL`,
          sql`(
            6371 * acos(
              cos(radians(${latitude})) * 
              cos(radians(${users.latitude})) * 
              cos(radians(${users.longitude}) - radians(${longitude})) + 
              sin(radians(${latitude})) * 
              sin(radians(${users.latitude}))
            )
          ) <= ${radius}`
        )
      )
      .orderBy(desc(users.isPremium), desc(users.lastSeen))
      .limit(limit);
    
    return nearbyUsers;
  }

  async getRecommendedUsers(userId: string, limit: number): Promise<User[]> {
    // Get current user to determine matching logic
    const currentUser = await this.getUser(userId);
    if (!currentUser) return [];
    
    // Get users excluding already matched ones
    const alreadyMatched = await db
      .select({ targetUserId: matches.targetUserId })
      .from(matches)
      .where(eq(matches.userId, userId));
    
    const matchedIds = alreadyMatched.map(m => m.targetUserId);
    
    let whereCondition;
    if (currentUser.userType === 'man') {
      // Men can only see trans users
      whereCondition = and(
        sql`${users.id} != ${userId}`,
        eq(users.userType, 'trans'),
        matchedIds.length > 0 ? sql`${users.id} NOT IN ${matchedIds}` : sql`1=1`
      );
    } else {
      // Trans users can see other trans users and men
      whereCondition = and(
        sql`${users.id} != ${userId}`,
        matchedIds.length > 0 ? sql`${users.id} NOT IN ${matchedIds}` : sql`1=1`
      );
    }
    
    const recommended = await db
      .select()
      .from(users)
      .where(whereCondition)
      .orderBy(desc(users.isPremium), desc(users.isOnline), desc(users.lastSeen))
      .limit(limit);
    
    return recommended;
  }

  // Method to get all trans users for public viewing (before login)
  async getPublicTransUsers(limit: number): Promise<User[]> {
    const transUsers = await db
      .select()
      .from(users)
      .where(eq(users.userType, 'trans'))
      .orderBy(desc(users.isPremium), desc(users.isOnline), desc(users.lastSeen))
      .limit(limit);
    
    console.log(`Found ${transUsers.length} public trans escorts`);
    return transUsers;
  }

  // Match operations
  async createMatch(userId: string, match: CreateMatch): Promise<Match> {
    const matchId = nanoid();
    
    const [newMatch] = await db
      .insert(matches)
      .values({
        id: matchId,
        userId,
        ...match,
      })
      .returning();

    // Check for mutual match
    if (match.isLike) {
      const mutualMatch = await db
        .select()
        .from(matches)
        .where(
          and(
            eq(matches.userId, match.targetUserId),
            eq(matches.targetUserId, userId),
            eq(matches.isLike, true)
          )
        );

      if (mutualMatch.length > 0) {
        // Update both matches as mutual
        await db
          .update(matches)
          .set({ isMutual: true })
          .where(
            or(
              and(eq(matches.userId, userId), eq(matches.targetUserId, match.targetUserId)),
              and(eq(matches.userId, match.targetUserId), eq(matches.targetUserId, userId))
            )
          );

        // Create chat room
        await this.getOrCreateChatRoom(userId, match.targetUserId);
      }
    }

    return newMatch;
  }

  async getMatches(userId: string): Promise<(Match & { user: User })[]> {
    const userMatches = await db
      .select({
        match: matches,
        user: users,
      })
      .from(matches)
      .innerJoin(users, eq(matches.targetUserId, users.id))
      .where(and(eq(matches.userId, userId), eq(matches.isLike, true)))
      .orderBy(desc(matches.createdAt));

    return userMatches.map(({ match, user }) => ({ ...match, user }));
  }

  async checkMutualMatch(userId: string, targetUserId: string): Promise<boolean> {
    const mutualMatches = await db
      .select()
      .from(matches)
      .where(
        and(
          or(
            and(eq(matches.userId, userId), eq(matches.targetUserId, targetUserId)),
            and(eq(matches.userId, targetUserId), eq(matches.targetUserId, userId))
          ),
          eq(matches.isMutual, true)
        )
      );

    return mutualMatches.length > 0;
  }

  // Message operations
  async sendMessage(senderId: string, message: SendMessage): Promise<Message> {
    const messageId = nanoid();
    
    const [newMessage] = await db
      .insert(messages)
      .values({
        id: messageId,
        senderId,
        receiverId: message.receiverId,
        content: message.content || "",
        messageType: message.messageType || 'text',
        imageUrl: message.imageUrl,
      })
      .returning();

    // Update chat room's last message
    const chatRoom = await this.getOrCreateChatRoom(senderId, message.receiverId);
    await db
      .update(chatRooms)
      .set({
        lastMessageId: messageId,
        updatedAt: new Date(),
      })
      .where(eq(chatRooms.id, chatRoom.id));

    return newMessage;
  }

  async getMessages(userId: string, otherUserId: string, limit: number): Promise<Message[]> {
    const messageList = await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId), eq(messages.receiverId, otherUserId)),
          and(eq(messages.senderId, otherUserId), eq(messages.receiverId, userId))
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(limit);

    return messageList.reverse();
  }

  async markMessagesAsRead(userId: string, senderId: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(
          eq(messages.receiverId, userId),
          eq(messages.senderId, senderId),
          eq(messages.isRead, false)
        )
      );
  }

  // Chat room operations
  async getChatRooms(userId: string): Promise<(ChatRoom & { otherUser: User; lastMessage: Message | null; unreadCount: number })[]> {
    const rooms = await db
      .select({
        chatRoom: chatRooms,
        otherUser: users,
        lastMessage: messages,
      })
      .from(chatRooms)
      .innerJoin(
        users,
        or(
          and(eq(chatRooms.user1Id, userId), eq(users.id, chatRooms.user2Id)),
          and(eq(chatRooms.user2Id, userId), eq(users.id, chatRooms.user1Id))
        )
      )
      .leftJoin(messages, eq(chatRooms.lastMessageId, messages.id))
      .where(or(eq(chatRooms.user1Id, userId), eq(chatRooms.user2Id, userId)))
      .orderBy(desc(chatRooms.updatedAt));

    // Get unread counts for each room
    const roomsWithUnread = await Promise.all(
      rooms.map(async ({ chatRoom, otherUser, lastMessage }) => {
        const [{ count }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(messages)
          .where(
            and(
              eq(messages.receiverId, userId),
              eq(messages.senderId, otherUser.id),
              eq(messages.isRead, false)
            )
          );

        return {
          ...chatRoom,
          otherUser,
          lastMessage,
          unreadCount: count,
        };
      })
    );

    return roomsWithUnread;
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(
        and(
          eq(messages.receiverId, userId),
          eq(messages.isRead, false)
        )
      );
    
    return result[0]?.count || 0;
  }

  async getOrCreateChatRoom(user1Id: string, user2Id: string): Promise<ChatRoom> {
    // Check if room exists
    const [existingRoom] = await db
      .select()
      .from(chatRooms)
      .where(
        or(
          and(eq(chatRooms.user1Id, user1Id), eq(chatRooms.user2Id, user2Id)),
          and(eq(chatRooms.user1Id, user2Id), eq(chatRooms.user2Id, user1Id))
        )
      );

    if (existingRoom) {
      return existingRoom;
    }

    // Create new room
    const roomId = nanoid();
    const [newRoom] = await db
      .insert(chatRooms)
      .values({
        id: roomId,
        user1Id,
        user2Id,
      })
      .returning();

    return newRoom;
  }



  async updateUserType(userId: string, userType: 'trans' | 'man'): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        userType,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    // Delete user's album access records
    await db.delete(albumAccess).where(eq(albumAccess.userId, userId));
    
    // Delete user's private albums and their access records
    const userAlbums = await db.select().from(privateAlbums).where(eq(privateAlbums.ownerId, userId));
    for (const album of userAlbums) {
      await db.delete(albumAccess).where(eq(albumAccess.albumId, album.id));
    }
    await db.delete(privateAlbums).where(eq(privateAlbums.ownerId, userId));
    
    // Delete user's messages
    await db.delete(messages).where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)));
    
    // Delete user's matches
    await db.delete(matches).where(or(eq(matches.userId, userId), eq(matches.targetUserId, userId)));
    
    // Delete user's chat rooms
    await db.delete(chatRooms).where(or(eq(chatRooms.user1Id, userId), eq(chatRooms.user2Id, userId)));
    
    // Finally delete the user
    await db.delete(users).where(eq(users.id, userId));
  }

  async updateUserPrivacySettings(userId: string, settings: { showOnlineStatus?: boolean; showLastSeen?: boolean; allowMessagePreviews?: boolean }): Promise<void> {
    const updateData: any = {
      ...settings,
      updatedAt: new Date(),
    };

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));
  }

  // Admin operations
  async getAllUsers(page: number, limit: number, search?: string, userType?: 'trans' | 'man'): Promise<{ users: User[]; total: number }> {
    let query = db.select().from(users);
    
    const conditions = [];
    if (search) {
      conditions.push(
        or(
          like(users.firstName, `%${search}%`),
          like(users.lastName, `%${search}%`),
          like(users.email, `%${search}%`),
          like(users.username, `%${search}%`)
        )
      );
    }
    
    if (userType) {
      conditions.push(eq(users.userType, userType));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const offset = (page - 1) * limit;
    const [userResults, totalResult] = await Promise.all([
      query.limit(limit).offset(offset).orderBy(desc(users.createdAt)),
      db.select({ count: count() }).from(users).where(conditions.length > 0 ? and(...conditions) : undefined)
    ]);
    
    return {
      users: userResults,
      total: totalResult[0].count
    };
  }

  async blockUser(adminId: string, userId: string, reason?: string): Promise<void> {
    await db.update(users).set({ isBlocked: true }).where(eq(users.id, userId));
    await this.logAdminAction(adminId, 'block_user', userId, { reason });
  }

  async unblockUser(adminId: string, userId: string): Promise<void> {
    await db.update(users).set({ isBlocked: false }).where(eq(users.id, userId));
    await this.logAdminAction(adminId, 'unblock_user', userId, {});
  }

  async activatePremium(adminId: string, userId: string, days: number): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
    
    await db.update(users).set({ 
      isPremium: true, 
      premiumExpiresAt: expiresAt 
    }).where(eq(users.id, userId));
    
    await this.logAdminAction(adminId, 'activate_premium', userId, { days });
  }

  async deactivatePremium(adminId: string, userId: string): Promise<void> {
    await db.update(users).set({ 
      isPremium: false, 
      premiumExpiresAt: null 
    }).where(eq(users.id, userId));
    
    await this.logAdminAction(adminId, 'deactivate_premium', userId, {});
  }

  async updateUserAsAdmin(adminId: string, userId: string, updates: Partial<User>): Promise<User> {
    const [updatedUser] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    
    await this.logAdminAction(adminId, 'edit_user', userId, { updates });
    return updatedUser;
  }

  async deleteUserAsAdmin(adminId: string, userId: string, reason?: string): Promise<void> {
    await this.logAdminAction(adminId, 'delete_user', userId, { reason });
    
    // Delete related data first
    try {
      await db.delete(messages).where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)));
    } catch (e) { console.log("No messages to delete") }
    
    try {
      await db.delete(matches).where(or(eq(matches.userId, userId), eq(matches.targetUserId, userId)));
    } catch (e) { console.log("No matches to delete") }
    
    try {
      await db.delete(privateAlbums).where(eq(privateAlbums.ownerId, userId));
    } catch (e) { console.log("No albums to delete") }
    
    try {
      await db.delete(imageModeration).where(eq(imageModeration.userId, userId));  
    } catch (e) { console.log("No image moderation to delete") }
    
    // Finally delete the user
    await db.delete(users).where(eq(users.id, userId));
  }

  async getPendingImages(page: number, limit: number): Promise<{ images: any[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const [imageResults, totalResult] = await Promise.all([
      db.select().from(imageModeration)
        .where(eq(imageModeration.status, 'pending'))
        .limit(limit).offset(offset).orderBy(desc(imageModeration.createdAt)),
      db.select({ count: count() }).from(imageModeration).where(eq(imageModeration.status, 'pending'))
    ]);
    
    // Add user info to each image
    const imagesWithUsers = await Promise.all(
      imageResults.map(async (img) => {
        const user = await this.getUser(img.userId);
        return {
          ...img,
          username: user?.username || user?.email || 'Unknown',
          uploadedAt: img.createdAt
        };
      })
    );
    
    return {
      images: imagesWithUsers,
      total: totalResult[0].count
    };
  }

  async approveImage(adminId: string, imageId: string): Promise<void> {
    await db.update(imageModeration).set({
      status: 'approved',
      moderatedAt: new Date(),
      moderatedBy: adminId
    }).where(eq(imageModeration.id, imageId));
    
    await this.logAdminAction(adminId, 'approve_image', imageId, {});
  }

  async rejectImage(adminId: string, imageId: string, reason?: string): Promise<void> {
    const [moderationRecord] = await db.select().from(imageModeration).where(eq(imageModeration.id, imageId));
    
    await db.update(imageModeration).set({
      status: 'rejected',
      moderatedAt: new Date(),
      moderatedBy: adminId,
      rejectionReason: reason
    }).where(eq(imageModeration.id, imageId));
    
    if (moderationRecord) {
      const user = await this.getUser(moderationRecord.userId);
      if (user) {
        if (moderationRecord.imageUrl === user.profileImageUrl) {
          await db.update(users).set({ profileImageUrl: null }).where(eq(users.id, user.id));
        } else if (user.profileImages) {
          const updatedImages = user.profileImages.filter(img => img !== moderationRecord.imageUrl);
          await db.update(users).set({ profileImages: updatedImages }).where(eq(users.id, user.id));
        }
      }
    }
    
    await this.logAdminAction(adminId, 'reject_image', imageId, { reason });
  }

  async createImageModeration(userId: string, imageUrl: string, imageType: 'profile' | 'gallery'): Promise<ImageModeration> {
    const [moderation] = await db.insert(imageModeration).values({
      id: nanoid(),
      userId,
      imageUrl,
      imageType,
      status: 'pending'
    }).returning();
    
    return moderation;
  }

  async getUserStats(): Promise<{ totalUsers: number; transUsers: number; customers: number; premiumUsers: number; onlineUsers: number }> {
    const [stats] = await db.select({
      totalUsers: count(),
      transUsers: count(sql`CASE WHEN ${users.userType} = 'trans' THEN 1 END`),
      customers: count(sql`CASE WHEN ${users.userType} = 'man' THEN 1 END`),
      premiumUsers: count(sql`CASE WHEN ${users.isPremium} = true THEN 1 END`),
      onlineUsers: count(sql`CASE WHEN ${users.isOnline} = true THEN 1 END`)
    }).from(users);
    
    return stats;
  }

  async getRevenueStats(): Promise<{ totalRevenue: number; monthlyRevenue: number; premiumSubscriptions: number }> {
    const [premiumCount] = await db.select({
      count: count()
    }).from(users).where(eq(users.isPremium, true));
    
    return {
      totalRevenue: premiumCount.count * 9.99,
      monthlyRevenue: premiumCount.count * 9.99,
      premiumSubscriptions: premiumCount.count
    };
  }

  async getAdminLogs(page: number, limit: number, adminId?: string): Promise<{ logs: any[]; total: number }> {
    const offset = (page - 1) * limit;
    
    try {
      const [logResults, totalResult] = await Promise.all([
        db.select().from(adminLogs)
          .limit(limit).offset(offset).orderBy(desc(adminLogs.createdAt)),
        db.select({ count: count() }).from(adminLogs).where(adminId ? eq(adminLogs.adminId, adminId) : undefined)
      ]);
      
      return {
        logs: logResults,
        total: totalResult[0].count
      };
    } catch (error) {
      console.error("Error fetching admin logs:", error);
      return { logs: [], total: 0 };
    }
  }
}


export const storage = new DatabaseStorage();
