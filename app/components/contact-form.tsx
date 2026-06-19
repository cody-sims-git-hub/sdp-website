import { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { gtagEvent } from "~/lib/analytics";

interface ContactFormProps {
  /** Destination address for the composed message. */
  email: string;
  className?: string;
}

export function ContactForm({ email, className }: ContactFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // No backend: compose a pre-filled email the visitor sends from their client.
  // To collect submissions automatically instead, point this at a form service
  // (e.g. Formspree) by setting <form action> and method="POST".
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    gtagEvent("contact_submit", { method: "contact_form" });
    const subject = form.subject || `Message from ${form.name}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  function update(field: keyof typeof form) {
    return (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 sm:p-8",
        className,
      )}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={update("name")}
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          value={form.subject}
          onChange={update("subject")}
          placeholder="What's this about?"
        />
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={update("message")}
          placeholder="Share a bit about your project or why you're reaching out."
        />
      </div>

      <Button type="submit" size="lg" className="mt-6">
        <Send className="size-4" /> Send message
      </Button>
    </form>
  );
}
