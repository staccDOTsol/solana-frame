"use client";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Form } from "./Form";

const NotConnected = () => {
  return (
    <div className="prose p-2">
      <p>Please start by connecting a wallet.</p>
    </div>
  );
};

export default function NewFrame() {
  const wallet = useAnchorWallet();

  return (
    <>
      {!wallet && <NotConnected />}
      {wallet?.publicKey && <Form />}
    </>
  );
}
