import { SkeletonDashboard } from "@/components/skeletons/Dashboard";

export default async function Loading(): Promise<JSX.Element> {
  return <SkeletonDashboard />;
}
