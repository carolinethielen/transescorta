import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "@/pages/HomeNew";
import ChatMainNew from "@/pages/ChatMainNew";
import Profile from "@/pages/Profile";
import ProfileEditUnified from "@/pages/ProfileEditUnified";
import EscortProfile from "@/pages/EscortProfile";
import Explore from "@/pages/Explore";
import Settings from "@/pages/Settings";
import Subscribe from "@/pages/Subscribe";
import Premium from "@/pages/Premium";
import PremiumSuccess from "@/pages/PremiumSuccess";
import PremiumDeclined from "@/pages/PremiumDeclined";
import UserTypeSelection from "@/pages/UserTypeSelection";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import PrivateAlbums from "@/pages/PrivateAlbums";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't show loading for unauthenticated users - just show the app
  if (isLoading && isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      {/* Authentication routes - always accessible */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/select-type" component={UserTypeSelection} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/verify-email" component={VerifyEmail} />
      
      {/* Public routes - always accessible */}
      <Route path="/" component={Home} />
      <Route path="/landing" component={Landing} />
      
      {/* Protected routes - require authentication */}
      {isAuthenticated && (
        <>
          <Route path="/chat" component={ChatMainNew} />
          <Route path="/my-profile" component={Profile} />
          <Route path="/profile/edit" component={ProfileEditUnified} />
          <Route path="/settings" component={Settings} />
          {/* Albums only for trans escorts */}
          <Route path="/albums" component={PrivateAlbums} />
          {/* Premium subscription only for trans escorts */}
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/premium" component={Premium} />
        </>
      )}
      
      {/* Premium success/failure routes - accessible without auth for payment callbacks */}
      <Route path="/premium-success" component={PremiumSuccess} />
      <Route path="/premium-declined" component={PremiumDeclined} />
      
      {/* Profile viewing - accessible but may require auth for contact */}
      <Route path="/profile/:userId" component={EscortProfile} />
      <Route path="/profile" component={EscortProfile} />
      <Route path="/explore" component={Explore} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Layout>
            <Router />
          </Layout>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
