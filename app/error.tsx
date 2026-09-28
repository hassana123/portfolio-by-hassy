"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="detail-page">
      <h1>A little interruption.</h1>
      <p>
        The portfolio could not be loaded. Please try again. If you&apos;re the
        owner, check the Supabase connection and published site settings.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
      <a className="text-link" href="/admin/login">
        Owner sign in
      </a>
    </main>
  );
}
