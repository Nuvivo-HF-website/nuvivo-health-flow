import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import HowToPrepare from "@/components/HowToPrepare";
import MedicalQuiz from "@/components/MedicalQuiz";
import SponsoredAthletes from "@/components/SponsoredAthletes";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      <Hero />
      <Services />
      <MedicalQuiz />
      <HowToPrepare />
      <SponsoredAthletes />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
