import { Router } from "express";
import { storage } from "../storage";
import { nanoid } from "nanoid";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    isAdmin?: boolean;
  };
}

const router = Router();

// Middleware to check admin access
const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    console.log("Admin middleware - checking user:", req.user);
    
    if (!req.user) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    const user = await storage.getUser(req.user.id);
    console.log("Admin middleware - found user:", user?.email, "isAdmin:", user?.isAdmin);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin-Berechtigung erforderlich" });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ message: "Server-Fehler" });
  }
};

// Apply admin middleware to all routes EXCEPT the router itself
// The middleware is applied per route instead

// Statistics
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const userStats = await storage.getUserStats();
    const pendingImagesCount = await storage.getPendingImages(1, 1);
    
    const stats = {
      ...userStats,
      manUsers: userStats.customers, // Map customers to manUsers for frontend compatibility
      blockedUsers: 0, // TODO: implement blocked users count
      pendingImages: pendingImagesCount.total,
      activeChats: 0 // TODO: implement active chats count
    };
    
    res.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Fehler beim Laden der Benutzerstatistiken" });
  }
});

router.get("/stats/revenue", async (req, res) => {
  try {
    const stats = await storage.getRevenueStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
    res.status(500).json({ message: "Fehler beim Laden der Umsatzstatistiken" });
  }
});

// User Management
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const userType = req.query.userType as 'trans' | 'man' | undefined;

    const result = await storage.getAllUsers(page, limit, search, userType);
    res.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Fehler beim Laden der Benutzer" });
  }
});

router.put("/users/:userId", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const adminId = req.user!.id;

    const updatedUser = await storage.updateUserAsAdmin(adminId, userId, updates);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Fehler beim Aktualisieren des Benutzers" });
  }
});

router.delete("/users/:userId", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const adminId = req.user!.id;

    await storage.deleteUserAsAdmin(adminId, userId, reason);
    res.json({ message: "Benutzer erfolgreich gelöscht" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Fehler beim Löschen des Benutzers" });
  }
});

router.post("/users/:userId/block", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const adminId = req.user!.id;

    await storage.blockUser(adminId, userId, reason);
    res.json({ message: "Benutzer erfolgreich blockiert" });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: "Fehler beim Blockieren des Benutzers" });
  }
});

router.post("/users/:userId/unblock", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user!.id;

    await storage.unblockUser(adminId, userId);
    res.json({ message: "Benutzer erfolgreich entsperrt" });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ message: "Fehler beim Entsperren des Benutzers" });
  }
});

router.post("/users/:userId/premium/activate", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.body;
    const adminId = req.user!.id;

    await storage.activatePremium(adminId, userId, days);
    res.json({ message: "Premium erfolgreich aktiviert" });
  } catch (error) {
    console.error("Error activating premium:", error);
    res.status(500).json({ message: "Fehler beim Aktivieren von Premium" });
  }
});

router.post("/users/:userId/premium/deactivate", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user!.id;

    await storage.deactivatePremium(adminId, userId);
    res.json({ message: "Premium erfolgreich deaktiviert" });
  } catch (error) {
    console.error("Error deactivating premium:", error);
    res.status(500).json({ message: "Fehler beim Deaktivieren von Premium" });
  }
});

// Image Moderation
router.get("/images/pending", requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await storage.getPendingImages(page, limit);
    res.json(result);
  } catch (error) {
    console.error("Error fetching pending images:", error);
    res.status(500).json({ message: "Fehler beim Laden der zu moderierenden Bilder" });
  }
});

router.post("/images/:imageId/approve", requireAdmin, async (req, res) => {
  try {
    const { imageId } = req.params;
    const adminId = req.user!.id;

    await storage.approveImage(adminId, imageId);
    res.json({ message: "Bild erfolgreich genehmigt" });
  } catch (error) {
    console.error("Error approving image:", error);
    res.status(500).json({ message: "Fehler beim Genehmigen des Bildes" });
  }
});

router.post("/images/:imageId/reject", requireAdmin, async (req, res) => {
  try {
    const { imageId } = req.params;
    const { reason } = req.body;
    const adminId = req.user!.id;

    if (!reason) {
      return res.status(400).json({ message: "Ablehnungsgrund ist erforderlich" });
    }

    await storage.rejectImage(adminId, imageId, reason);
    res.json({ message: "Bild erfolgreich abgelehnt" });
  } catch (error) {
    console.error("Error rejecting image:", error);
    res.status(500).json({ message: "Fehler beim Ablehnen des Bildes" });
  }
});

// Admin Logs
router.get("/logs", requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const adminId = req.query.adminId as string;

    const result = await storage.getAdminLogs(page, limit, adminId);
    res.json(result);
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    res.status(500).json({ message: "Fehler beim Laden der Admin-Logs" });
  }
});

export { requireAdmin };
export default router;