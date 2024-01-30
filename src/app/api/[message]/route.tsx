import { getMessage } from "@/lib/messages";
import { getUserAddresses, verifyMessage } from "@/lib/farcaster";
import { balanceOf } from "@/lib/unlock";
import React from "react";

export const runtime = "edge";

export async function POST(
  request: Request,
  { params }: { params: { message: string } }
) {
  const message = await getMessage(params.message);
  const body = await request.json();
  const { trustedData } = body;
  if (!trustedData) {
    return new Response("Missing trustedData", { status: 441 });
  }
  const fcMessage = await verifyMessage(trustedData.messageBytes);
  if (!fcMessage.valid) {
    return new Response("Invalid message", { status: 442 });
  }

  const addresses = await getUserAddresses(fcMessage.message.data.fid);
  if (addresses.length === 0) {
    return new Response("Missing wallet addresses in your Farcaster profile!", {
      status: 200,
    });
  }

  const balances = await Promise.all(
    addresses.map((userAddress: string) => {
      return balanceOf(
        userAddress as `0x${string}`,
        message.gate.contract as `0x${string}`,
        message.gate.network
      );
    })
  );

  const isMember = balances.some((balance) => balance > 0);

  if (isMember) {
    // We would need to generate a unique URL thet renders the image in clear
    // and send that back to the user
    return new Response("<p>Hello</p>", {
      status: 200,
    });
  } else {
    return new Response(
      `Nope! do not show content... but show a button to get one!`,
      {
        status: 200,
      }
    );
  }
}
