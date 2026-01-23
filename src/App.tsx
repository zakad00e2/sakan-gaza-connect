import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import ListingDetails from "./pages/ListingDetails";
import AddListing from "./pages/AddListing";
import Safety from "./pages/Safety";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyListings from "./pages/MyListings";
import EditListing from "./pages/EditListing";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import AdminReports from "./pages/AdminReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/listing/:id" element={<ListingDetails />} />
            <Route path="/add" element={<AddListing />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/my" element={<MyListings />} />
            <Route path="/my/edit/:id" element={<EditListing />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
