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
import Home from "@/pages/HomeNew";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import ProfileDetail from "@/pages/ProfileDetail";
import Explore from "@/pages/Explore";
import Settings from "@/pages/Settings";
import Subscribe from "@/pages/Subscribe";
import UserTypeSelection from "@/pages/UserTypeSelection";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import PrivateAlbums from "@/pages/PrivateAlbums";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/select-type" component={UserTypeSelection} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/verify-email" component={VerifyEmail} />
      
      {/* Public routes - accessible without authentication */}
      <Route path="/" component={Home} />
      <Route path="/landing" component={Landing} />
      
      {/* Protected routes - require authentication */}
      {isAuthenticated && !isLoading && (
        <>
          <Route path="/chat" component={Chat} />
          <Route path="/profile" component={ProfileDetail} />
          <Route path="/my-profile" component={Profile} />
          <Route path="/explore" component={Explore} />
          <Route path="/albums" component={PrivateAlbums} />
          <Route path="/settings" component={Settings} />
          <Route path="/subscribe" component={Subscribe} />
        </>
      )}
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
