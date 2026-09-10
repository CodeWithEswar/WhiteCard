import { PageMeta } from '../../../components/seo/page-meta'
import { LegalLayout } from '../components/legal-layout'
import { LegalSection } from '../components/legal-section'
import type { TocItem } from '../components/legal-table-of-contents'

const termsTocItems: TocItem[] = [
  { id: 'acceptance', number: '01', title: 'Acceptance of Terms' },
  { id: 'about', number: '02', title: 'About White Card' },
  { id: 'eligibility', number: '03', title: 'Eligibility' },
  { id: 'account-auth', number: '04', title: 'Account & Google Auth' },
  { id: 'responsibilities', number: '05', title: 'User Responsibilities' },
  { id: 'content', number: '06', title: 'Uploaded Content' },
  { id: 'acceptable-use', number: '07', title: 'Acceptable Use' },
  { id: 'prohibited', number: '08', title: 'Prohibited Files & Activities' },
  { id: 'storage', number: '09', title: 'Storage & Availability' },
  { id: 'metadata', number: '10', title: 'Document Metadata' },
  { id: 'sharing', number: '11', title: 'Direct Sharing Links' },
  { id: 'deletion', number: '12', title: 'User-Controlled Deletion' },
  { id: 'service-changes', number: '13', title: 'Service Changes' },
  { id: 'termination', number: '14', title: 'Suspension & Termination' },
  { id: 'reliability', number: '15', title: 'Availability & Reliability' },
  { id: 'ip', number: '16', title: 'Intellectual Property' },
  { id: 'third-parties', number: '17', title: 'Third-Party Services' },
  { id: 'disclaimers', number: '18', title: 'Disclaimers' },
  { id: 'liability', number: '19', title: 'Limitation of Liability' },
  { id: 'terms-changes', number: '20', title: 'Changes to These Terms' },
  { id: 'contact', number: '21', title: 'Contact Information' },
]

export function TermsPage() {
  return (
    <>
      <PageMeta
        title="Terms of Service — White Card"
        description="Read the terms governing use of White Card and its document storage features."
        canonical="/terms"
      />

      <LegalLayout
        title="Terms of Service"
        lastUpdated="September 2026"
        subtitle="These terms govern your access to and use of White Card, our personal digital document storage application."
        tocItems={termsTocItems}
      >
        <LegalSection id="acceptance" number="01" title="Acceptance of Terms">
          <p>
            By accessing or using White Card (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not access or use the application.
          </p>
        </LegalSection>

        <LegalSection id="about" number="02" title="About White Card">
          <p>
            White Card is a personal digital document wallet designed to organize government documents and student certificates. The product stores original uploaded files without performing automated Optical Character Recognition (OCR) or text mining.
          </p>
        </LegalSection>

        <LegalSection id="eligibility" number="03" title="Eligibility">
          <p>
            You must be legally capable of entering into binding contracts under applicable law in your jurisdiction to create an account or use White Card.
          </p>
        </LegalSection>

        <LegalSection id="account-auth" number="04" title="Account and Google Authentication">
          <p>
            White Card utilizes Google OAuth for account authentication. You are responsible for maintaining the security of your Google account credentials. Any activity conducted under your authenticated session is your responsibility.
          </p>
        </LegalSection>

        <LegalSection id="responsibilities" number="05" title="User Responsibilities">
          <p>
            You agree to use White Card in compliance with all applicable laws and regulations. You are solely responsible for the authenticity, legality, and appropriateness of all documents you upload or share through the service.
          </p>
        </LegalSection>

        <LegalSection id="content" number="06" title="Uploaded Content">
          <p>
            You retain all ownership, intellectual property rights, and title to the documents you upload. White Card does not claim ownership of your uploaded files. You grant White Card only the limited, technical license necessary to host, store, transfer, and deliver your files as directed by your account actions.
          </p>
        </LegalSection>

        <LegalSection id="acceptable-use" number="07" title="Acceptable Use">
          <p>
            You may use White Card solely for personal document organization, backup, and owner-controlled sharing. You may not use the service as a public file distribution mirror, bulk content delivery network, or automated scraping target.
          </p>
        </LegalSection>

        <LegalSection id="prohibited" number="08" title="Prohibited Files or Activities">
          <p>
            You may not upload, transmit, or store content that:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Contains malicious code, viruses, trojans, ransomware, or exploits</li>
            <li>Infringes upon any third party&apos;s copyright, trademark, or intellectual property</li>
            <li>Contains non-consensual imagery, unlawful exploitation material, or harassment</li>
            <li>Attempts to circumvent Row-Level Security, bucket access policies, or authentication barriers</li>
          </ul>
        </LegalSection>

        <LegalSection id="storage" number="09" title="Storage and File Availability">
          <p>
            White Card provides file storage up to a configured per-file limit (50MB per document). While we implement standard cloud persistence practices, you are encouraged to maintain independent primary backups of critical government or academic certificates.
          </p>
        </LegalSection>

        <LegalSection id="metadata" number="10" title="Document Metadata">
          <p>
            You are responsible for ensuring that titles, tags, and category labels you assign accurately represent your files. White Card does not verify or validate document contents against uploaded metadata.
          </p>
        </LegalSection>

        <LegalSection id="sharing" number="11" title="Direct Sharing Links">
          <p>
            When you create a direct share link, you acknowledge that anyone in possession of that link may download the associated document during its active period. You can revoke any active link at any time from your dashboard. White Card is not responsible for secondary dissemination by third parties who receive a valid link from you.
          </p>
        </LegalSection>

        <LegalSection id="deletion" number="12" title="User-Controlled Deletion">
          <p>
            You can delete any document at any time. Deleting a document removes its metadata record and the underlying storage file from active systems.
          </p>
        </LegalSection>

        <LegalSection id="service-changes" number="13" title="Service Changes">
          <p>
            We may introduce new features, modify existing interfaces, or discontinue specific functionalities as White Card evolves. We will endeavor to provide notice of significant changes where feasible.
          </p>
        </LegalSection>

        <LegalSection id="termination" number="14" title="Suspension and Termination">
          <p>
            We reserve the right to suspend or terminate access to your account if you violate these Terms of Service or engage in prohibited activities that threaten platform security or stability.
          </p>
        </LegalSection>

        <LegalSection id="reliability" number="15" title="Availability and Reliability">
          <p>
            While we strive for high uptime and availability, White Card is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. Temporary service interruptions may occur for scheduled maintenance, updates, or provider disruptions.
          </p>
        </LegalSection>

        <LegalSection id="ip" number="16" title="Intellectual Property">
          <p>
            White Card, its name, geometric logo mark, interface designs, source code, and branding elements are the intellectual property of White Card and its creators. You may not copy, reproduce, or redistribute our brand assets without permission.
          </p>
        </LegalSection>

        <LegalSection id="third-parties" number="17" title="Third-Party Services">
          <p>
            White Card integrates with third-party service providers (including Google OAuth and Supabase cloud infrastructure). Your use of these services may also be subject to the terms and privacy policies of those respective third-party providers.
          </p>
        </LegalSection>

        <LegalSection id="disclaimers" number="18" title="Disclaimers">
          <p>
            To the maximum extent permitted by applicable law, White Card disclaims all warranties, whether express, implied, statutory, or otherwise, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
        </LegalSection>

        <LegalSection id="liability" number="19" title="Limitation of Liability">
          <p>
            In no event shall White Card, its creators, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, use, or goodwill, arising out of or in connection with your use of the application.
          </p>
        </LegalSection>

        <LegalSection id="terms-changes" number="20" title="Changes to These Terms">
          <p>
            We may revise these Terms of Service periodically. The revised terms will become effective upon posting to this URL. Continued use of White Card following the posting of changes constitutes acceptance of the modified terms.
          </p>
        </LegalSection>

        <LegalSection id="contact" number="21" title="Contact Information">
          <p>
            For questions or inquiries regarding these Terms of Service, please reach out to:
          </p>
          <div className="p-4 rounded-xl border border-border/70 bg-muted/20 text-xs font-mono space-y-1">
            <p>Email: legal@whitecard.app</p>
            <p>Product: White Card Vault</p>
          </div>
        </LegalSection>
      </LegalLayout>
    </>
  )
}
