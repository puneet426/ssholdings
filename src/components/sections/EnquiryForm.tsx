"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";

interface EnquiryFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof EnquiryFormValues, string>>;

const initialValues: EnquiryFormValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

// Dummy options — edit freely, these aren't tied to anything else.
const subjectOptions = [
  "Buying a Home",
  "Investment Enquiry",
  "Project Information",
  "Site Visit Request",
  "Other",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: EnquiryFormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your full name.";
  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.phone.trim()) errors.phone = "Please enter your phone number.";
  if (!values.subject.trim()) errors.subject = "Please select an enquiry type.";
  if (!values.message.trim()) errors.message = "Please add a short message.";
  return errors;
}

const fieldClasses =
  "mt-2 w-full rounded-xl border border-paper/15 bg-paper/[0.04] px-4 py-3 text-sm text-paper placeholder:text-paper/35 outline-none transition-colors focus:border-accent-soft/50 focus:bg-paper/[0.06]";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs uppercase tracking-[0.2em] text-paper/50"
    >
      {children}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-red-400">
      {message}
    </p>
  );
}

/**
 * Frontend-only enquiry form card — rendered inside the homepage's Contact
 * section (`src/components/sections/Contact.tsx`), not a section of its
 * own. Validates, shows a success message, and resets — nothing is sent or
 * stored anywhere. To wire this up to a real backend later, swap the body
 * of `handleSubmit`'s success branch for a real request and keep everything
 * else as-is.
 */
export function EnquiryForm() {
  const [values, setValues] = useState<EnquiryFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof EnquiryFormValues>(
    field: K,
    value: string
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    if (submitted) setSubmitted(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Intentionally the only thing that happens on a valid submission —
    // no request is made, nothing is persisted.
    setSubmitted(true);
    setValues(initialValues);
  }

  return (
    <div className="rounded-2xl border border-paper/10 bg-paper/[0.03] p-6 sm:p-10">
      {submitted && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-accent-soft/30 bg-accent-soft/10 p-4 text-sm text-paper">
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-accent-soft"
            strokeWidth={1.5}
          />
          <p>Thank you! Your enquiry has been sent successfully.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="enquiry-name">Full Name</FieldLabel>
                <input
                  id="enquiry-name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={fieldClasses}
                  placeholder="Your full name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "enquiry-name-error" : undefined}
                />
                <FieldError id="enquiry-name-error" message={errors.name} />
              </div>

              <div>
                <FieldLabel htmlFor="enquiry-email">Email</FieldLabel>
                <input
                  id="enquiry-email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={fieldClasses}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "enquiry-email-error" : undefined}
                />
                <FieldError id="enquiry-email-error" message={errors.email} />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="enquiry-phone">Phone Number</FieldLabel>
                <input
                  id="enquiry-phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={fieldClasses}
                  placeholder="+91 00000 00000"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "enquiry-phone-error" : undefined}
                />
                <FieldError id="enquiry-phone-error" message={errors.phone} />
              </div>

              <div>
                <FieldLabel htmlFor="enquiry-subject">
                  Subject / Enquiry Type
                </FieldLabel>
                <div className="relative">
                  <select
                    id="enquiry-subject"
                    value={values.subject}
                    onChange={(e) => updateField("subject", e.target.value)}
                    className={`${fieldClasses} appearance-none pr-10`}
                    aria-invalid={!!errors.subject}
                    aria-describedby={
                      errors.subject ? "enquiry-subject-error" : undefined
                    }
                  >
                    <option value="" disabled className="bg-charcoal text-paper/50">
                      Select an option
                    </option>
                    {subjectOptions.map((option) => (
                      <option
                        key={option}
                        value={option}
                        className="bg-charcoal text-paper"
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-paper/40"
                    strokeWidth={1.5}
                  />
                </div>
                <FieldError id="enquiry-subject-error" message={errors.subject} />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="enquiry-message">Message</FieldLabel>
              <textarea
                id="enquiry-message"
                rows={5}
                value={values.message}
                onChange={(e) => updateField("message", e.target.value)}
                className={`${fieldClasses} resize-none`}
                placeholder="Tell us a little about what you're looking for..."
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "enquiry-message-error" : undefined}
              />
              <FieldError id="enquiry-message-error" message={errors.message} />
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-paper px-8 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
              >
                Submit Enquiry
              </button>
            </div>
      </form>
    </div>
  );
}
