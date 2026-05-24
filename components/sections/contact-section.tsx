"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { SITE, SOCIALS } from "@/lib/data";
import { Icon, type IconName } from "@/components/ui/icon";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactSection() {
  const { t } = useLang();
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const subject = encodeURIComponent(`[Site] Demande de ${name}`);
    const body = encodeURIComponent(`${message}\n\n—\nDe : ${name} <${email}>`);
    setTimeout(() => {
      window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
      form.reset();
    }, 350);
  }

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 py-24 sm:py-32 bg-[color:var(--background-alt)]"
      aria-labelledby="contact-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.contact.eyebrow}
          title={(() => {
            const words = t.contact.title.trim().split(" ");
            if (words.length < 2) {
              return <span className="text-phi-gradient">{t.contact.title}</span>;
            }
            const last = words[words.length - 1];
            const head = words.slice(0, -1).join(" ");
            return (
              <>
                {head} <span className="text-phi-gradient">{last}</span>
              </>
            );
          })()}
        />

        <div className="grid gap-8 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-4"
          >
            <a
              href={`mailto:${SITE.email}`}
              className="group flex items-start gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 hover:border-phi-cyan/60"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-phi-gradient text-white">
                <Icon name="mail" size={18} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-foreground/60">Email</p>
                <p className="text-sm font-medium group-hover:text-phi-cyan break-all">
                  {SITE.email}
                </p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-phi-gradient text-white">
                <Icon name="phone" size={18} />
              </span>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-foreground/60">Téléphone</p>
                {SITE.phones.map((p) => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/\s+/g, "")}`}
                    className="block text-sm font-medium hover:text-phi-cyan"
                  >
                    {p}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-phi-gradient text-white">
                <Icon name="mapPin" size={18} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-foreground/60">Localisation</p>
                <p className="text-sm font-medium">{SITE.location}</p>
              </div>
            </div>

            <ul className="flex gap-2 pt-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-foreground/80 hover:text-phi-cyan hover:border-phi-cyan/60"
                  >
                    <Icon name={s.icon as IconName} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={onSubmit}
            className="lg:col-span-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 sm:p-8 space-y-5"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label={t.contact.fullName} required type="text" autoComplete="name" />
              <Field id="email" label={t.contact.email} required type="email" autoComplete="email" />
            </div>
            <Field id="subject" label={t.contact.subject} type="text" />
            <Field id="message" label={t.contact.message} required as="textarea" rows={5} />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p
                className={cn(
                  "text-xs",
                  status === "error" ? "text-red-500" :
                  status === "sent" ? "text-phi-cyan" :
                  "text-foreground/60"
                )}
                aria-live="polite"
              >
                {status === "idle" && " "}
                {status === "sending" && t.contact.sending}
                {status === "sent" && t.contact.sent}
                {status === "error" && "Merci de remplir nom, email et message."}
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-phi-gradient px-6 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(0,212,255,0.55)] hover:brightness-110 disabled:opacity-60"
              >
                {status === "sending" ? t.contact.sending : t.contact.send}
                <Icon name="arrowRight" size={16} />
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  type = "text",
  as = "input",
  required = false,
  rows,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  as?: "input" | "textarea";
  required?: boolean;
  rows?: number;
  autoComplete?: string;
}) {
  const cls =
    "w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:border-phi-cyan focus:outline-none focus:ring-2 focus:ring-phi-cyan/30";
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-foreground/70">
        {label} {required && <span className="text-phi-cyan">*</span>}
      </span>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={id}
          rows={rows}
          required={required}
          className={cls}
          placeholder="…"
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          autoComplete={autoComplete}
          className={cls}
          placeholder="…"
        />
      )}
    </label>
  );
}
