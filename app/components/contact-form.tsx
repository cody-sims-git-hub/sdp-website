import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { gtagEvent } from "~/lib/analytics";
import { Turnstile } from "~/components/turnstile";
import { contactConfig } from "~/lib/contact-config";
import { submitContact } from "~/lib/contact-api";

interface ContactFormProps {
  /** Fallback address shown if the API submission fails. */
  email: string;
  className?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validate the required fields; returns a map of field → message for any that fail. */
function validate(values: { name: string; email: string; message: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (!values.message.trim()) errors.message = "Please enter a message.";
  return errors;
}

/** Accessible required indicator: a visible `*` plus screen-reader-only text. */
function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="text-primary">
        *
      </span>
      <span className="sr-only">(required)</span>
    </>
  );
}

export function ContactForm({ email, className }: ContactFormProps) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [token, setToken] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      // Clear a field's error as soon as the user starts correcting it.
      setFieldErrors((prev) => {
        const key = field as keyof FieldErrors;
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const first = (["name", "email", "message"] as const).find((f) => errors[f]);
      if (first) document.getElementById(first)?.focus();
      return;
    }
    if (!token) {
      setError("Please complete the verification challenge.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setError("");
    const result = await submitContact({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
      turnstileToken: token,
      website,
    });
    if (result.ok) {
      gtagEvent("contact_submit", { method: "contact_form" });
      setStatus("success");
    } else {
      setError(result.message);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-8 text-center",
          className,
        )}
      >
        <CheckCircle2 className="mx-auto size-10 text-primary" />
        <h3 className="mt-4 text-lg font-medium text-foreground">Message sent</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for reaching out — we've got your message and Cody will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        "relative rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 sm:p-8",
        className,
      )}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <RequiredMark />
          </Label>
          <Input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={update("name")}
            placeholder="Your name"
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
          />
          {fieldErrors.name && (
            <p id="name-error" className="text-sm text-destructive">
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <RequiredMark />
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
          />
          {fieldErrors.email && (
            <p id="email-error" className="text-sm text-destructive">
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" value={form.subject} onChange={update("subject")} placeholder="What's this about?" />
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="message">
          Message <RequiredMark />
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={update("message")}
          placeholder="Share a bit about your project or why you're reaching out."
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
        />
        {fieldErrors.message && (
          <p id="message-error" className="text-sm text-destructive">
            {fieldErrors.message}
          </p>
        )}
      </div>

      {/* Honeypot: visually hidden, off-screen, not announced. Bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <Turnstile siteKey={contactConfig.turnstileSiteKey} onVerify={setToken} onExpire={() => setToken("")} />

      {status === "error" && (
        <p className="mt-4 text-sm text-red-400">
          {error}{" "}
          <a className="underline" href={`mailto:${email}`}>
            Or email us directly.
          </a>
        </p>
      )}

      <Button type="submit" size="lg" className="mt-6" disabled={status === "submitting"}>
        <Send className="size-4" /> {status === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
