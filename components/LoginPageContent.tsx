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
      className="relative min-h-screen overflow-hidden bg-slate-950 text-white"
      style={{
        backgroundImage:
          "linear-gradient(110deg, rgba(2,6,23,0.88) 0%, rgba(15,23,42,0.82) 36%, rgba(6,78,59,0.7) 100%), url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.08),_transparent_26%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] items-center px-5 py-8 lg:px-10">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1.2fr_520px] lg:gap-14">
          <section className="flex items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur">
                <Landmark className="h-4.5 w-4.5 text-amber-300" />
                Government of Haryana
              </div>

              <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-[3.75rem] lg:leading-[1.08]">
                Haryana Forest Survey & Demarcation GIS Portal
              </h1>

              <p className="mt-5 text-lg font-medium text-emerald-100/95">
                Forest Settlement Officer, Government of Haryana
              </p>

              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200">
                Digitizing Forest Boundaries with Precision and Transparency. A
                secure operational platform for forest settlement monitoring,
                boundary verification, and executive review.
              </p>

              <div className="mt-8 grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
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

          <section className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-[460px] rounded-[32px] border border-white/75 bg-white/96 p-6 text-slate-950 shadow-[0_40px_90px_-46px_rgba(15,23,42,0.7)] backdrop-blur md:p-8">
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
                    <User2 className="h-4.5 w-4.5 text-slate-400" />
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
                    <Lock className="h-4.5 w-4.5 text-slate-400" />
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
