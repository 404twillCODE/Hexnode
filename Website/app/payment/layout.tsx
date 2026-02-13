import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment",
  description: "Nodexity payment — complete your purchase securely.",
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
