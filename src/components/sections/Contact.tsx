import { Reveal } from "@/components/ui/Reveal";
import { Mail, MapPin, Phone } from "lucide-react";
import { SectionGlow } from "@/components/ui/SectionGlow";
import { siteConfig } from "@/lib/site-config";
import { EnquiryForm } from "./EnquiryForm";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-paper/10 bg-charcoal py-28 lg:py-36 text-paper"
    >
      <SectionGlow tone="clay" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="lg:mx-auto lg:w-3/4">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <Reveal className="md:col-span-5">
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-balance">
                Let&apos;s talk about your project.
              </h2>
              <p className="mt-5 text-paper/65 leading-relaxed max-w-md">
                Whether you&apos;re specifying materials for a single room or
                an entire development, our team can help you find the right
                surface for the space.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="md:col-span-7">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="flex flex-col gap-3">
                  <Mail className="h-5 w-5 text-accent-soft" strokeWidth={1.5} />
                  <p className="text-sm text-paper/50">Email</p>
                  <p className="text-sm">{siteConfig.contact.email}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Phone className="h-5 w-5 text-accent-soft" strokeWidth={1.5} />
                  <p className="text-sm text-paper/50">Phone</p>
                  <p className="text-sm">{siteConfig.contact.phone}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <MapPin className="h-5 w-5 text-accent-soft" strokeWidth={1.5} />
                  <p className="text-sm text-paper/50">Showroom</p>
                  <p className="text-sm">{siteConfig.contact.address}</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="mt-16">
            <EnquiryForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
