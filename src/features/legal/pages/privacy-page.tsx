import { PageMeta } from '../../../components/seo/page-meta'
import { LegalLayout } from '../components/legal-layout'
import { LegalSection } from '../components/legal-section'

export function PrivacyPage() {
  return (
    <>
      <PageMeta
        title="Privacy Policy — White Card"
        description="Learn how White Card handles account information, uploaded documents, sharing links, and user controls."
        canonical="/privacy"
      />

      <LegalLayout
        title="Privacy Policy"
        lastUpdated="September 2026"
        subtitle="This policy explains how White Card collects, stores, and handles your account information and uploaded files across our digital document wallet."
      >
        <LegalSection id="intro" number="01" title="Introduction">
          <p>
            White Card (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates a personal digital document wallet designed to organize government documents and student certificates. We respect your privacy and design our systems with minimal data collection, zero automated content extraction, and strict tenant isolation.
          </p>
          <p>
            This Privacy Policy describes the categories of information we handle, how documents are stored and shared, and the controls available to you as an authenticated user.
          </p>
        </LegalSection>

        <LegalSection id="info-we-use" number="02" title="Information We Use">
          <p>
            White Card is built to require only the minimal information essential to authenticate your identity and deliver personal document storage functionality. We do not sell your personal data or document content to advertisers, data brokers, or commercial third parties.
          </p>
        </LegalSection>

        <LegalSection id="google-auth" number="03" title="Google Sign-In Information">
          <p>
            When you sign in to White Card using Google OAuth, our application receives basic account information necessary to create and manage your authenticated session:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Your primary account email address</li>
            <li>Your public profile name</li>
            <li>Your public avatar image URL</li>
            <li>A unique Google account identifier (subject ID)</li>
          </ul>
          <p>
            <strong>Scope Transparency:</strong> White Card only requests standard profile and email scopes. We never request or receive access to your Google Drive files, Gmail inbox, Google Contacts, Google Calendar, or other external Google workspace data.
          </p>
        </LegalSection>

        <LegalSection id="documents" number="04" title="Uploaded Documents">
          <p>
            Documents are uploaded directly by you and stored exclusively to provide the core document-storage functionality of White Card. Your files are placed in private, access-controlled cloud object storage.
          </p>
          <p>
            <strong>Zero OCR Transparency:</strong> White Card does not use Optical Character Recognition (OCR), automated parsing, or machine learning models to extract text from your uploaded documents in the current version of the product. Files are stored and delivered in their exact uploaded format.
          </p>
        </LegalSection>

        <LegalSection id="metadata" number="05" title="Document Metadata">
          <p>
            To help you organize and retrieve your files, White Card stores the metadata attributes you provide or that are derived during upload:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Document title and user-entered notes or descriptions</li>
            <li>Assigned document space (Government Documents or Student Certificates)</li>
            <li>Document category and color tags</li>
            <li>Original file name, file size (in bytes), and MIME content type</li>
            <li>Document expiration date (if specified by you)</li>
            <li>Creation and modification timestamps</li>
          </ul>
        </LegalSection>

        <LegalSection id="how-used" number="06" title="How Information Is Used">
          <p>
            We use account information and document records strictly to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Authenticate your identity and maintain active sessions</li>
            <li>Display your personal document library in the web interface</li>
            <li>Process uploads, downloads, tag assignments, and searches</li>
            <li>Generate time-bound signed URLs when you request to view or download a file</li>
            <li>Generate cryptographic direct share links when explicitly requested by you</li>
          </ul>
        </LegalSection>

        <LegalSection id="storage-access" number="07" title="Storage and Account Access">
          <p>
            All document metadata in our database is secured by PostgreSQL Row-Level Security (RLS) policies. Every query is evaluated against your authenticated session user identifier; users cannot query, view, or modify documents belonging to another account.
          </p>
          <p>
            Underlying files are stored in private object storage partitions formatted as <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">/{'{user_id}'}/{'{space}'}/{'{document_id}'}/{'{filename}'}</code>. File access is restricted via signed, short-lived URLs that expire after 5 minutes.
          </p>
        </LegalSection>

        <LegalSection id="sharing-links" number="08" title="Document Sharing Links">
          <p>
            A document in White Card remains strictly private until you explicitly choose to create a direct share link.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Share links utilize cryptographically secure random tokens. The database stores only a SHA-256 cryptographic hash of the token.</li>
            <li>You select a defined expiration duration (24 hours, 7 days, or 30 days). Expired links reject download attempts.</li>
            <li>You can manually revoke any active share link at any time with immediate effect.</li>
            <li>Public recipient views do not reveal your account email, display name, or other files in your vault.</li>
          </ul>
        </LegalSection>

        <LegalSection id="data-retention" number="09" title="Data Retention">
          <p>
            We retain your uploaded files and metadata for as long as your account remains active or until you delete individual documents. Temporary share links and signed download URLs expire automatically according to their configured timeouts.
          </p>
        </LegalSection>

        <LegalSection id="deletion" number="10" title="Document Deletion">
          <p>
            When you delete a document from White Card, both the database metadata record and the underlying storage file are permanently removed from active application databases and storage buckets.
          </p>
          <p>
            Deleting an account initiates deletion of all associated documents, profile data, tags, and share records according to our standard cleanup processes.
          </p>
        </LegalSection>

        <LegalSection id="preferences" number="11" title="Local Preferences and Theme Settings">
          <p>
            White Card stores your selected theme preset (from the 10 available palettes) and appearance mode (Light, Dark, or System) in your browser&apos;s local storage (<code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">localStorage</code>). These settings are processed client-side to render your chosen visual style.
          </p>
        </LegalSection>

        <LegalSection id="security" number="12" title="Security Practices">
          <p>
            We implement industry-standard technical safeguards to protect your personal files:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Transport Layer Security (TLS 1.3/HTTPS) for all data in transit</li>
            <li>Row-Level Security (RLS) policies enforcing strict account data partitioning</li>
            <li>Private object storage buckets with zero public listing access</li>
            <li>Cryptographic hashing (SHA-256) for public sharing tokens</li>
            <li>OAuth 2.0 PKCE authentication flow without stored application passwords</li>
          </ul>
        </LegalSection>

        <LegalSection id="user-choices" number="13" title="User Choices and Controls">
          <p>
            You retain full control over your documents and personal records at all times:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Download:</strong> Retrieve original byte-exact copies of any uploaded file at any time.</li>
            <li><strong>Modify:</strong> Update titles, categories, expiration dates, and color tags.</li>
            <li><strong>Revoke:</strong> Invalidate active public share links immediately.</li>
            <li><strong>Delete:</strong> Permanently remove files and metadata from the platform.</li>
          </ul>
        </LegalSection>

        <LegalSection id="third-party" number="14" title="Third-Party Services">
          <p>
            White Card relies on selected trusted infrastructure providers to deliver services:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Google Identity Services:</strong> Provides secure OAuth authentication.</li>
            <li><strong>Cloud Database & Storage Providers (e.g., Supabase):</strong> Hosts encrypted database records and private cloud object storage.</li>
          </ul>
          <p>
            These infrastructure partners process data solely to execute technical storage, transport, and authentication functions under appropriate data protection agreements.
          </p>
        </LegalSection>

        <LegalSection id="changes" number="15" title="Changes to This Privacy Policy">
          <p>
            We may update this Privacy Policy from time to time to reflect product enhancements, architectural updates, or regulatory requirements. Material revisions will be accompanied by an updated &ldquo;Last updated&rdquo; date at the top of this page.
          </p>
        </LegalSection>
      </LegalLayout>
    </>
  )
}
