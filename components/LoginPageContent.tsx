"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Landmark, Lock, ShieldCheck, Trees, User2 } from "lucide-react";

export default function LoginPageContent() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("Invalid credentials");
        setIsSubmitting(false);
        return;
      }

      router.replace("/canvas");
      router.refresh();
    } catch {
      setError("Unable to process login. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="relative min-h-dvh overflow-hidden bg-slate-950 text-white"
      style={{
        backgroundImage:
          "linear-gradient(110deg, rgba(2,6,23,0.88) 0%, rgba(15,23,42,0.82) 36%, rgba(6,78,59,0.7) 100%), url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.08),_transparent_26%)]" />

      <div className="relative mx-auto flex min-h-dvh max-w-[min(100rem,100%)] items-center px-4 py-6 md:px-6 md:py-8 lg:px-10">
        <div className="grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,28.75rem)] md:items-center md:gap-8 lg:gap-12 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,32.5rem)]">
          <section className="flex min-w-0 items-center">
            <div className="min-w-0 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white/90 backdrop-blur sm:gap-3 sm:px-4 sm:py-2">
                <Landmark className="h-4 w-4 shrink-0 text-amber-300 sm:h-[1.125rem] sm:w-[1.125rem]" />
                Government of Haryana
              </div>

              <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white sm:mt-8 sm:text-3xl md:text-4xl lg:text-[3.25rem] lg:leading-[1.1] xl:text-[3.75rem] xl:leading-[1.08]">
                Haryana Forest Survey & Demarcation GIS Portal
              </h1>

              <p className="mt-4 text-base font-medium text-emerald-100/95 sm:mt-5 sm:text-lg">
                Forest Settlement Officer, Government of Haryana
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:mt-4 sm:text-base sm:leading-8">
                Digitizing Forest Boundaries with Precision and Transparency. A
                secure operational platform for forest settlement monitoring,
                boundary verification, and executive review.
              </p>

              <div className="mt-6 grid max-w-2xl grid-cols-1 gap-3 min-[480px]:grid-cols-3 sm:gap-4 md:mt-8">
                <div className="rounded-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
                  <Trees className="h-5 w-5 text-emerald-300" />
                  <p className="mt-4 text-sm font-semibold text-white">
                    Forest Monitoring
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Verified spatial records for settlement and demarcation.
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
                  <ShieldCheck className="h-5 w-5 text-sky-300" />
                  <p className="mt-4 text-sm font-semibold text-white">
                    Trusted Access
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Secure entry for official users and supervised review.
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
                  <Landmark className="h-5 w-5 text-amber-300" />
                  <p className="mt-4 text-sm font-semibold text-white">
                    Executive Reporting
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Decision-ready dashboards for district and state oversight.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center md:justify-end">
            <div className="w-full max-w-[28.75rem] rounded-[2rem] border border-white/75 bg-white/96 p-5 text-slate-950 shadow-[0_40px_90px_-46px_rgba(15,23,42,0.7)] backdrop-blur sm:p-6 md:max-w-none md:rounded-[32px] md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Secure Login
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    Official Access Only
                  </h2>
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Lock className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                Sign in to access the GIS map, analytics canvas, and
                district-level review tools.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Username
                  </span>
                  <div className="flex items-center gap-3 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-emerald-300 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.08)]">
                    <User2 className="h-[1.125rem] w-[1.125rem] shrink-0 text-slate-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="Enter username"
                      className="w-full bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
                      autoComplete="username"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </span>
                  <div className="flex items-center gap-3 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-emerald-300 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.08)]">
                    <Lock className="h-[1.125rem] w-[1.125rem] shrink-0 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
                      autoComplete="current-password"
                    />
                  </div>
                </label>

                {error ? (
                  <div className="rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-[20px] bg-[linear-gradient(90deg,_#0f172a_0%,_#064e3b_100%)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_20px_40px_-24px_rgba(15,23,42,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_50px_-24px_rgba(15,23,42,0.58)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Signing in..." : "Login"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
