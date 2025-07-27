import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Results from "./pages/Results";
import Marketplace from "./pages/Marketplace";
import BloodTests from "./pages/BloodTests";
import Booking from "./pages/Booking";
import UploadResults from "./pages/UploadResults";
import Radiology from "./pages/Radiology";
import PrivateAmbulance from "./pages/PrivateAmbulance";
import ClinicFinder from "./pages/ClinicFinder";
import ProductDetail from "./pages/ProductDetail";
import SignIn from "./pages/SignIn";
import Treatments from "./pages/Treatments";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Preparation from "./pages/Preparation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/results/:orderId" element={<Results />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/blood-tests" element={<BloodTests />} />
          <Route path="/radiology" element={<Radiology />} />
          <Route path="/private-ambulance" element={<PrivateAmbulance />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/upload-results" element={<UploadResults />} />
          <Route path="/clinic-finder" element={<ClinicFinder />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/preparation" element={<Preparation />} />
          <Route path="/professional-registration" element={<SignIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
