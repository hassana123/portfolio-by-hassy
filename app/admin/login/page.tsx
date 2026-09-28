import LoginForm from "./form";
import { configured } from "@/lib/supabase";
export const metadata = {
  title: "Owner sign in",
  robots: { index: false, follow: false },
};
export default function Login() {
  return (
    <main id="main" className="login-page">
      <div className="login-card">
        <a className="wordmark" href="/">
          hassana<span>✦</span>
        </a>
        <h1>Your creative space.</h1>
        <p>
          Sign in to manage your portfolio, save drafts and publish when
          you&apos;re ready.
        </p>
        {configured() ? (
          <LoginForm />
        ) : (
          <div className="empty-state">
            <h3>Supabase setup needed</h3>
            <p>
              The public site is running in labelled demo mode. Follow README.md
              to connect Supabase and create the owner account.
            </p>
            <a className="text-link" href="/admin/demo">
              Explore dashboard demo ↗
            </a>
          </div>
        )}
        <a className="text-link" href="/">
          ← Back to the portfolio
        </a>
      </div>
    </main>
  );
}
