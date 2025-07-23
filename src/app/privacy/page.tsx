import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Link 
            href="/beta" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Latchkey
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Latchkey ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our CI/CD pipeline provisioning platform and related services.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              By using our service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Information You Provide</h3>
            <ul className="text-muted-foreground leading-relaxed space-y-2 ml-6 list-disc">
              <li><strong>Account Information:</strong> Name, email address, and other details you provide during registration or beta signup</li>
              <li><strong>Profile Information:</strong> Information you add to your user profile</li>
              <li><strong>Communication:</strong> Messages, feedback, and support requests you send to us</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Information We Collect Automatically</h3>
            <ul className="text-muted-foreground leading-relaxed space-y-2 ml-6 list-disc">
              <li><strong>Usage Data:</strong> Information about how you use our service, including features accessed and time spent</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers</li>
              <li><strong>Cookies and Tracking:</strong> We use cookies and similar technologies to enhance your experience</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Integration Data</h3>
            <ul className="text-muted-foreground leading-relaxed space-y-2 ml-6 list-disc">
              <li><strong>GitHub Integration:</strong> Repository information, workflow configurations, and deployment data when you connect your GitHub account</li>
              <li><strong>Pipeline Data:</strong> CI/CD pipeline configurations, build logs, and deployment history</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use the collected information for:</p>
            <ul className="text-muted-foreground leading-relaxed space-y-2 ml-6 list-disc">
              <li>Providing and maintaining our CI/CD pipeline services</li>
              <li>Managing your account and authentication</li>
              <li>Processing and executing your pipeline configurations</li>
              <li>Sending important service updates and notifications</li>
              <li>Providing customer support and responding to inquiries</li>
              <li>Improving our services and developing new features</li>
              <li>Ensuring security and preventing fraud</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We do not sell, trade, or rent your personal information. We may share information in these limited circumstances:</p>
            <ul className="text-muted-foreground leading-relaxed space-y-2 ml-6 list-disc">
              <li><strong>Service Providers:</strong> Trusted third-party services that help us operate our platform (e.g., cloud hosting, analytics)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share specific information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We implement industry-standard security measures to protect your information:</p>
            <ul className="text-muted-foreground leading-relaxed space-y-2 ml-6 list-disc">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication protocols</li>
              <li>SOC 2 compliance planning and implementation</li>
              <li>Regular backup and disaster recovery procedures</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your information for as long as necessary to provide our services and comply with legal obligations. When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You have the following rights regarding your personal information:</p>
            <ul className="text-muted-foreground leading-relaxed space-y-2 ml-6 list-disc">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to certain processing of your information</li>
              <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use cookies and similar technologies to:</p>
            <ul className="text-muted-foreground leading-relaxed space-y-2 ml-6 list-disc">
              <li>Remember your preferences and settings</li>
              <li>Authenticate your account and maintain security</li>
              <li>Analyze usage patterns and improve our services</li>
              <li>Provide personalized content and features</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              You can control cookie settings through your browser preferences, but this may affect the functionality of our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service integrates with third-party platforms (such as GitHub, AWS, and other cloud providers). These integrations are governed by the respective privacy policies of those services. We encourage you to review their privacy practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service is not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and that appropriate safeguards are in place.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-muted/30 p-6 rounded-lg">
              <p className="text-foreground font-medium mb-2">Latchkey Privacy Team</p>
              <p className="text-muted-foreground">Email: privacy@latchkey.dev</p>
              <p className="text-muted-foreground">For general inquiries: support@latchkey.dev</p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}