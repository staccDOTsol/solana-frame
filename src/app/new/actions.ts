"use server";

import { FrameFields } from "@/types";
import { Database } from "@/types";
import { createKysely } from "@vercel/postgres-kysely";
import { ValueExpression } from "kysely";

const db = createKysely<Database>();
import { v4 as uuidv4 } from "uuid";

export async function createFrame(_prev: any, form: FormData) {


  const saved = await db
    .insertInto("frames")
    .values({
      // @ts-expect-error author should not be null
      author: form.get("author"),
      id: uuidv4() as ValueExpression<Database, "frames", `${string}-${string}-${string}-${string}-${string}` | undefined>,
      // @ts-expect-error frame format may not match, but it's json!
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
          time: new Date().getTime(),
        },
        checkoutUrl: form.get("frame.checkoutUrl"),
      } as FrameFields,
    })
    .returning(["id"])
    .executeTakeFirst();

  return saved;
}
