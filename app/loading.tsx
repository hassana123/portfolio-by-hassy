// The public data request can take a moment on a cold Supabase connection.
// Keep route transitions neutral so the homepage Hero is the only card
// entrance animation visitors see.
export default function Loading() {
  return (
    <div className="portfolio-loading">
      <p className="portfolio-loading-note" role="status">
        Loading your latest portfolio content…
      </p>
    </div>
  );
}
