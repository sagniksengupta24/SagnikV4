"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="system-page">
      <span>RUNTIME / RECOVERABLE ERROR</span>
      <h1>The interface failed safely.</h1>
      <p>The page hit a recoverable render issue. Retry the render or return to the homepage.</p>
      <button className="button button-primary" type="button" onClick={reset}>Retry</button>
    </main>
  );
}
