"use client";
import { useActionState } from "react";
import { googleLogin, login } from "../actions";
export default function LoginForm() {
  const [state, action, pending] = useActionState(login, {
    ok: false,
    message: "",
  });
  return (
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
      <button
        className="button secondary"
        type="submit"
        formAction={googleLogin}
        formNoValidate
        disabled={pending}
      >
        Continue with Google
      </button>
      <p role="status">{state.message}</p>
    </form>
  );
}
