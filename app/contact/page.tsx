import type { Metadata } from "next"
import MarketingNav from "@/components/ui/MarketingNav"
import MarketingFooter from "@/components/ui/MarketingFooter"

export const metadata: Metadata = {
  title: "Contact Us — Flarvio",
  description: "Get in touch with the Flarvio team. We're here to help with questions about our platform, pricing, and partnerships.",
}

const contactOptions = [
  {
    icon: "💬",
    title: "General enquiries",
    desc: "Questions about our platform, features, or how Flarvio can work for your brand.",
    detail: "hello@flarvio.com",
    href: "mailto:hello@flarvio.com",
  },
  {
    icon: "🤝",
    title: "Partnerships",
    desc: "Interested in partnering with Flarvio, agency collaborations, or referral programs.",
    detail: "partners@flarvio.com",
    href: "mailto:partners@flarvio.com",
  },
  {
    icon: "📰",
    title: "Press & media",
    desc: "Media enquiries, interview requests, and press kit access.",
    detail: "press@flarvio.com",
    href: "mailto:press@flarvio.com",
  },
  {
    icon: "🛡️",
    title: "Legal & compliance",
    desc: "Privacy, data requests, compliance matters, and terms enquiries.",
    detail: "legal@flarvio.com",
    href: "mailto:legal@flarvio.com",
  },
]

const faqs = [
  {
    q: "How quickly do you respond?",
    a: "We aim to respond to all enquiries within one business day (Monday–Friday). Partnership and press enquiries may take slightly longer.",
  },
  {
    q: "Do you offer a free trial?",
    a: "Yes — every plan includes a 7-day free trial. No credit card is required until day 8.",
  },
  {
    q: "Can I book a demo?",
    a: "Absolutely. Email us at hello@flarvio.com with your name and store URL and we'll set one up.",
  },
  {
    q: "Where is Flarvio based?",
    a: "Flarvio is a fully remote company. Our team works across multiple time zones to support you wherever you are.",
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fff7ee] text-gray-900">
      <MarketingNav />

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[#e06832]/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] font-semibold mb-4">Contact</p>
          <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            We'd love to{" "}
            <span className="bg-gradient-to-r from-[#5e17eb] to-[#e06832] bg-clip-text text-transparent">
              hear from you.
            </span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Whether you have a question, want to explore a partnership, or just want to say hello — our team is here.
          </p>
        </div>
      </section>

      {/* Contact options */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {contactOptions.map(({ icon, title, desc, detail, href }) => (
              <a
                key={title}
                href={href}
                className="group flex gap-4 p-6 bg-white rounded-2xl border border-black/6 hover:border-[#5e17eb]/30 hover:shadow-md transition-all"
              >
                <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#5e17eb] transition-colors">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{desc}</p>
                  <span className="text-sm font-medium text-[#5e17eb]">{detail} →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-white/60 border-y border-black/5">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] font-semibold text-center mb-3">FAQ</p>
          <h2 className="text-3xl font-bold text-center mb-10">Common questions</h2>
          <div className="space-y-5">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl border border-black/6 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Response time banner */}
      <section className="py-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#5e17eb]/8 border border-[#5e17eb]/20 rounded-full px-5 py-2.5 text-sm text-[#5e17eb] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#5e17eb] inline-block animate-pulse"></span>
            We typically respond within one business day
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
