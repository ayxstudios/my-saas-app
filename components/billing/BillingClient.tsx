"use client"

import { useState } from "react"
import { PLANS, PlanKey } from "@/lib/stripe"

interface BillingClientProps {
  subscriptionPlan: string | null
  subscriptionStatus: string | null
  trialEndsAt: Date | null
  stripeCurrentPeriodEnd: Date | null
  hasSubscription: boolean
}

export default function BillingClient({
  subscriptionPlan,
  subscriptionStatus,
  trialEndsAt,
  stripeCurrentPeriodEnd,
  hasSubscription,
}: BillingClientProps) {
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null)
  const [loadingPortal, setLoadingPortal] = useState(false)

  async function subscribe(plan: PlanKey) {
    setLoadingPlan(plan)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setLoadingPlan(null)
    }
  }

  async function openPortal() {
    setLoadingPortal(true)
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setLoadingPortal(false)
    }
  }

  const isTrialing = subscriptionStatus === "trialing"
  const isActive = subscriptionStatus === "active" || isTrialing
  const isCanceled = subscriptionStatus === "canceled" || !hasSubscription

  const planKeys = Object.keys(PLANS) as PlanKey[]

  return (
    <div className="space-y-8">
      {/* Current plan banner */}
      {hasSubscription && (
        <div className={`rounded-xl p-5 border ${isActive ? "bg-indigo-50 border-indigo-100" : "bg-gray-50 border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm font-semibold text-gray-900">
                  {subscriptionPlan
                    ? PLANS[subscriptionPlan as PlanKey]?.name + " Plan"
                    : "Active Subscription"}
                </h2>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isTrialing
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : isActive
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {isTrialing ? "Free Trial" : subscriptionStatus}
                </span>
              </div>

              {isTrialing && trialEndsAt && (
                <p className="text-xs text-amber-700">
                  Trial ends {new Date(trialEndsAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  {" "}— you won&apos;t be charged until then.
                </p>
              )}

              {!isTrialing && stripeCurrentPeriodEnd && (
                <p className="text-xs text-gray-500">
                  Next billing date: {new Date(stripeCurrentPeriodEnd).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              )}
            </div>

            <button
              onClick={openPortal}
              disabled={loadingPortal}
              className="text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loadingPortal ? "Loading..." : "Manage / Cancel"}
            </button>
          </div>
        </div>
      )}

      {/* Plans grid */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-1">
          {hasSubscription ? "Switch Plan" : "Choose a Plan"}
        </h2>
        <p className="text-xs text-gray-500 mb-5">All plans include a 7-day free trial. No credit card charged until trial ends.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {planKeys.map((key) => {
            const plan = PLANS[key]
            const isCurrent = subscriptionPlan === key && isActive
            const isPopular = key === "premium"

            return (
              <div
                key={key}
                className={`relative rounded-xl border p-5 flex flex-col ${
                  isCurrent
                    ? "border-indigo-400 bg-indigo-50/50 shadow-sm"
                    : isPopular
                    ? "border-indigo-200 bg-white shadow-sm"
                    : "border-gray-200 bg-white"
                }`}
              >
                {isPopular && !isCurrent && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                    Most Popular
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                    Current Plan
                  </span>
                )}

                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-900">{plan.name}</div>
                  <div className="mt-1">
                    <span className="text-2xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-xs text-gray-400">/month</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-5 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <span className="text-indigo-500 mt-0.5 shrink-0">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="text-xs text-center text-indigo-600 font-medium py-2 rounded-lg border border-indigo-200 bg-indigo-50">
                    Active
                  </div>
                ) : (
                  <button
                    onClick={() => subscribe(key)}
                    disabled={loadingPlan !== null}
                    className={`w-full text-xs font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 ${
                      isPopular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    {loadingPlan === key
                      ? "Loading..."
                      : hasSubscription
                      ? `Switch to ${plan.name}`
                      : `Start 7-day free trial`}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {isCanceled && !hasSubscription && (
        <p className="text-xs text-center text-gray-400">
          No active subscription. Start a free trial above — no credit card required for 7 days.
        </p>
      )}
    </div>
  )
}
