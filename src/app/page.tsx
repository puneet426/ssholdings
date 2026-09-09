import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { About } from "@/components/sections/About";
import { WhyUs } from "@/components/sections/WhyUs";
import {
  CompletedProjects,
  OngoingProjects,
} from "@/components/sections/Projects";
import { ManagingPartners } from "@/components/sections/ManagingPartners";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ProjectShowcase />
        <About />
        <WhyUs />
        <CompletedProjects />
        <OngoingProjects />
        <ManagingPartners />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
