"use client";

type CsrfResponse = {
  csrfToken?: string;
};

type AuthActionResponse = {
  url?: string;
};

type CredentialsSignInResult = {
  error: string | null;
  ok: boolean;
  status: number;
  url: string | null;
};

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T;

  if (!response.ok) {
    throw new Error(`Auth request failed with status ${response.status}.`);
  }

  return payload;
}

async function getCsrfToken() {
  const response = await fetch("/api/auth/csrf", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const payload = await readJson<CsrfResponse>(response);

  if (!payload.csrfToken) {
    throw new Error("Nao foi possivel validar a sessao de autenticacao.");
  }

  return payload.csrfToken;
}

export async function signInWithCredentials(params: {
  email: string;
  password: string;
  callbackUrl: string;
}): Promise<CredentialsSignInResult> {
  const csrfToken = await getCsrfToken();
  const response = await fetch("/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      email: params.email,
      password: params.password,
      csrfToken,
      callbackUrl: params.callbackUrl,
      json: "true",
    }),
  });
  const payload = (await response.json()) as AuthActionResponse;
  const url = payload.url ?? params.callbackUrl;
  const error = new URL(url, window.location.origin).searchParams.get("error");

  return {
    error,
    ok: response.ok,
    status: response.status,
    url: error ? null : url,
  };
}

export async function signOutFromNextAuth(callbackUrl: string) {
  const csrfToken = await getCsrfToken();
  const response = await fetch("/api/auth/signout", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      csrfToken,
      callbackUrl,
      json: "true",
    }),
  });
  const payload = await readJson<AuthActionResponse>(response);

  window.location.assign(payload.url ?? callbackUrl);
}
