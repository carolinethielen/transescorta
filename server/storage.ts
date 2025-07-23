import {
  users,
  matches,
  messages,
  chatRooms,
  type User,
  type UpsertUser,
  type Match,
  type InsertMatch,
  type Message,
  type InsertMessage,
  type ChatRoom,
  type InsertChatRoom,
  type UpdateProfile,
  type CreateMatch,
  type SendMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User>;
  updateUserProfile(userId: string, profile: UpdateProfile): Promise<User>;
  updateUserLocation(userId: string, latitude: number, longitude: number, location: string): Promise<User>;
  updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<User>;
  
  // Discovery operations
  getNearbyUsers(userId: string, latitude: number, longitude: number, radius: number, limit: number): Promise<User[]>;
  getRecommendedUsers(userId: string, limit: number): Promise<User[]>;
  
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
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
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
    // Get users excluding already matched ones
    const alreadyMatched = await db
      .select({ targetUserId: matches.targetUserId })
      .from(matches)
      .where(eq(matches.userId, userId));
    
    const matchedIds = alreadyMatched.map(m => m.targetUserId);
    
    const recommended = await db
      .select()
      .from(users)
      .where(
        and(
          sql`${users.id} != ${userId}`,
          matchedIds.length > 0 ? sql`${users.id} NOT IN ${matchedIds}` : sql`1=1`
        )
      )
      .orderBy(desc(users.isPremium), desc(users.isOnline), desc(users.lastSeen))
      .limit(limit);
    
    return recommended;
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
        ...message,
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
}

export const storage = new DatabaseStorage();
