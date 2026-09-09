import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { EnquiryForm } from "./EnquiryForm";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-bg py-13 text-fg sm:py-16 lg:py-20"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="lg:mx-auto lg:w-3/4">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <Reveal className="md:col-span-5">
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-balance">
                Contact Us
              </h2>
              <p className="mt-5 text-fg/65 leading-relaxed max-w-md">
                Whether you&apos;re looking to buy a flat or looking for a
                trusted developer for your next project, get in touch with us.
                We&apos;d be happy to discuss your requirements.
              </p>

              {/* Same CTA as the footer's — reuses `whatsappUrl` so the
                 pre-filled enquiry message stays in one place. */}
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-inverse px-6 py-3 text-sm font-medium text-inverse-fg transition-transform hover:scale-[1.03]"
              >
                Enquire on WhatsApp
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </Reveal>

            <Reveal delay={0.15} className="md:col-span-7">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <Mail className="h-5 w-5 text-accent-soft" strokeWidth={1.5} />
                  <p className="text-sm text-fg/50">Email</p>
                  <p className="text-sm">{siteConfig.contact.email}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Phone className="h-5 w-5 text-accent-soft" strokeWidth={1.5} />
                  <p className="text-sm text-fg/50">Phone</p>
                  <p className="text-sm">{siteConfig.contact.phone}</p>
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
