"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { googleLogin, login } from "../actions";

function GoogleButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="google-sign-in"
      type="submit"
      disabled={pending}
      aria-busy={pending}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 48 48"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="#4285F4"
          d="M43.61 24.46c0-1.36-.12-2.66-.35-3.92H24v7.41h11a9.4 9.4 0 0 1-4.08 6.17v5h6.6c3.86-3.55 6.09-8.78 6.09-14.66z"
        />
        <path
          fill="#34A853"
          d="M24 44c5.51 0 10.13-1.83 13.52-4.95l-6.6-5c-1.83 1.22-4.17 1.95-6.92 1.95-5.33 0-9.85-3.6-11.47-8.45H5.71v5.18A20 20 0 0 0 24 44z"
        />
        <path
          fill="#FBBC05"
          d="M12.53 27.55a12 12 0 0 1 0-7.1v-5.18H5.71a20 20 0 0 0 0 17.46z"
        />
        <path
          fill="#EA4335"
          d="M24 12c3 0 5.69 1.03 7.81 3.05l5.86-5.86A19.66 19.66 0 0 0 24 4a20 20 0 0 0-18.29 11.27l6.82 5.18C14.15 15.6 18.67 12 24 12z"
        />
      </svg>
      <span>{pending ? "Connecting to Google…" : "Continue with Google"}</span>
    </button>
  );
}
export default function LoginForm() {
  const [state, action, pending] = useActionState(login, {
    ok: false,
    message: "",
  });
  return (
    <>
      <form action={googleLogin} className="google-sign-in-form">
        <GoogleButton />
      </form>
      <div className="login-divider">
        <span>or sign in with email</span>
      </div>
      <form action={action}>
        <label className="admin-field">
          Email
          <input type="email" name="email" autoComplete="username" required />
        </label>
        <label className="admin-field">
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </label>
        <button className="button" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
        <p role="status">{state.message}</p>
      </form>
    </>
  );
}
