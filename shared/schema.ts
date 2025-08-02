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

// Enhanced users table with custom authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  username: varchar("username"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  
  // Authentication fields
  isEmailVerified: boolean("is_email_verified").default(false),
  emailVerificationToken: varchar("email_verification_token"),
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  
  // Stripe fields
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  isPremium: boolean("is_premium").default(false),
  premiumExpiresAt: timestamp("premium_expires_at"),
  isAdmin: boolean("is_admin").default(false),
  isBlocked: boolean("is_blocked").default(false),
  lastLoginAt: timestamp("last_login_at"),
  
  // Profile fields
  age: integer("age"),
  bio: text("bio"),
  height: integer("height"), // in cm
  weight: integer("weight"), // in kg
  cockSize: integer("cock_size"), // in cm
  circumcision: varchar("circumcision").$type<'beschnitten' | 'unbeschnitten' | 'teilweise'>(),
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
  
  // Privacy settings
  showOnlineStatus: boolean("show_online_status").default(true),
  showLastSeen: boolean("show_last_seen").default(true),
  allowMessagePreviews: boolean("allow_message_previews").default(true),
  
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
  messageType: varchar("message_type").default('text').$type<'text' | 'image' | 'private_album'>(),
  privateAlbumId: varchar('private_album_id'), // For private album sharing
  privateAlbumAccessExpiresAt: timestamp('private_album_access_expires_at'), // 24h access expiry
  imageUrl: varchar("image_url"), // For photo messages
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

// Private albums for trans users
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

// Album access grants (24h temporary access)
export const albumAccess = pgTable("album_access", {
  id: varchar("id").primaryKey().notNull(),
  albumId: varchar("album_id").notNull().references(() => privateAlbums.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  grantedBy: varchar("granted_by").notNull().references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
export const registerUserSchema = createInsertSchema(users, {
  email: z.string().email("Ungültige E-Mail-Adresse"),
  passwordHash: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
  firstName: z.string().min(1, "Benutzername ist erforderlich"),
  lastName: z.string().optional(),
  userType: z.enum(['trans', 'man'], { required_error: "Benutzertyp ist erforderlich" }),
}).omit({ id: true, createdAt: true, updatedAt: true, isEmailVerified: true, lastSeen: true });

export const loginUserSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(1, "Passwort ist erforderlich"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token ist erforderlich"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verifizierungstoken ist erforderlich"),
});

// Profile update schema for both user types
export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "Vorname ist erforderlich").optional(),
  lastName: z.string().optional(),
  age: z.number().min(18, "Mindestens 18 Jahre").max(100, "Maximal 100 Jahre").optional(),
  bio: z.string().max(500, "Bio darf maximal 500 Zeichen lang sein").optional(),
  location: z.string().min(1, "Standort ist erforderlich").optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  profileImageUrl: z.string().optional(),
  profileImages: z.array(z.string()).optional(),
  // Trans escort specific fields
  height: z.number().min(140, "Mindestens 140cm").max(220, "Maximal 220cm").optional(),
  weight: z.number().min(40, "Mindestens 40kg").max(200, "Maximal 200kg").optional(),
  cockSize: z.number().min(8, "Mindestens 8cm").max(35, "Maximal 35cm").optional(),
  circumcision: z.enum(['beschnitten', 'unbeschnitten', 'teilweise']).optional(),
  position: z.enum(['top', 'bottom', 'versatile']).optional(),
  bodyType: z.string().optional(),
  ethnicity: z.string().optional(),
  services: z.array(z.string()).optional(),
  hourlyRate: z.number().min(50, "Mindestens 50€").max(1000, "Maximal 1000€").optional(),
  interests: z.array(z.string()).optional(),
});

export const sendMessageSchema = createInsertSchema(messages, {
  content: z.string().min(1, "Nachricht darf nicht leer sein"),
  receiverId: z.string().min(1, "Empfänger-ID ist erforderlich"),
}).omit({ id: true, senderId: true, createdAt: true, isRead: true });

export const createMatchSchema = createInsertSchema(matches, {
  targetUserId: z.string().min(1, "Target user ID ist erforderlich"),
  isLike: z.boolean(),
}).omit({ id: true, userId: true, createdAt: true, isMutual: true });

// Private Album schemas
export const createPrivateAlbumSchema = z.object({
  title: z.string().min(1, "Album-Titel ist erforderlich"),
  description: z.string().optional(),
});

export const updatePrivateAlbumSchema = z.object({
  title: z.string().min(1, "Album-Titel ist erforderlich").optional(),
  description: z.string().optional(),
  imageUrls: z.array(z.string().url()).optional(),
});

export const shareAlbumSchema = z.object({
  albumId: z.string().min(1, "Album-ID ist erforderlich"),
  chatRoomId: z.string().min(1, "Chat-ID ist erforderlich"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMatchSchema = createInsertSchema(matches).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertChatRoomSchema = createInsertSchema(chatRooms).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPrivateAlbumSchema = createInsertSchema(privateAlbums).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAlbumAccessSchema = createInsertSchema(albumAccess).omit({ id: true, createdAt: true });

// Image moderation table for admin dashboard
export const imageModeration = pgTable("image_moderation", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  imageUrl: varchar("image_url").notNull(),
  imageType: varchar("image_type").$type<'profile' | 'gallery'>().notNull(),
  status: varchar("status").$type<'pending' | 'approved' | 'rejected'>().default('pending'),
  moderatedBy: varchar("moderated_by").references(() => users.id),
  moderatedAt: timestamp("moderated_at"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin logs table for tracking admin actions
export const adminLogs = pgTable("admin_logs", {
  id: varchar("id").primaryKey().notNull(),
  adminId: varchar("admin_id").notNull().references(() => users.id),
  action: varchar("action").notNull(), // 'user_edit', 'user_delete', 'premium_activate', 'image_moderate', etc.
  targetId: varchar("target_id"),
  targetType: varchar("target_type"), // 'user', 'image', etc.
  details: text("details"), // Additional action details
  ipAddress: varchar("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Additional type exports
export type InsertUser = typeof users.$inferInsert;
export type UpsertUser = Partial<InsertUser> & { id?: string };
export type ImageModeration = typeof imageModeration.$inferSelect;
export type InsertImageModeration = typeof imageModeration.$inferInsert;
export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = typeof adminLogs.$inferInsert;
export type InsertMatch = typeof matches.$inferInsert;
export type InsertMessage = typeof messages.$inferInsert;
export type InsertChatRoom = typeof chatRooms.$inferInsert;
export type InsertPrivateAlbum = typeof privateAlbums.$inferInsert;
export type InsertAlbumAccess = typeof albumAccess.$inferInsert;
export type PrivateAlbumType = typeof privateAlbums.$inferSelect;
export type InsertPrivateAlbumType = typeof privateAlbums.$inferInsert;
export type AlbumAccessType = typeof albumAccess.$inferSelect;
export type InsertAlbumAccessType = typeof albumAccess.$inferInsert;

// Type definitions
export type User = typeof users.$inferSelect;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type SendMessage = z.infer<typeof sendMessageSchema>;
export type Match = typeof matches.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type ChatRoom = typeof chatRooms.$inferSelect;
export type PrivateAlbum = typeof privateAlbums.$inferSelect;
export type AlbumAccess = typeof albumAccess.$inferSelect;
export type CreateMatch = z.infer<typeof createMatchSchema>;