import { Link } from "wouter";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function AdminNavButton() {
  const { user } = useAuth();

  // Only show admin button for admin users
  if (!user?.isAdmin) {
    return null;
  }

  return (
    <Link href="/admin">
      <Button 
        variant="outline" 
        size="sm"
        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
      >
        <Shield className="w-4 h-4 mr-2" />
        Admin
      </Button>
    </Link>
  );
}