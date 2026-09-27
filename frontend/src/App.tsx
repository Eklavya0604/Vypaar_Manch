import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Discover from "./pages/Discover";
import BusinessProfile from "./pages/BusinessProfile";
import CreateBusiness from "./pages/CreateBusiness";
import EditBusiness from "./pages/EditBusiness";
import ConsumerHome from "./pages/ConsumerHome";
import OwnerHome from "./pages/OwnerHome";
import MapView from "./pages/MapView";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";

import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id';

const App = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/consumer" element={<ConsumerHome />} />
            <Route path="/owner" element={<OwnerHome />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/business/:slug" element={<BusinessProfile />} />
            <Route path="/business/new" element={<CreateBusiness />} />
            <Route path="/business/:id/edit" element={<EditBusiness />} />
            
            {/* Placeholder routes for new dashboard layout */}
            <Route path="/categories" element={<Placeholder />} />
            <Route path="/saved" element={<Placeholder />} />
            <Route path="/messages" element={<Placeholder />} />
            <Route path="/reviews" element={<Placeholder />} />
            <Route path="/profile" element={<Placeholder />} />
            <Route path="/settings" element={<Placeholder />} />
            <Route path="/favorites" element={<Placeholder />} />
            <Route path="/help" element={<Placeholder />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
