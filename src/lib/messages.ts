import { Frame } from "@/types";
import { kv } from "@vercel/kv";

export const getMessage = async (id: string): Promise<Frame | null> => {
  const frameJson: any = await kv.get(`frame-${id}`);
  return frameJson ? JSON.parse(frameJson) : null;
};
