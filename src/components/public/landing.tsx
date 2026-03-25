import { HeroSection } from "@/components/public/sections/hero";
import { ServicesSection } from "@/components/public/sections/services";
import { DoctorsSection } from "@/components/public/sections/doctors";
import { WhyChooseSection } from "@/components/public/sections/why-choose";
import { AppointmentCtaSection } from "@/components/public/sections/appointment-cta";
import { TestimonialsSection } from "@/components/public/sections/testimonials";

export function PublicLanding() {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <DoctorsSection />
      <WhyChooseSection />
      <AppointmentCtaSection />
      <TestimonialsSection />
    </div>
  );
}

