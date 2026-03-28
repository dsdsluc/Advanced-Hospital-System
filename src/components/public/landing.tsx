import { HeroSection } from "@/components/public/sections/hero";
import { StatsSection } from "@/components/public/sections/stats";
import { ServicesSection } from "@/components/public/sections/services";
import { DoctorsSection } from "@/components/public/sections/doctors";
import { WhyChooseSection } from "@/components/public/sections/why-choose";
import { AccreditationsSection } from "@/components/public/sections/accreditations";
import { AppointmentCtaSection } from "@/components/public/sections/appointment-cta";
import { TestimonialsSection } from "@/components/public/sections/testimonials";

export function PublicLanding() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <DoctorsSection />
      <WhyChooseSection />
      <AccreditationsSection />
      <AppointmentCtaSection />
      <TestimonialsSection />
    </div>
  );
}
