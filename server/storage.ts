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
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc, sql } from "drizzle-orm";
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
  
  // Discovery operations
  getNearbyUsers(userId: string, latitude: number, longitude: number, radius: number, limit: number): Promise<User[]>;
  getRecommendedUsers(userId: string, limit: number): Promise<User[]>;
  getPublicTransUsers(limit: number): Promise<User[]>;
  
  // Album operations
  createPrivateAlbum(ownerId: string, albumData: any): Promise<any>;
  getUserAlbums(userId: string): Promise<any[]>;
  grantAlbumAccess(albumId: string, userId: string, grantedBy: string): Promise<void>;
  getUserAccessibleAlbums(userId: string): Promise<any[]>;
  
  // Match operations
  createMatch(userId: string, match: CreateMatch): Promise<Match>;
  getMatches(userId: string): Promise<(Match & { user: User })[]>;
  checkMutualMatch(userId: string, targetUserId: string): Promise<boolean>;
  
  // Message operations
  sendMessage(senderId: string, message: SendMessage): Promise<Message>;
  getMessages(userId: string, otherUserId: string, limit: number): Promise<Message[]>;
  markMessagesAsRead(userId: string, senderId: string): Promise<void>;
  
  // Chat room operations
  getChatRooms(userId: string): Promise<(ChatRoom & { otherUser: User; lastMessage: Message | null; unreadCount: number })[]>;
  getOrCreateChatRoom(user1Id: string, user2Id: string): Promise<ChatRoom>;
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
        profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400',
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
        profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
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
        profileImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
        isOnline: true,
        isPremium: false,
        languages: ['Deutsch', 'Englisch', 'Spanisch'],
        tattoos: 'Wenige',
        piercings: 'Sonstige',
        smoking: false,
        drinking: 'Sozial',
        availability: '24/7',
        outcall: true,
        incall: true,
        travel: true,
        rates: {
          '1h': 250,
          '2h': 450,
          'overnight': 1500,
          'weekend': 3000
        },
        aboutMe: 'Ich bin Maya, eine exklusive Trans-Escort aus München. Mit meiner sportlichen Figur und asiatischen Schönheit biete ich dir unvergessliche Momente voller Leidenschaft und Intimität. Diskret, professionell und immer für neue Abenteuer bereit.',
        whatILike: 'Ich liebe es, neue Menschen kennenzulernen und ihnen besondere Momente zu schenken. Fitness hält mich in Form, und beim Kochen kann ich wunderbar entspannen.',
        whatIExpect: 'Respekt, Hygiene und Diskretion sind mir sehr wichtig. Ich erwarte von meinen Kunden, dass sie gepflegt sind und mich mit Respekt behandeln.',
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
        profileImageUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400',
        isOnline: false,
        isPremium: false,
        languages: ['Deutsch', 'Englisch'],
        tattoos: 'Keine',
        piercings: 'Ohren',
        smoking: false,
        drinking: 'Gelegentlich',
        availability: 'Abends',
        outcall: true,
        incall: false,
        travel: false,
        rates: {
          '1h': 170,
          '2h': 300,
          'overnight': 800
        },
        aboutMe: 'Hallo! Ich bin Zara, eine junge und leidenschaftliche Trans-Escort aus Köln. Als neue Escort bringe ich frische Energie und viel Enthusiasmus mit.',
        whatILike: 'Ich liebe es zu reisen und neue Kulturen kennenzulernen. Tanzen ist meine Leidenschaft - es hält mich fit und macht mich glücklich.',
        whatIExpect: 'Höflichkeit und ein respektvoller Umgang sind mir wichtig. Ich freue mich auf nette Gespräche und gemeinsame schöne Stunden.',
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
        profileImageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400',
        isOnline: true,
        isPremium: true,
        languages: ['Deutsch', 'Italienisch', 'Englisch'],
        tattoos: 'Viele',
        piercings: 'Sonstige',
        smoking: true,
        drinking: 'Regelmäßig',
        availability: 'Flexibel',
        outcall: true,
        incall: true,
        travel: true,
        rates: {
          '1h': 220,
          '2h': 400,
          'overnight': 1200,
          'weekend': 2500
        },
        aboutMe: 'Ciao Belli! Ich bin Lucia, eine temperamentvolle italienische Trans-Escort in Frankfurt. Mit meiner kurvigen Figur und meinem südländischen Charme verzaubere ich meine Kunden.',
        whatILike: 'Ich bin eine Genießerin - gutes Essen, Kultur und aufregende Gespräche sind meine Leidenschaft. Als Premium-Escort biete ich exklusive Services.',
        whatIExpect: 'Ich schätze Kunden, die Qualität zu würdigen wissen. Gepflegte Erscheinung und ein gewisses Niveau sind mir wichtig.',
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

  async updateUserProfile(userId: string, profile: UpdateProfile): Promise<User> {
    const updateData: any = {
      ...profile,
      updatedAt: new Date(),
    };
    
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
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

  // Album operations
  async createPrivateAlbum(ownerId: string, albumData: any): Promise<PrivateAlbum> {
    const albumId = nanoid();
    
    const [album] = await db
      .insert(privateAlbums)
      .values({
        id: albumId,
        ownerId,
        ...albumData,
      })
      .returning();
    
    return album;
  }

  async getUserAlbums(userId: string): Promise<PrivateAlbum[]> {
    const albums = await db
      .select()
      .from(privateAlbums)
      .where(eq(privateAlbums.ownerId, userId))
      .orderBy(desc(privateAlbums.createdAt));
    
    return albums;
  }

  async grantAlbumAccess(albumId: string, userId: string, grantedBy: string): Promise<void> {
    const accessId = nanoid();
    
    await db
      .insert(albumAccess)
      .values({
        id: accessId,
        albumId,
        userId,
        grantedBy,
      });
  }

  async getUserAccessibleAlbums(userId: string): Promise<PrivateAlbum[]> {
    // Get albums where user has been granted access
    const accessibleAlbums = await db
      .select({
        album: privateAlbums,
      })
      .from(albumAccess)
      .innerJoin(privateAlbums, eq(albumAccess.albumId, privateAlbums.id))
      .where(eq(albumAccess.userId, userId));
    
    return accessibleAlbums.map(item => item.album);
  }
}

export const storage = new DatabaseStorage();
