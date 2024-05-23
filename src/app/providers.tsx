"use client";

import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";

import { config } from "@/lib/wagmi";

export default function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
        {props.children}
    </WagmiProvider>
  );
}