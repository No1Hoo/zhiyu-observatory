import { getTopicsAndAds } from "@/lib/queries/admin";
import TopicsAdsClient from "./TopicsAdsClient";

export const dynamic = "force-dynamic";

export default async function TopicsAdsPage() {
  const { topics, adSlots } = await getTopicsAndAds();
  return <TopicsAdsClient topics={topics} adSlots={adSlots} />;
}