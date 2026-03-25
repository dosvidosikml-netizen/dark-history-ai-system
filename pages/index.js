import dynamic from "next/dynamic";

const DarkHistoryAISystem = dynamic(
  () => import("../components/DarkHistoryAISystem"),
  { ssr: false }
);

export default function Home() {
  return <DarkHistoryAISystem />;
}
