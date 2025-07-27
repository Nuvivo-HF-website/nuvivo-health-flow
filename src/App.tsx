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
import ServiceDetail from "./pages/ServiceDetail";
import SignIn from "./pages/SignIn";
import Treatments from "./pages/Treatments";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Preparation from "./pages/Preparation";
import NotFound from "./pages/NotFound";
import MedicalReports from "./pages/MedicalReports";
import ConsultationsMentalHealth from "./pages/ConsultationsMentalHealth";
import ConsultationsNutrition from "./pages/ConsultationsNutrition";
import ConsultationsSexualHealth from "./pages/ConsultationsSexualHealth";
import ConsultationsSecondOpinions from "./pages/ConsultationsSecondOpinions";
import ScansECG from "./pages/ScansECG";
import ScansCancer from "./pages/ScansCancer";
import MobileHomeCollection from "./pages/MobileHomeCollection";
import MobileSampleDropoff from "./pages/MobileSampleDropoff";
import MobileCorporate from "./pages/MobileCorporate";
import JoinProfessional from "./pages/JoinProfessional";
import PartnerRegister from "./pages/PartnerRegister";
import PartnerDashboard from "./pages/PartnerDashboard";
import AdminReferrals from "./pages/AdminReferrals";
import AIReportGenerator from "./pages/AIReportGenerator";

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
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/preparation" element={<Preparation />} />
          <Route path="/professional-registration" element={<SignIn />} />
          <Route path="/medical-reports" element={<MedicalReports />} />
          <Route path="/consultations/mental-health" element={<ConsultationsMentalHealth />} />
          <Route path="/consultations/nutrition" element={<ConsultationsNutrition />} />
          <Route path="/consultations/sexual-health" element={<ConsultationsSexualHealth />} />
          <Route path="/consultations/second-opinions" element={<ConsultationsSecondOpinions />} />
          <Route path="/scans/ecg" element={<ScansECG />} />
          <Route path="/scans/cancer" element={<ScansCancer />} />
          <Route path="/mobile/home-collection" element={<MobileHomeCollection />} />
          <Route path="/mobile/sample-dropoff" element={<MobileSampleDropoff />} />
          <Route path="/mobile/corporate" element={<MobileCorporate />} />
          <Route path="/join-professional" element={<JoinProfessional />} />
          <Route path="/partner-register" element={<PartnerRegister />} />
          <Route path="/partner-dashboard" element={<PartnerDashboard />} />
          <Route path="/admin-referrals" element={<AdminReferrals />} />
          <Route path="/ai-report-generator" element={<AIReportGenerator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
