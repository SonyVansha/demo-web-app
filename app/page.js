import { hostname } from "node:os";

export const dynamic = "force-dynamic";

export default function Home() {
  const version = process.env.APP_VERSION || "dev";
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh", textAlign: "center" }}>
      <div>
        <h1>Demo Web App is running</h1>
        <p>Pod: {hostname()}</p>
        <p>Version: {version}</p>
      </div>
    </main>
  );
}
