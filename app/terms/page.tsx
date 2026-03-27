import type { Metadata } from "next"
import MarketingNav from "@/components/ui/MarketingNav"
import MarketingFooter from "@/components/ui/MarketingFooter"

export const metadata: Metadata = {
  title: "Terms & Conditions — Flarvio",
  description: "Flarvio terms and conditions of service. Read our terms before using the Flarvio platform.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fff7ee] text-gray-900">
      <MarketingNav />

      <section className="pt-40 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#5e17eb] font-semibold mb-4">Legal</p>
          <h1 className="text-4xl font-extrabold mb-3">Terms &amp; Conditions</h1>
          <p className="text-sm text-gray-400 mb-12">Last updated: March 2026</p>

          <div className="prose prose-gray max-w-none space-y-10 text-sm leading-relaxed text-gray-600">

            <div className="bg-white rounded-2xl border border-black/6 p-6">
              <p className="text-gray-600">
                These Terms and Conditions ("Terms") govern your access to and use of the Flarvio platform, available at <strong>flarvio.com</strong> and its associated applications (the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use the Service.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">1. Definitions</h2>
              <ul className="space-y-2 list-disc list-inside text-gray-500">
                <li><strong className="text-gray-700">"Flarvio", "we", "us", "our"</strong> refers to Flarvio and its operators.</li>
                <li><strong className="text-gray-700">"User", "you", "your"</strong> refers to the individual or entity accessing or using the Service.</li>
                <li><strong className="text-gray-700">"Content"</strong> refers to any text, images, captions, posts, or other material generated through or uploaded to the Service.</li>
                <li><strong className="text-gray-700">"Subscription"</strong> refers to a paid plan granting access to the Service's features.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">2. Eligibility</h2>
              <p className="text-gray-500">
                You must be at least 18 years of age and have the legal authority to enter into binding agreements to use the Service. By using Flarvio, you represent that you meet these requirements. If you are using the Service on behalf of a business, you represent that you have the authority to bind that business to these Terms.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">3. Account Registration</h2>
              <p className="text-gray-500 mb-3">
                To access the Service you must create an account. You agree to:
              </p>
              <ul className="space-y-2 list-disc list-inside text-gray-500">
                <li>Provide accurate, current, and complete information during registration.</li>
                <li>Maintain and promptly update your account information.</li>
                <li>Keep your password confidential and not share access with unauthorised third parties.</li>
                <li>Notify us immediately at <a href="mailto:hello@flarvio.com" className="text-[#5e17eb] hover:underline">hello@flarvio.com</a> if you suspect unauthorised access to your account.</li>
              </ul>
              <p className="text-gray-500 mt-3">You are responsible for all activity that occurs under your account.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">4. Subscriptions & Billing</h2>
              <p className="text-gray-500 mb-3">
                Flarvio offers subscription plans billed on a monthly basis. By subscribing, you authorise us to charge your payment method on a recurring basis.
              </p>
              <ul className="space-y-2 list-disc list-inside text-gray-500">
                <li><strong className="text-gray-700">Free trial:</strong> Every plan includes a 7-day free trial. Your payment method will not be charged until the trial period ends.</li>
                <li><strong className="text-gray-700">Cancellation:</strong> You may cancel your subscription at any time. Your access will continue until the end of the current billing period. No partial refunds are issued for unused time.</li>
                <li><strong className="text-gray-700">Price changes:</strong> We reserve the right to change subscription prices with 30 days' notice. Continued use after the notice period constitutes acceptance of the new pricing.</li>
                <li><strong className="text-gray-700">Taxes:</strong> Prices shown exclude applicable taxes, which may be added at checkout based on your location.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">5. Acceptable Use</h2>
              <p className="text-gray-500 mb-3">You agree not to use the Service to:</p>
              <ul className="space-y-2 list-disc list-inside text-gray-500">
                <li>Violate any applicable laws or regulations.</li>
                <li>Publish content that is defamatory, obscene, hateful, or infringes on third-party rights.</li>
                <li>Attempt to gain unauthorised access to the Service or its infrastructure.</li>
                <li>Reverse engineer, decompile, or copy any part of the platform.</li>
                <li>Use the Service to generate spam, unsolicited communications, or misleading advertising.</li>
                <li>Violate the terms of service of any connected third-party platform (Instagram, Facebook, Shopify, etc.).</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">6. Intellectual Property</h2>
              <p className="text-gray-500 mb-3">
                <strong className="text-gray-700">Your content:</strong> You retain ownership of all content you provide to Flarvio (product data, brand materials, images). You grant us a limited, non-exclusive licence to use your content solely to provide the Service.
              </p>
              <p className="text-gray-500 mb-3">
                <strong className="text-gray-700">AI-generated content:</strong> Content generated by the Flarvio AI on your behalf is provided to you for your use. You are responsible for reviewing and approving all AI-generated content before publication.
              </p>
              <p className="text-gray-500">
                <strong className="text-gray-700">Flarvio IP:</strong> All trademarks, software, designs, and other intellectual property belonging to Flarvio remain our exclusive property. Nothing in these Terms transfers any IP rights to you.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">7. Third-Party Integrations</h2>
              <p className="text-gray-500">
                The Service integrates with third-party platforms including Shopify, Instagram, and Facebook. Your use of those platforms is governed by their own terms of service. Flarvio is not responsible for the availability, accuracy, or conduct of any third-party service. We may modify or discontinue integrations at any time.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">8. Disclaimer of Warranties</h2>
              <p className="text-gray-500">
                The Service is provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that the Service will be uninterrupted, error-free, or that results obtained through the platform will meet your expectations. AI-generated content may not always be accurate and should be reviewed before publication.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
              <p className="text-gray-500">
                To the fullest extent permitted by law, Flarvio shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of or inability to use the Service. Our total liability to you shall not exceed the amount you paid us in the 12 months prior to the event giving rise to the claim.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">10. Termination</h2>
              <p className="text-gray-500">
                We reserve the right to suspend or terminate your account at any time if you breach these Terms or engage in conduct we reasonably determine to be harmful. You may terminate your account at any time by cancelling your subscription and ceasing use of the Service. Upon termination, your right to access the platform ends immediately.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">11. Changes to These Terms</h2>
              <p className="text-gray-500">
                We may update these Terms from time to time. We will notify you of material changes by email or by posting a notice on the platform. Continued use of the Service after changes become effective constitutes your acceptance of the revised Terms.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">12. Governing Law</h2>
              <p className="text-gray-500">
                These Terms shall be governed by and construed in accordance with applicable law. Any disputes shall be resolved through binding arbitration or in a court of competent jurisdiction, as required by law.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">13. Contact</h2>
              <p className="text-gray-500">
                For questions about these Terms, please contact us at{" "}
                <a href="mailto:legal@flarvio.com" className="text-[#5e17eb] hover:underline">legal@flarvio.com</a>{" "}
                or visit our <a href="/contact" className="text-[#5e17eb] hover:underline">Contact page</a>.
              </p>
            </div>

          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
