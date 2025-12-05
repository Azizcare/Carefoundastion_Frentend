"use client";
import { useEffect } from "react";
import HeroSlider from "@/components/HeroSlider";
import Banner from "@/components/Banner";
import TrustIndicators from "@/components/TrustIndicators";
import UrgentCampaigns from "@/components/UrgentCampaigns";
import TrendingFundraisers from "@/components/TrendingFundraisers";
import HowItWorks from "@/components/HowItWorks";
import SuccessStories from "@/components/SuccessStories";
import CausesSection from "@/components/CausesSection";
import HealthPartners from "@/components/HealthPartners";
import PopularCategories from "@/components/PopularCategories";
import FoodPartners from "@/components/FoodPartners";
import CouponsSection from "@/components/CouponsSection";
import MakeDifferenceSection from "@/components/MakeDifferenceSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import EventsSection from "@/components/EventsSection";
import ProductsSection from "@/components/ProductsSection";
import useCampaignStore from "@/store/campaignStore";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

export default function Home() {
  const { 
    getFeaturedCampaigns, 
    getTrendingCampaigns, 
    featuredCampaigns, 
    trendingCampaigns,
    isLoading 
  } = useCampaignStore();
  
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication
    initializeAuth();
    
    // Load featured and trending campaigns
    const loadCampaigns = async () => {
      try {
        await Promise.all([
          getFeaturedCampaigns(),
          getTrendingCampaigns()
        ]);
      } catch (error) {
        // Silently handle network errors - backend might be down
        if (error.message !== 'Network Error' && error.message !== 'Failed to fetch') {
          console.error("Failed to load campaigns:", error);
          toast.error("Failed to load campaigns");
        }
        // Continue with empty campaigns if API fails
      }
    };

    loadCampaigns();
  }, [getFeaturedCampaigns, getTrendingCampaigns, initializeAuth]);

  return (
    <div className="font-sans min-h-screen flex flex-col overflow-x-hidden w-full max-w-full">
      {/* Hero Slider Section */}
      <HeroSlider />
      
      {/* Main content with consistent spacing */}
      <div className="ml-2 px-2 w-full max-w-full box-border">
        <Banner />
        <TrustIndicators />
        <UrgentCampaigns />
        <TrendingFundraisers campaigns={trendingCampaigns} isLoading={isLoading} />
        <HowItWorks />
        <SuccessStories />
        <CausesSection />
        <HealthPartners />
        <FoodPartners />
        <CouponsSection />
        <PopularCategories />
        <ProductsSection />
        <EventsSection />
        <MakeDifferenceSection />
        <WhyChooseUsSection />
      </div>
    </div>
  );
}
