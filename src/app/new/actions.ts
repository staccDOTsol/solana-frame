"use server";

import { FrameFields } from "@/types";
// Removed PostgreSQL import
import { kv } from "@vercel/kv";

export async function createFrame(_prev: any, form: FormData) {
  // TODO: perform validation!

  // Changed database interaction to use Vercel KV
  const saved = await kv.set('frame', JSON.stringify({
    author: form.get("author"),
    frame: {
      title: form.get("frame.title"),
      description: form.get("frame.description"),
      body: form.get("frame.body"),
      denied: form.get("frame.denied"),
      gate: {
        network: Number(form.get("frame.gate.network")),
        type: form.get("frame.gate.type"),
        token: form.get("frame.gate.token"),
        balance: form.get("frame.gate.balance"),
        contract: form.get("frame.gate.contract"),
      },
      checkoutUrl: form.get("frame.checkoutUrl"),
    } as FrameFields,
  }));

  return saved;
}

