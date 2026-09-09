import type { Metadata } from "next";
import { ProjectListing } from "@/components/project/ProjectListing";

export const metadata: Metadata = {
  title: "Ongoing Projects",
  description:
    "Residential developments currently under construction by SS Holdings in Visakhapatnam.",
};

export default function OngoingProjectsPage() {
  return (
    <ProjectListing
      status="Ongoing"
      eyebrow="Under Construction"
      title="Ongoing Projects"
      intro="The homes we are building right now across Visakhapatnam."
      otherHref="/projects"
      otherLabel="View Completed Projects"
    />
  );
}
