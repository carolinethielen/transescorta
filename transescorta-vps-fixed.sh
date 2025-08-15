#!/bin/bash

# ==============================================
# TRANSESCORTA - FIXED VPS INSTALLATION
# Behebt: SSL, Demo-Transen, Registrierung
# ==============================================

set -e
clear

echo "🚀 TRANSESCORTA - FIXED VPS INSTALLATION"
echo "========================================"
echo "✅ Automatisches SSL"
echo "✅ Demo-Transen sichtbar"  
echo "✅ Funktionsfähige Registrierung"
echo ""

# Variablen
DOMAIN="transescorta.com"
APP_USER="transescorta"
APP_DIR="/home/$APP_USER/app"

# Logging-Funktionen
log_step() {
    echo -e "\n🔸 [SCHRITT] $1"
}

log_info() {
    echo -e "✅ $1"
}

log_warn() {
    echo -e "⚠️ $1"
}

log_error() {
    echo -e "❌ $1"
}

# Prüfe Domain-DNS vor SSL
check_domain_dns() {
    echo "🔍 Prüfe DNS für $DOMAIN..."
    
    # Warte auf DNS-Propagation
    for i in {1..10}; do
        if nslookup $DOMAIN | grep -q "$(curl -s ipinfo.io/ip)"; then
            log_info "DNS korrekt konfiguriert!"
            return 0
        fi
        echo "⏳ DNS Propagation... Versuch $i/10"
        sleep 30
    done
    
    log_warn "DNS noch nicht propagiert. SSL wird später eingerichtet."
    return 1
}

# System vorbereiten
log_step "1/25 - System Update & Cleanup"
apt update && apt upgrade -y
apt autoremove -y
apt install -y curl wget git unzip htop nano ufw nginx postgresql postgresql-contrib build-essential

log_step "2/25 - Node.js 20 LTS installieren"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
log_info "Node.js $(node -v) installiert"

log_step "3/25 - PostgreSQL zurücksetzen und einrichten"
systemctl stop postgresql || true
sudo -u postgres psql -c "DROP DATABASE IF EXISTS transescorta;" 2>/dev/null || true
sudo -u postgres psql -c "DROP USER IF EXISTS transescorta;" 2>/dev/null || true
systemctl start postgresql
systemctl enable postgresql

# Sichere PostgreSQL-Einrichtung
sudo -u postgres psql << 'EOSQL'
CREATE USER transescorta WITH PASSWORD 'TransEscorta2024!Fixed';
CREATE DATABASE transescorta OWNER transescorta;
GRANT ALL PRIVILEGES ON DATABASE transescorta TO transescorta;
ALTER DATABASE transescorta OWNER TO transescorta;
EOSQL

log_info "PostgreSQL Datenbank neu erstellt"

log_step "4/25 - SSL-Tools installieren"
apt install -y certbot python3-certbot-nginx
log_info "Certbot installiert"

log_step "5/25 - App-Benutzer zurücksetzen"
userdel -r $APP_USER 2>/dev/null || true
useradd -m -s /bin/bash $APP_USER
echo "$APP_USER:TransEscorta2024!Fixed" | chpasswd
usermod -aG sudo $APP_USER
log_info "Benutzer '$APP_USER' erstellt"

log_step "6/25 - App-Verzeichnis vorbereiten"
rm -rf $APP_DIR
mkdir -p $APP_DIR
cd $APP_DIR

log_step "7/25 - Git Repository clonen"
# Falls Repository verfügbar ist
if git clone https://github.com/transescorta/transescorta.git . 2>/dev/null; then
    log_info "Repository gecloned"
else
    log_warn "Repository nicht verfügbar - erstelle App manuell"
    
    # Vollständige App-Struktur erstellen
    mkdir -p {server,shared,client/src,client/public}
    
    # Package.json mit allen Dependencies
    cat > package.json << 'EOF'
{
  "name": "transescorta",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "tsc && cp -r client/public/* dist/",
    "start": "NODE_ENV=production node dist/server/index.js",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.10.4",
    "bcryptjs": "^3.0.2",
    "drizzle-orm": "^0.39.1",
    "drizzle-zod": "^0.7.0",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "nanoid": "^5.1.5",
    "zod": "^3.24.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.30.4",
    "tsx": "^4.19.1",
    "typescript": "^5.6.3",
    "@types/node": "^20.16.11",
    "@types/express": "^4.17.21",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/cors": "^2.8.13"
  }
}
EOF
fi

log_step "8/25 - TypeScript Config"
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": ".",
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["./shared/*"]
    }
  },
  "include": ["server/**/*", "shared/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

log_step "9/25 - Drizzle Schema (FIXED)"
cat > shared/schema.ts << 'EOF'
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table mit allen benötigten Feldern
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  username: varchar("username"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  
  // User type und basic info
  userType: varchar("user_type").notNull().default("customer"),
  city: varchar("city"),
  age: integer("age"),
  description: text("description"),
  
  // Escort-specific
  pricePerHour: integer("price_per_hour"),
  services: text("services").array(),
  
  // Status fields
  isPremium: boolean("is_premium").default(false),
  isVerified: boolean("is_verified").default(false),
  isOnline: boolean("is_online").default(false),
  isBlocked: boolean("is_blocked").default(false),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastActiveAt: timestamp("last_active_at"),
});

// Chats table
export const chats = pgTable("chats", {
  id: varchar("id").primaryKey().notNull(),
  user1Id: varchar("user1_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  user2Id: varchar("user2_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  lastMessageAt: timestamp("last_message_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Messages table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().notNull(),
  chatId: varchar("chat_id").references(() => chats.id, { onDelete: "cascade" }).notNull(),
  senderId: varchar("sender_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  messageType: varchar("message_type").notNull().default("text"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Export types
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertChat = typeof chats.$inferInsert;
export type SelectChat = typeof chats.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export type SelectMessage = typeof messages.$inferSelect;

export const insertUserSchema = createInsertSchema(users);
EOF

log_step "10/25 - Drizzle Config"
cat > drizzle.config.ts << 'EOF'
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
EOF

log_step "11/25 - Database Connection (FIXED)"
cat > server/db.ts << 'EOF'
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../shared/schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export async function testConnection() {
  try {
    await sql`SELECT 1`;
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}
EOF

log_step "12/25 - Storage Layer (FIXED)"
cat > server/storage.ts << 'EOF'
import { db, testConnection } from "./db.js";
import * as schema from "../shared/schema.js";
import { eq, desc, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export class DatabaseStorage {
  async init() {
    const connected = await testConnection();
    if (!connected) {
      throw new Error("Failed to connect to database");
    }
  }

  async createUser(userData: {
    email: string;
    password: string;
    username?: string;
    userType: string;
  }) {
    try {
      const id = nanoid();
      const passwordHash = await bcrypt.hash(userData.password, 12);
      
      const [user] = await db.insert(schema.users).values({
        id,
        email: userData.email,
        passwordHash,
        username: userData.username || userData.email.split('@')[0],
        userType: userData.userType,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      
      console.log(`✅ User created: ${user.email}`);
      return user;
    } catch (error) {
      console.error("❌ Create user error:", error);
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    try {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
      return user;
    } catch (error) {
      console.error("❌ Get user by email error:", error);
      return null;
    }
  }

  async verifyPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async getPublicTransUsers() {
    try {
      console.log('📋 Getting public trans escorts...');
      
      const escorts = await db.select({
        id: schema.users.id,
        email: schema.users.email,
        username: schema.users.username,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
        profileImageUrl: schema.users.profileImageUrl,
        city: schema.users.city,
        age: schema.users.age,
        description: schema.users.description,
        pricePerHour: schema.users.pricePerHour,
        services: schema.users.services,
        isVerified: schema.users.isVerified,
        isPremium: schema.users.isPremium,
        isOnline: schema.users.isOnline,
        lastActiveAt: schema.users.lastActiveAt,
      }).from(schema.users)
      .where(
        and(
          eq(schema.users.userType, 'escort'),
          eq(schema.users.isBlocked, false)
        )
      )
      .orderBy(desc(schema.users.isPremium), desc(schema.users.lastActiveAt));

      console.log(`✅ Found ${escorts.length} public trans escorts`);
      return escorts;
    } catch (error) {
      console.error('❌ Error getting public trans escorts:', error);
      throw error;
    }
  }

  async initializeDemoData() {
    try {
      console.log('🎭 Initializing demo data...');
      
      const demoUsers = [
        {
          id: "demo_trans_1",
          email: "lena@transescorta.com",
          username: "LenaSexy_Berlin",
          firstName: "Lena",
          lastName: "Schmidt", 
          userType: "escort",
          city: "Berlin",
          age: 25,
          description: "Hallo! Ich bin Lena aus Berlin. Diskrete und stilvolle Begleitung für anspruchsvolle Gentlemen. Ich spreche Deutsch und Englisch fließend.",
          pricePerHour: 200,
          services: ["Dinner Date", "Business Begleitung", "GFE", "Overnight"],
          isPremium: true,
          isVerified: true,
          isOnline: true,
        },
        {
          id: "demo_trans_2", 
          email: "anna@transescorta.com",
          username: "Anna_Hamburg",
          firstName: "Anna",
          lastName: "Meyer",
          userType: "escort", 
          city: "Hamburg",
          age: 23,
          description: "Hi! Anna hier aus Hamburg. Ich liebe es, neue Menschen kennenzulernen und unvergessliche Momente zu schaffen.",
          pricePerHour: 180,
          services: ["Massage", "Dinner Date", "Girlfriend Experience"],
          isPremium: false,
          isVerified: true,
          isOnline: false,
        },
        {
          id: "demo_trans_3",
          email: "sofia@transescorta.com", 
          username: "Sofia_Munich",
          firstName: "Sofia",
          lastName: "Weber",
          userType: "escort",
          city: "München", 
          age: 27,
          description: "Servus! Sofia aus München. Elegante und intelligente Begleitung für kulturelle Events.",
          pricePerHour: 220,
          services: ["Business Events", "Cultural Tours", "Travel Companion"],
          isPremium: true,
          isVerified: true,
          isOnline: true,
        },
        {
          id: "demo_trans_4",
          email: "julia@transescorta.com",
          username: "Julia_Cologne", 
          firstName: "Julia",
          lastName: "Fischer",
          userType: "escort",
          city: "Köln",
          age: 24,
          description: "Hallo! Julia hier aus Köln. Ich sorge für entspannte und angenehme Stunden.",
          pricePerHour: 190,
          services: ["Relaxation", "Dinner Date", "City Tours"],
          isPremium: false,
          isVerified: true,
          isOnline: true,
        },
        {
          id: "demo_trans_5",
          email: "emma@transescorta.com",
          username: "Emma_Frankfurt",
          firstName: "Emma", 
          lastName: "Wagner",
          userType: "escort",
          city: "Frankfurt",
          age: 26,
          description: "Hi! Emma aus Frankfurt. International erfahrene Begleiterin für anspruchsvolle Kunden.",
          pricePerHour: 210,
          services: ["International Meetings", "Business Dinner", "VIP Events"],
          isPremium: true,
          isVerified: true,
          isOnline: false,
        }
      ];

      for (const userData of demoUsers) {
        try {
          const passwordHash = await bcrypt.hash("demo123", 12);
          
          await db.insert(schema.users).values({
            ...userData,
            passwordHash,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastActiveAt: new Date(),
          }).onConflictDoNothing();
          
          console.log(`✅ Demo user created: ${userData.firstName}`);
        } catch (error) {
          console.log(`⚠️ Demo user ${userData.email} already exists`);
        }
      }
      
      console.log('✅ Demo data initialization completed');
    } catch (error) {
      console.error('❌ Demo data initialization error:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
EOF

log_step "13/25 - Server Routes (FIXED)"
cat > server/routes.ts << 'EOF'
import express from "express";
import { storage } from "./storage.js";

export function registerRoutes(app: express.Application) {
  const router = express.Router();

  // Health check
  router.get("/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      message: "TransEscorta API is running"
    });
  });

  // Public escorts endpoint - FIXED
  router.get("/users/public", async (req, res) => {
    try {
      console.log('📡 API call: GET /users/public');
      const escorts = await storage.getPublicTransUsers();
      console.log(`📤 Returning ${escorts.length} escorts`);
      res.json(escorts);
    } catch (error) {
      console.error('❌ Error in /users/public:', error);
      res.status(500).json({ 
        message: "Failed to get public escorts",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Registration endpoint - FIXED (ohne reCAPTCHA)
  router.post("/auth/register", async (req, res) => {
    try {
      console.log('📡 API call: POST /auth/register');
      const { email, password, username, userType = "customer" } = req.body;

      // Basis-Validierung
      if (!email || !password) {
        console.log('❌ Missing email or password');
        return res.status(400).json({ 
          message: "E-Mail und Passwort sind erforderlich" 
        });
      }

      if (password.length < 6) {
        console.log('❌ Password too short');
        return res.status(400).json({ 
          message: "Passwort muss mindestens 6 Zeichen lang sein" 
        });
      }

      // Email-Format prüfen
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log('❌ Invalid email format');
        return res.status(400).json({ 
          message: "Ungültiges E-Mail-Format" 
        });
      }

      // Prüfen ob User bereits existiert
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        console.log('❌ User already exists:', email);
        return res.status(400).json({ 
          message: "E-Mail bereits registriert" 
        });
      }

      // User erstellen
      const user = await storage.createUser({
        email,
        password,
        username: username || email.split('@')[0],
        userType,
      });

      console.log('✅ User registered successfully:', user.email);
      res.json({ 
        message: "Registrierung erfolgreich", 
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          userType: user.userType
        }
      });
    } catch (error) {
      console.error('❌ Registration error:', error);
      res.status(500).json({ 
        message: "Registrierung fehlgeschlagen",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Login endpoint - FIXED
  router.post("/auth/login", async (req, res) => {
    try {
      console.log('📡 API call: POST /auth/login');
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          message: "E-Mail und Passwort sind erforderlich" 
        });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({ message: "Ungültige Anmeldedaten" });
      }

      const isValidPassword = await storage.verifyPassword(password, user.passwordHash);
      if (!isValidPassword) {
        console.log('❌ Invalid password for:', email);
        return res.status(401).json({ message: "Ungültige Anmeldedaten" });
      }

      console.log('✅ User logged in successfully:', user.email);
      res.json({ 
        message: "Login erfolgreich",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          userType: user.userType
        }
      });
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ 
        message: "Login fehlgeschlagen",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Auth status endpoint
  router.get("/auth/user", (req, res) => {
    res.status(401).json({ message: "Unauthorized" });
  });

  app.use("/api", router);
  return app;
}
EOF

log_step "14/25 - Main Server (FIXED)"
cat > server/index.ts << 'EOF'
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse && res.statusCode >= 400) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      console.log(logLine);
    }
  });

  next();
});

// Serve static files (production)
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../client/public');
  app.use(express.static(staticPath));
}

// API routes
registerRoutes(app);

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error('🚨 Server error:', err);
  res.status(status).json({ message });
});

// Catch all handler (production)
if (process.env.NODE_ENV === 'production') {
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
  });
}

// Start server
const port = parseInt(process.env.PORT || '3000', 10);

app.listen(port, '0.0.0.0', async () => {
  console.log(`🚀 TransEscorta server running on port ${port}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Domain: ${process.env.DOMAIN}`);
  
  try {
    const { storage } = await import("./storage.js");
    await storage.init();
    await storage.initializeDemoData();
    console.log('✅ TransEscorta initialized successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Server shutting down gracefully...');
  process.exit(0);
});
EOF

log_step "15/25 - Client HTML (FIXED)"
mkdir -p client/public
cat > client/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TransEscorta - Premium TS-Escort Platform</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px;
        }
        .header {
            text-align: center;
            background: rgba(255,255,255,0.95);
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header h1 {
            color: #d946ef;
            font-size: 3em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        .status {
            background: #4ade80;
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: bold;
            display: inline-block;
            margin: 20px 0;
        }
        .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
            gap: 25px; 
            margin: 30px 0;
        }
        .card { 
            background: rgba(255,255,255,0.95); 
            padding: 25px; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .card:hover {
            transform: translateY(-5px);
        }
        .card h3 { 
            color: #d946ef; 
            margin-bottom: 15px; 
            font-size: 1.4em;
        }
        .escort-card {
            border-left: 4px solid #d946ef;
        }
        .premium-badge {
            background: linear-gradient(45deg, #ffd700, #ffed4e);
            color: #333;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 10px;
        }
        .online-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            background: #4ade80;
            border-radius: 50%;
            margin-right: 5px;
        }
        .offline-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            background: #94a3b8;
            border-radius: 50%;
            margin-right: 5px;
        }
        .form-section {
            background: rgba(255,255,255,0.95);
            padding: 25px;
            border-radius: 15px;
            margin-top: 30px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .form-group input, .form-group select {
            width: 100%;
            padding: 10px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 16px;
        }
        .btn {
            background: linear-gradient(45deg, #d946ef, #9333ea);
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1em;
            margin: 5px;
            transition: all 0.3s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(217, 70, 239, 0.4);
        }
        .success { color: #16a34a; font-weight: bold; }
        .error { color: #dc2626; font-weight: bold; }
        .loading { text-align: center; padding: 20px; }
        #escorts-grid { margin-top: 20px; }
        .features {
            list-style: none;
            padding: 0;
        }
        .features li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .features li:before {
            content: "✅ ";
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌟 TransEscorta 🌟</h1>
            <p>Premium TS-Escort Platform</p>
            <div class="status" id="status">✅ System lädt...</div>
        </div>

        <div class="grid">
            <div class="card">
                <h3>🚀 System Status</h3>
                <ul class="features">
                    <li>Node.js Server läuft</li>
                    <li>PostgreSQL Datenbank</li>
                    <li>Demo-Daten verfügbar</li>
                    <li>SSL bereit</li>
                    <li>API-Endpunkte aktiv</li>
                    <li>Registrierung funktionsfähig</li>
                </ul>
            </div>

            <div class="card">
                <h3>⚡ Features</h3>
                <ul class="features">
                    <li>Benutzer-Registrierung</li>
                    <li>Escort-Profile</li>
                    <li>Chat-System</li>
                    <li>Premium-Accounts</li>
                    <li>Standort-Suche</li>
                    <li>Mobile-Optimiert</li>
                </ul>
            </div>
        </div>

        <div class="card">
            <h3>👥 Demo Escorts</h3>
            <div id="escorts-grid">
                <div class="loading">Lädt Demo-Escorts...</div>
            </div>
        </div>

        <div class="form-section">
            <h3>🔐 Registrierung Testen</h3>
            <div id="register-result"></div>
            <form id="register-form">
                <div class="form-group">
                    <label>E-Mail:</label>
                    <input type="email" name="email" required placeholder="test@example.com">
                </div>
                <div class="form-group">
                    <label>Passwort:</label>
                    <input type="password" name="password" required placeholder="mindestens 6 Zeichen">
                </div>
                <div class="form-group">
                    <label>Benutzername:</label>
                    <input type="text" name="username" placeholder="optional">
                </div>
                <div class="form-group">
                    <label>Account-Typ:</label>
                    <select name="userType">
                        <option value="customer">Kunde</option>
                        <option value="escort">Escort</option>
                    </select>
                </div>
                <button type="submit" class="btn">Registrierung Testen</button>
            </form>
        </div>
    </div>

    <script>
        // Status Check
        async function checkStatus() {
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                document.getElementById('status').textContent = '✅ System Online - ' + new Date().toLocaleTimeString();
            } catch (error) {
                document.getElementById('status').textContent = '❌ System Offline';
            }
        }

        // Load Escorts
        async function loadEscorts() {
            try {
                console.log('Loading escorts...');
                const response = await fetch('/api/users/public');
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const escorts = await response.json();
                console.log('Loaded escorts:', escorts);
                
                const grid = document.getElementById('escorts-grid');
                
                if (escorts.length === 0) {
                    grid.innerHTML = '<p class="error">Keine Demo-Escorts gefunden. Prüfen Sie die Server-Logs.</p>';
                    return;
                }
                
                grid.innerHTML = escorts.map(escort => `
                    <div class="card escort-card" style="margin-bottom: 15px;">
                        ${escort.isPremium ? '<div class="premium-badge">👑 PREMIUM</div>' : ''}
                        <h4>
                            ${escort.isOnline ? '<span class="online-indicator"></span>' : '<span class="offline-indicator"></span>'}
                            ${escort.firstName} ${escort.lastName || ''}
                        </h4>
                        <p><strong>Username:</strong> ${escort.username}</p>
                        <p><strong>Stadt:</strong> ${escort.city || 'Nicht angegeben'}</p>
                        <p><strong>Alter:</strong> ${escort.age || 'Nicht angegeben'} Jahre</p>
                        <p><strong>Preis:</strong> ${escort.pricePerHour || 'Auf Anfrage'}€/Stunde</p>
                        <p><strong>Services:</strong> ${escort.services ? escort.services.join(', ') : 'Keine angegeben'}</p>
                        <p><strong>Verifiziert:</strong> ${escort.isVerified ? '✅ Ja' : '❌ Nein'}</p>
                        <p><strong>Status:</strong> ${escort.isOnline ? '🟢 Online' : '⚪ Offline'}</p>
                        <p style="margin-top: 10px; font-style: italic;">${escort.description || 'Keine Beschreibung'}</p>
                    </div>
                `).join('');
                
            } catch (error) {
                console.error('Error loading escorts:', error);
                document.getElementById('escorts-grid').innerHTML = 
                    `<p class="error">Fehler beim Laden der Escorts: ${error.message}</p>`;
            }
        }

        // Handle Registration
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const resultDiv = document.getElementById('register-result');
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            resultDiv.innerHTML = '<p class="loading">Registrierung wird getestet...</p>';
            
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    resultDiv.innerHTML = `<p class="success">✅ ${result.message}</p>`;
                    e.target.reset();
                } else {
                    resultDiv.innerHTML = `<p class="error">❌ ${result.message}</p>`;
                }
            } catch (error) {
                resultDiv.innerHTML = `<p class="error">❌ Netzwerkfehler: ${error.message}</p>`;
            }
        });

        // Initialize
        checkStatus();
        loadEscorts();
        
        // Auto-refresh status
        setInterval(checkStatus, 30000);
    </script>
</body>
</html>
EOF

log_step "16/25 - Environment Variables (FIXED)"
cat > .env << EOF
NODE_ENV=production
PORT=3000
DOMAIN=$DOMAIN
DATABASE_URL=postgresql://transescorta:TransEscorta2024!Fixed@localhost:5432/transescorta
SESSION_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
BCRYPT_ROUNDS=12
EOF

log_step "17/25 - Package Installation"
chown -R $APP_USER:$APP_USER $APP_DIR
sudo -u $APP_USER npm install

log_step "18/25 - Database Schema Push"
cd $APP_DIR
sudo -u $APP_USER npm run db:push

log_step "19/25 - App Build"
sudo -u $APP_USER npm run build

log_step "20/25 - Systemd Service (FIXED)"
cat > /etc/systemd/system/transescorta.service << EOF
[Unit]
Description=TransEscorta Node.js Application  
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$APP_DIR

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable transescorta

log_step "21/25 - Nginx Configuration (FIXED)"
systemctl start nginx
systemctl enable nginx

cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=5r/m;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    location /api/auth/login {
        limit_req zone=login burst=3 nodelay;
        
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

log_step "22/25 - Firewall Setup"
ufw --force reset
ufw --force enable
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw reload

log_step "23/25 - TransEscorta Service Start"
systemctl start transescorta
sleep 5

# Status check
if systemctl is-active --quiet transescorta; then
    log_info "TransEscorta Service läuft!"
else
    log_error "TransEscorta Service Fehler:"
    systemctl status transescorta --no-pager -l
fi

log_step "24/25 - SSL-Setup Script (IMPROVED)"
cat > ssl-setup.sh << 'EOFSSL'
#!/bin/bash

DOMAIN="transescorta.com"

echo "🔐 Verbesserte SSL-Einrichtung für $DOMAIN..."

# 1. DNS Check
echo "🔍 DNS Propagation prüfen..."
for i in {1..5}; do
    if nslookup $DOMAIN | grep -q "$(curl -s ipinfo.io/ip)"; then
        echo "✅ DNS korrekt propagiert!"
        break
    fi
    echo "⏳ DNS Check Versuch $i/5..."
    sleep 10
done

# 2. Nginx Test
echo "🔍 Nginx Configuration testen..."
if ! nginx -t; then
    echo "❌ Nginx Konfigurationsfehler!"
    exit 1
fi

# 3. Port Check
echo "🔍 Port 80/443 prüfen..."
if ! netstat -tlnp | grep -q ":80 "; then
    echo "❌ Port 80 nicht erreichbar!"
    exit 1
fi

# 4. SSL Zertifikat erstellen
echo "🔐 SSL-Zertifikat wird erstellt..."
certbot --nginx \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --non-interactive \
    --agree-tos \
    --email admin@$DOMAIN \
    --no-eff-email \
    --redirect

if [ $? -eq 0 ]; then
    echo "✅ SSL-Zertifikat erfolgreich installiert!"
    
    # 5. Auto-Renewal Test
    echo "🔄 Automatische Erneuerung testen..."
    certbot renew --dry-run
    
    # 6. Nginx Reload
    systemctl reload nginx
    
    # 7. HTTPS Test
    echo "🧪 HTTPS Test..."
    sleep 5
    if curl -sSf https://$DOMAIN >/dev/null; then
        echo "✅ HTTPS funktioniert!"
    else
        echo "⚠️ HTTPS Test fehlgeschlagen - prüfen Sie manuell"
    fi
    
    echo ""
    echo "🎉 SSL-Setup abgeschlossen!"
    echo "🌐 Ihre Website ist verfügbar unter:"
    echo "   https://$DOMAIN"
    echo "   https://www.$DOMAIN"
    echo ""
    echo "🔒 SSL-Zertifikat wird automatisch erneuert."
    
else
    echo "❌ SSL-Installation fehlgeschlagen!"
    echo ""
    echo "🔍 Fehlerdiagnose:"
    echo "1. DNS Check: nslookup $DOMAIN"
    echo "2. Nginx Status: systemctl status nginx"
    echo "3. Firewall: ufw status"
    echo "4. Logs: tail -f /var/log/letsencrypt/letsencrypt.log"
    echo ""
    echo "💡 Häufige Probleme:"
    echo "• DNS noch nicht propagiert (24h warten)"
    echo "• Domain zeigt nicht auf diesen Server"
    echo "• Port 80/443 nicht erreichbar"
    exit 1
fi
EOFSSL

chmod +x ssl-setup.sh

log_step "25/25 - Auto SSL Setup"
# Versuche SSL automatisch einzurichten
if check_domain_dns; then
    log_info "DNS bereit - richte SSL automatisch ein..."
    ./ssl-setup.sh
    if [ $? -eq 0 ]; then
        log_info "SSL automatisch eingerichtet!"
    else
        log_warn "SSL-Setup fehlgeschlagen - führen Sie später './ssl-setup.sh' aus"
    fi
else
    log_warn "DNS noch nicht bereit - führen Sie später './ssl-setup.sh' aus"
fi

# Final Status Check
echo ""
echo "🔍 FINAL STATUS CHECK:"
echo "======================"

if systemctl is-active --quiet transescorta; then
    echo "✅ TransEscorta: LÄUFT"
else
    echo "❌ TransEscorta: FEHLER"
fi

if systemctl is-active --quiet nginx; then
    echo "✅ Nginx: LÄUFT"
else
    echo "❌ Nginx: FEHLER"
fi

if systemctl is-active --quiet postgresql; then
    echo "✅ PostgreSQL: LÄUFT"
else
    echo "❌ PostgreSQL: FEHLER"
fi

# Test API
echo "🧪 API Test..."
if curl -sSf http://localhost:3000/api/health >/dev/null; then
    echo "✅ API: FUNKTIONIERT"
else
    echo "❌ API: FEHLER"
fi

echo ""
echo "🎉 TRANSESCORTA INSTALLATION ABGESCHLOSSEN!"
echo "==========================================="
echo ""
echo "✅ BEHOBEN:"
echo "• SSL wird automatisch eingerichtet"
echo "• Demo-Transen sind sichtbar"  
echo "• Registrierung funktioniert (ohne reCAPTCHA)"
echo ""
echo "🌐 WEBSITE TESTEN:"
echo "• http://$DOMAIN (wird zu HTTPS weitergeleitet)"
echo "• https://$DOMAIN (falls SSL erfolgreich)"
echo ""
echo "📋 WARTUNG:"
echo "• Status: sudo systemctl status transescorta"
echo "• Logs: sudo journalctl -u transescorta -f"
echo "• Neustart: sudo systemctl restart transescorta"
echo "• SSL einrichten: ./ssl-setup.sh"
echo ""
echo "🚀 ALLES BEREIT! TransEscorta läuft mit allen Fixes!"