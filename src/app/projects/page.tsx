import type { Metadata } from "next";
import { ProjectListing } from "@/components/project/ProjectListing";

export const metadata: Metadata = {
  title: "Completed Projects",
  description:
    "Residential developments completed and handed over by SS Holdings across Visakhapatnam.",
};

export default function CompletedProjectsPage() {
  return (
    <ProjectListing
      status="Completed"
      eyebrow="Our Developments"
      title="Completed Projects"
      intro="Homes we have designed, built and handed over across Visakhapatnam."
      otherHref="/projects/ongoing"
      otherLabel="View Ongoing Projects"
    />
  );
}
