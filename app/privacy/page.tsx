import type { Metadata } from "next"
import MarketingNav from "@/components/ui/MarketingNav"
import MarketingFooter from "@/components/ui/MarketingFooter"

export const metadata: Metadata = {
  title: "Privacy Policy — Flarvio",
  description: "Flarvio's privacy policy. Learn how we collect, use, and protect your personal data.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fff7ee] text-gray-900">
      <MarketingNav />

      <section className="pt-40 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] font-semibold mb-4">Legal</p>
          <h1 className="text-4xl font-extrabold mb-3">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-12">Last updated: March 2026</p>

          <div className="space-y-10 text-sm leading-relaxed text-gray-600">

            <div className="bg-white rounded-2xl border border-black/6 p-6">
              <p>
                Flarvio ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights in relation to it when you use the Flarvio platform at <strong>flarvio.com</strong> and its associated applications (the "Service").
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">1. Information We Collect</h2>

              <h3 className="font-semibold text-gray-700 mb-2">Information you provide directly</h3>
              <ul className="space-y-2 list-disc list-inside text-gray-500 mb-4">
                <li>Account details: name, email address, and password when you register.</li>
                <li>Brand information: business name, brand voice, audience description, and logo submitted during onboarding.</li>
                <li>Payment information: billing details processed securely by Stripe. We do not store card numbers.</li>
                <li>Communications: any messages you send to our support or press teams.</li>
              </ul>

              <h3 className="font-semibold text-gray-700 mb-2">Information collected automatically</h3>
              <ul className="space-y-2 list-disc list-inside text-gray-500 mb-4">
                <li>Usage data: pages visited, features used, and actions taken within the platform.</li>
                <li>Device & browser information: IP address, browser type, operating system, and referring URLs.</li>
                <li>Cookies and similar technologies: session cookies and analytics cookies as described in Section 7.</li>
              </ul>

              <h3 className="font-semibold text-gray-700 mb-2">Information from third parties</h3>
              <ul className="space-y-2 list-disc list-inside text-gray-500">
                <li>Shopify: product data, images, and store information when you connect your store.</li>
                <li>Instagram & Facebook: account identifiers and publishing access when you connect your social accounts.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-500 mb-3">We use the information we collect to:</p>
              <ul className="space-y-2 list-disc list-inside text-gray-500">
                <li>Provide, operate, and improve the Service.</li>
                <li>Generate AI-powered content tailored to your brand.</li>
                <li>Process payments and manage your subscription.</li>
                <li>Send transactional emails (account confirmations, billing receipts, post scheduling alerts).</li>
                <li>Send product updates and promotional emails, where you have opted in.</li>
                <li>Respond to your support enquiries and feedback.</li>
                <li>Detect and prevent fraud, abuse, or misuse of the Service.</li>
                <li>Comply with legal obligations.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">3. Legal Basis for Processing</h2>
              <p className="text-gray-500 mb-3">We process your personal data on the following legal bases:</p>
              <ul className="space-y-2 list-disc list-inside text-gray-500">
                <li><strong className="text-gray-700">Contract performance:</strong> Processing necessary to provide the Service you have subscribed to.</li>
                <li><strong className="text-gray-700">Legitimate interests:</strong> Improving the platform, preventing fraud, and communicating about our services.</li>
                <li><strong className="text-gray-700">Consent:</strong> Marketing communications and non-essential cookies, where applicable.</li>
                <li><strong className="text-gray-700">Legal obligation:</strong> Compliance with applicable laws and regulations.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">4. Data Sharing</h2>
              <p className="text-gray-500 mb-3">We do not sell your personal data. We may share it with:</p>
              <ul className="space-y-2 list-disc list-inside text-gray-500">
                <li><strong className="text-gray-700">Stripe:</strong> For payment processing.</li>
                <li><strong className="text-gray-700">Google (Gemini AI):</strong> For AI content generation. Content submitted to the AI is processed under Google's API terms.</li>
                <li><strong className="text-gray-700">Meta (Instagram/Facebook):</strong> When publishing posts to your connected social accounts.</li>
                <li><strong className="text-gray-700">Infrastructure providers:</strong> Hosting and database services that support the platform.</li>
                <li><strong className="text-gray-700">Legal authorities:</strong> Where required by law, court order, or governmental authority.</li>
              </ul>
              <p className="text-gray-500 mt-3">All third-party processors are contractually required to protect your data and use it only for the purpose we specify.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">5. Data Retention</h2>
              <p className="text-gray-500">
                We retain your personal data for as long as your account is active or as needed to provide the Service. Upon account deletion, we will delete or anonymise your data within 90 days, except where retention is required by law (e.g. billing records, which are kept for 7 years).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">6. Data Security</h2>
              <p className="text-gray-500">
                We implement industry-standard security measures including encrypted data transmission (TLS/HTTPS), hashed password storage, and access controls. No method of transmission over the internet is 100% secure. In the event of a data breach that affects your rights and freedoms, we will notify you and relevant authorities as required by law.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">7. Cookies</h2>
              <p className="text-gray-500 mb-3">We use the following types of cookies:</p>
              <ul className="space-y-2 list-disc list-inside text-gray-500">
                <li><strong className="text-gray-700">Essential cookies:</strong> Required for authentication and core platform functionality. These cannot be disabled.</li>
                <li><strong className="text-gray-700">Analytics cookies:</strong> Help us understand how users interact with the Service (e.g. page views, feature usage). These may be disabled in your browser settings.</li>
              </ul>
              <p className="text-gray-500 mt-3">You can manage cookie preferences through your browser settings at any time.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">8. Your Rights</h2>
              <p className="text-gray-500 mb-3">Depending on your location, you may have the following rights regarding your personal data:</p>
              <ul className="space-y-2 list-disc list-inside text-gray-500">
                <li><strong className="text-gray-700">Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong className="text-gray-700">Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong className="text-gray-700">Erasure:</strong> Request deletion of your personal data ("right to be forgotten").</li>
                <li><strong className="text-gray-700">Portability:</strong> Receive your data in a structured, machine-readable format.</li>
                <li><strong className="text-gray-700">Objection:</strong> Object to processing based on legitimate interests.</li>
                <li><strong className="text-gray-700">Restriction:</strong> Request that we restrict processing of your data in certain circumstances.</li>
                <li><strong className="text-gray-700">Withdraw consent:</strong> Withdraw consent at any time for processing based on consent (e.g. marketing emails).</li>
              </ul>
              <p className="text-gray-500 mt-3">
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:legal@flarvio.com" className="text-[#5e17eb] hover:underline">legal@flarvio.com</a>.
                We will respond within 30 days.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">9. International Data Transfers</h2>
              <p className="text-gray-500">
                Your data may be processed in countries outside your own. Where we transfer data internationally, we ensure appropriate safeguards are in place (such as standard contractual clauses) to protect your information in accordance with applicable law.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">10. Children's Privacy</h2>
              <p className="text-gray-500">
                The Service is not intended for individuals under the age of 18. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us immediately so we can delete it.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">11. Changes to This Policy</h2>
              <p className="text-gray-500">
                We may update this Privacy Policy from time to time. We will notify you of material changes by email or through a notice on the platform. Your continued use of the Service after the effective date of any changes constitutes your acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">12. Contact Us</h2>
              <p className="text-gray-500">
                For privacy-related enquiries, data requests, or concerns, please contact us at{" "}
                <a href="mailto:legal@flarvio.com" className="text-[#5e17eb] hover:underline">legal@flarvio.com</a>.{" "}
                You may also visit our <a href="/contact" className="text-[#5e17eb] hover:underline">Contact page</a>.
              </p>
            </div>

          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
