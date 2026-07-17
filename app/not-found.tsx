import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export default function NotFound() {
  return (
    <main className="system-page">
      <BrandMark />
      <span>404 / ROUTE NOT FOUND</span>
      <h1>This path drifted out of frame.</h1>
      <Link className="button button-primary" href="/">Return home</Link>
    </main>
  );
}
