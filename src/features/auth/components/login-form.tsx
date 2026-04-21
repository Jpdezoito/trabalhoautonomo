"use client";

import Link from "next/link";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [devSubmitting, setDevSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: routes.postLogin,
    });

    if (!response || response.error) {
      setError(mapLoginError(response?.error));
      setSubmitting(false);
      return;
    }

    window.location.assign(response.url || routes.postLogin);
  }

  async function handleDevAdminLogin() {
    setDevSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/dev-auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "ADMIN",
          name: "Admin Local",
          email: "admin-local@autonomopro.dev",
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Nao foi possivel iniciar a sessao local.");
      }

      window.localStorage.setItem("autonomopro.dev-auth", JSON.stringify({
        role: "ADMIN",
        name: "Admin Local",
        email: "admin-local@autonomopro.dev",
      }));
      window.location.assign(routes.admin);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao iniciar a sessao local.");
      setDevSubmitting(false);
    }
  }

  return (
    <>
      <form className="mt-6 grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
        <label className="grid gap-2 text-sm font-semibold text-[#334e68]">
          E-mail
          <input
            type="email"
            className="h-11 rounded-[8px] border border-[#cbd6d0] px-3"
            placeholder="voce@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#334e68]">
          Senha
          <input
            type="password"
            className="h-11 rounded-[8px] border border-[#cbd6d0] px-3"
            placeholder="Sua senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error ? <p className="rounded-[8px] border border-danger/30 bg-danger-soft px-3 py-2 text-sm font-semibold text-danger">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? <LoaderCircle className="mr-2 animate-spin" size={18} /> : null}
          Entrar
        </Button>
        {process.env.NODE_ENV !== "production" ? (
          <Button type="button" variant="outline" className="w-full" disabled={devSubmitting} onClick={() => void handleDevAdminLogin()}>
            {devSubmitting ? <LoaderCircle className="mr-2 animate-spin" size={18} /> : null}
            Entrar como admin local
          </Button>
        ) : null}
      </form>
      <p className="mt-4 text-right text-sm">
        <Link href={routes.recoverPassword} className="font-bold text-[#0f6b5f]">
          Esqueci minha senha
        </Link>
      </p>
      <p className="mt-5 text-center text-sm text-[#52616b]">
        Ainda nao tem conta?{" "}
        <Link href={routes.register} className="font-bold text-[#0f6b5f]">
          Cadastre-se
        </Link>
      </p>
    </>
  );
}

function mapLoginError(error?: string | null) {
  if (!error) {
    return "Nao foi possivel entrar com este e-mail e senha.";
  }

  if (error.includes("Banco de dados indisponivel")) {
    return "O login local foi bloqueado porque o banco de dados nao esta disponivel. Inicie o PostgreSQL e rode db push + seed.";
  }

  if (error === "CredentialsSignin") {
    return "Nao foi possivel entrar com este e-mail e senha.";
  }

  return error;
}
