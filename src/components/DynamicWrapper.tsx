"use client";

import {
  DynamicContextProvider,
  EthereumWalletConnectors,
} from "@/lib/dynamic";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";

export default function ProviderWrapper({ children }: React.PropsWithChildren) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || "",
        walletConnectors: [EthereumWalletConnectors],
        events: {
          onAuthSuccess: (args: any) => {
            const dynamicJwtToken = getAuthToken();
            console.log(dynamicJwtToken);
            fetch("/api/increaseMultiplier", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${dynamicJwtToken}`,
              },
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  console.log("Multiplier increased successfully");
                } else {
                  console.error(
                    "Failed to increase multiplier: ",
                    data.message
                  );
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          },
          onSignedMessage: (params) => {
            console.log("onSignedMessage was called", params);
          },
        },
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
