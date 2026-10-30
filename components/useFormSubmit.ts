"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/config";

export type SubmitField = { label: string; value: string; type?: string };

type State = { status: "idle" | "sending" | "sent" | "error"; message: string; whatsapp: string };
const IDLE: State = { status: "idle", message: "", whatsapp: "" };

// Sends a form to /api/contact. On failure it offers a pre-filled WhatsApp message as a fallback.
export function useFormSubmit(form: string) {
  const [state, setState] = useState<State>(IDLE);

  const submit = async (fields: SubmitField[], website: string) => {
    setState({ status: "sending", message: "", whatsapp: "" });
    const whatsapp = whatsappLink(
      `Hello Workdane, ${form}:\n` + fields.filter((f) => f.value).map((f) => `${f.label}: ${f.value}`).join("\n"),
    );
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ form, fields, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; fallback?: boolean };
      if (res.ok && data.ok) {
        setState({ status: "sent", message: "", whatsapp });
        return true;
      }
      setState({
        status: "error",
        message: data.message || "Something went wrong. Please try again.",
        whatsapp: data.fallback === false ? "" : whatsapp,
      });
    } catch {
      setState({
        status: "error",
        message: "We could not reach the server. Check your connection and try again, or send this on WhatsApp.",
        whatsapp,
      });
    }
    return false;
  };

  return { ...state, sending: state.status === "sending", submit, reset: () => setState(IDLE) };
}
