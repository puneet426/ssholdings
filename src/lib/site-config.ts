// Central site-wide configuration. Keep values here rather than inline in
// components so they're a single edit to change everywhere they're used.

export const siteConfig = {
  /**
   * The WhatsApp enquiry link, used verbatim wherever it's needed (currently
   * the global WhatsAppButton). Replace this one string to point the whole
   * site at a different number/message — nothing else needs to change.
   */
  whatsappUrl:
    "https://wa.me/919100673147?text=%E2%80%8E%20Hi%2C%20I%20came%20across%20your%20projects%20and%20really%20liked%20what%20I%20saw.%20I%E2%80%99d%20love%20to%20know%20more%20about%20your%20available%20properties%20and%20upcoming%20projects.%0A",

  /** Real contact details — shown in the footer and the homepage Contact section. */
  contact: {
    address: "Rushikonda, Visakhapatnam",
    phone: "+91 90142 45781",
    email: "info@ssholdings.com",
  },

  /**
   * Social profile links. Dummy placeholders — replace each with the real
   * profile URL when available; the Email icon isn't in here since it opens
   * a mailto: built from `contact.email` above instead.
   */
  social: {
    instagram: "https://instagram.com/ssholdings",
    youtube: "https://youtube.com/@ssholdings",
    linkedin: "https://linkedin.com/company/ssholdings",
  },
};
