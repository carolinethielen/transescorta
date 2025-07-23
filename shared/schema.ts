import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  isPremium: boolean("is_premium").default(false),
  age: integer("age"),
  bio: text("bio"),
  height: integer("height"), // in cm
  weight: integer("weight"), // in kg
  cockSize: integer("cock_size"), // in cm
  position: varchar("position").$type<'top' | 'bottom' | 'versatile'>(),
  bodyType: varchar("body_type"),
  ethnicity: varchar("ethnicity"),
  services: jsonb("services").$type<string[]>().default([]),
  hourlyRate: integer("hourly_rate"), // in EUR
  location: varchar("location"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  interests: jsonb("interests").$type<string[]>().default([]),
  profileImages: jsonb("profile_images").$type<string[]>().default([]), // Array of multiple profile images
  userType: varchar("user_type").$type<'trans' | 'man'>().default('trans'),
  isOnline: boolean("is_online").default(false),
  lastSeen: timestamp("last_seen"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Matches table
export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  targetUserId: varchar("target_user_id").notNull().references(() => users.id),
  isLike: boolean("is_like").notNull(),
  isMutual: boolean("is_mutual").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().notNull(),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat rooms table
export const chatRooms = pgTable("chat_rooms", {
  id: varchar("id").primaryKey().notNull(),
  user1Id: varchar("user1_id").notNull().references(() => users.id),
  user2Id: varchar("user2_id").notNull().references(() => users.id),
  lastMessageId: varchar("last_message_id").references(() => messages.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;
export type Match = typeof matches.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertChatRoom = typeof chatRooms.$inferInsert;
export type ChatRoom = typeof chatRooms.$inferSelect;

// Validation schemas
export const updateProfileSchema = createInsertSchema(users).pick({
  firstName: true,
  lastName: true,
  age: true,
  bio: true,
  height: true,
  weight: true,
  cockSize: true,
  position: true,
  bodyType: true,
  ethnicity: true,
  services: true,
  hourlyRate: true,
  location: true,
  interests: true,
}).extend({
  age: z.number().min(18).max(100),
  bio: z.string().max(500),
  height: z.number().min(150).max(220).optional(),
  weight: z.number().min(40).max(150).optional(),
  cockSize: z.number().min(10).max(30).optional(),
  hourlyRate: z.number().min(50).max(1000).optional(),
});

export const createMatchSchema = createInsertSchema(matches).pick({
  targetUserId: true,
  isLike: true,
});

export const sendMessageSchema = createInsertSchema(messages).pick({
  receiverId: true,
  content: true,
}).extend({
  content: z.string().min(1).max(1000),
});

// Private albums table for escort photo galleries
export const privateAlbums = pgTable("private_albums", {
  id: varchar("id").primaryKey().notNull(),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  imageUrls: jsonb("image_urls").$type<string[]>().default([]),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Album access permissions - who can view which private albums
export const albumAccess = pgTable("album_access", {
  id: varchar("id").primaryKey().notNull(),
  albumId: varchar("album_id").notNull().references(() => privateAlbums.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  grantedBy: varchar("granted_by").notNull().references(() => users.id),
  grantedAt: timestamp("granted_at").defaultNow(),
});

export type PrivateAlbum = typeof privateAlbums.$inferSelect;
export type InsertPrivateAlbum = typeof privateAlbums.$inferInsert;
export type AlbumAccess = typeof albumAccess.$inferSelect;
export type InsertAlbumAccess = typeof albumAccess.$inferInsert;

export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type CreateMatch = z.infer<typeof createMatchSchema>;
export type SendMessage = z.infer<typeof sendMessageSchema>;
