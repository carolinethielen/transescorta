import type { Express, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import session from "express-session";
import connectPg from "connect-pg-simple";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { storage } from "./storage";
import { nanoid } from "nanoid";

// JWT Secret - in production this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Email transporter (mock for now - replace with real SMTP)
const emailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  });
}

export async function setupCustomAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Register endpoint with reCAPTCHA
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName, userType, recaptchaToken } = req.body;

      // Validate input
      if (!email || !password || !firstName || !userType) {
        return res.status(400).json({ 
          message: 'E-Mail, Passwort, Vorname und Benutzertyp sind erforderlich' 
        });
      }

      // Verify reCAPTCHA
      if (recaptchaToken) {
        try {
          const secretKey = '6LeWxo4rAAAAAM_WkdIvA07SVVkjN7kHZroiKcJ9';
          const verifyURL = 'https://www.google.com/recaptcha/api/siteverify';
          
          const response = await fetch(verifyURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${secretKey}&response=${recaptchaToken}`,
          });

          const result = await response.json();
          
          if (!result.success || result.score < 0.5 || result.action !== 'register') {
            return res.status(400).json({ 
              message: 'reCAPTCHA-Verifikation fehlgeschlagen. Bitte versuche es erneut.' 
            });
          }
        } catch (error) {
          console.error('reCAPTCHA verification error:', error);
          return res.status(400).json({ 
            message: 'Sicherheitsüberprüfung fehlgeschlagen' 
          });
        }
      }

      if (password.length < 8) {
        return res.status(400).json({ 
          message: 'Passwort muss mindestens 8 Zeichen lang sein' 
        });
      }

      if (!['trans', 'man'].includes(userType)) {
        return res.status(400).json({ 
          message: 'Ungültiger Benutzertyp' 
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          message: 'E-Mail-Adresse bereits registriert' 
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);
      
      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');

      // Create user
      const newUser = await storage.createUser({
        id: nanoid(),
        email,
        passwordHash,
        firstName,
        lastName: lastName || '',
        userType: userType as 'trans' | 'man',
        emailVerificationToken,
        isEmailVerified: false,
      });

      // Send verification email (mock for now)
      try {
        await emailTransporter.sendMail({
          from: process.env.EMAIL_FROM || 'noreply@transescorta.com',
          to: email,
          subject: 'E-Mail-Adresse bestätigen - TransEscorta',
          html: `
            <h2>Willkommen bei TransEscorta!</h2>
            <p>Hallo ${firstName},</p>
            <p>Bitte bestätige deine E-Mail-Adresse, indem du auf den folgenden Link klickst:</p>
            <a href="${req.protocol}://${req.get('host')}/verify-email?token=${emailVerificationToken}">
              E-Mail bestätigen
            </a>
            <p>Falls du dich nicht registriert hast, ignoriere diese E-Mail.</p>
          `
        });
      } catch (emailError) {
        console.log('Email sending failed (using mock):', emailError);
      }

      // Create session
      (req.session as any).userId = newUser.id;

      res.status(201).json({
        message: 'Registrierung erfolgreich! Bitte bestätige deine E-Mail-Adresse.',
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          userType: newUser.userType,
          isEmailVerified: newUser.isEmailVerified,
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Registrierung fehlgeschlagen' });
    }
  });

  // Login endpoint with reCAPTCHA
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password, recaptchaToken } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          message: 'E-Mail und Passwort sind erforderlich' 
        });
      }

      // Verify reCAPTCHA
      if (recaptchaToken) {
        try {
          const secretKey = '6LeWxo4rAAAAAM_WkdIvA07SVVkjN7kHZroiKcJ9';
          const verifyURL = 'https://www.google.com/recaptcha/api/siteverify';
          
          const response = await fetch(verifyURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${secretKey}&response=${recaptchaToken}`,
          });

          const result = await response.json();
          
          if (!result.success || result.score < 0.5 || result.action !== 'login') {
            return res.status(400).json({ 
              message: 'reCAPTCHA-Verifikation fehlgeschlagen. Bitte versuche es erneut.' 
            });
          }
        } catch (error) {
          console.error('reCAPTCHA verification error:', error);
          return res.status(400).json({ 
            message: 'Sicherheitsüberprüfung fehlgeschlagen' 
          });
        }
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          message: 'Ungültige E-Mail oder Passwort' 
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ 
          message: 'Ungültige E-Mail oder Passwort' 
        });
      }

      // Create session
      (req.session as any).userId = user.id;

      // Update online status
      await storage.updateUserOnlineStatus(user.id, true);

      res.json({
        message: 'Anmeldung erfolgreich',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          isEmailVerified: user.isEmailVerified,
          profileImageUrl: user.profileImageUrl,
          isPremium: user.isPremium,
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Anmeldung fehlgeschlagen' });
    }
  });

  // Logout endpoint
  app.post('/api/auth/logout', async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      
      if (userId) {
        await storage.updateUserOnlineStatus(userId, false);
      }

      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
          return res.status(500).json({ message: 'Abmeldung fehlgeschlagen' });
        }
        
        res.clearCookie('connect.sid');
        res.json({ message: 'Erfolgreich abgemeldet' });
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Abmeldung fehlgeschlagen' });
    }
  });

  // Forgot password endpoint
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'E-Mail-Adresse ist erforderlich' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal that user doesn't exist
        return res.json({ 
          message: 'Falls eine Konto mit dieser E-Mail existiert, wurde ein Reset-Link versendet.' 
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour

      await storage.setPasswordResetToken(user.id, resetToken, resetExpires);

      // Send reset email (mock for now)
      try {
        await emailTransporter.sendMail({
          from: process.env.EMAIL_FROM || 'noreply@transconnect.com',
          to: email,
          subject: 'Passwort zurücksetzen - TransConnect',
          html: `
            <h2>Passwort zurücksetzen</h2>
            <p>Du hast eine Passwort-Reset-Anfrage gestellt.</p>
            <p>Klicke auf den folgenden Link, um dein Passwort zurückzusetzen:</p>
            <a href="${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}">
              Passwort zurücksetzen
            </a>
            <p>Dieser Link ist 1 Stunde gültig.</p>
            <p>Falls du diese Anfrage nicht gestellt hast, ignoriere diese E-Mail.</p>
          `
        });
      } catch (emailError) {
        console.log('Email sending failed (using mock):', emailError);
      }

      res.json({ 
        message: 'Falls eine Konto mit dieser E-Mail existiert, wurde ein Reset-Link versendet.' 
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Fehler beim Versenden der E-Mail' });
    }
  });

  // Reset password endpoint
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ message: 'Token und Passwort sind erforderlich' });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: 'Passwort muss mindestens 8 Zeichen lang sein' });
      }

      const user = await storage.getUserByPasswordResetToken(token);
      if (!user || !user.passwordResetExpires || new Date() > user.passwordResetExpires) {
        return res.status(400).json({ message: 'Ungültiger oder abgelaufener Token' });
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(password, 12);

      // Update password and clear reset token
      await storage.updatePassword(user.id, passwordHash);

      res.json({ message: 'Passwort erfolgreich geändert' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Fehler beim Zurücksetzen des Passworts' });
    }
  });

  // Verify email endpoint
  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ message: 'Verifizierungstoken ist erforderlich' });
      }

      const user = await storage.getUserByEmailVerificationToken(token);
      if (!user) {
        return res.status(400).json({ message: 'Ungültiger Verifizierungstoken' });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({ message: 'E-Mail bereits verifiziert' });
      }

      await storage.verifyUserEmail(user.id);

      res.json({ message: 'E-Mail erfolgreich verifiziert' });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ message: 'Fehler bei der E-Mail-Verifizierung' });
    }
  });
}

// Custom authentication middleware
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req.session as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Add user to request object
    (req as any).user = { id: user.id };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: "Unauthorized" });
  }
};