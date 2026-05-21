import type { Metadata } from "next";
import OshiTracker from "./_components/OshiTracker";

export const metadata: Metadata = {
  title: "推し活費用トラッカー",
};

export default function OshiPage() {
  return <OshiTracker />;
}
