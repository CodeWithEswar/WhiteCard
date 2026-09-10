import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../components/ui/accordion'
import { Reveal } from '../../../components/motion/reveal'

const faqs = [
  {
    q: 'What is White Card?',
    a: 'White Card is a personal digital document wallet designed to store, organize, and share your important government and academic files in their original format.',
  },
  {
    q: 'What can I store?',
    a: 'You can store official identity documents, passports, driving licences, vehicle records, insurance policies, tax papers, educational marksheets, degrees, transcripts, and course completion certificates up to 50MB per file.',
  },
  {
    q: 'What are Government Documents and Student Certificates?',
    a: 'They are two isolated vault spaces within White Card. Government Documents holds civic and state records, while Student Certificates preserves your academic milestones, marksheets, and credentials separately.',
  },
  {
    q: 'Are my files public?',
    a: 'No. All files are private by default. Your files are stored in authenticated, private object storage and cannot be viewed or downloaded by anyone unless you generate an explicit direct share link.',
  },
  {
    q: 'How do I sign in?',
    a: 'White Card uses standard Google sign-in. You authenticate directly through Google OAuth, meaning there is no separate password to create or manage.',
  },
  {
    q: 'Does White Card read my documents?',
    a: 'No. White Card does not perform OCR (Optical Character Recognition) or automatic text extraction in the current product. Files are stored and delivered in their exact uploaded format.',
  },
  {
    q: 'Can I store ZIP files?',
    a: 'Yes. White Card natively supports ZIP archives alongside PDFs, high-resolution images (PNG, JPG, WEBP), Word documents, and spreadsheets.',
  },
  {
    q: 'Can I download the original file?',
    a: 'Yes. Any uploaded document can be downloaded at any time in its exact original byte-for-byte format without compression or watermarks.',
  },
  {
    q: 'How does direct sharing work?',
    a: 'You can generate a direct cryptographic share link for any document with a selected expiration time (24 hours, 7 days, or 30 days). Only people with that specific link can download the file.',
  },
  {
    q: 'Can I revoke a shared link?',
    a: 'Yes. You can revoke any active share link with one click from your dashboard at any time, which immediately invalidates the link.',
  },
  {
    q: 'Can I delete my documents?',
    a: 'Yes. When you delete a document, White Card removes both its database metadata and the underlying file from object storage.',
  },
  {
    q: 'Does White Card work on mobile?',
    a: 'Yes. White Card is designed responsively for mobile browsers with full touch support, a streamlined mobile bottom dock, and responsive file management.',
  },
] as const

export function FaqSection() {
  return (
    <section id="faq" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section 12 • Knowledge Base
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Frequently Asked Questions
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Everything you need to know about White Card, privacy, file formats, and storage.
            </p>
          </Reveal>
        </div>

        {/* 12 Accordion Items */}
        <Reveal delay={0.16}>
          <Accordion className="rounded-3xl border border-border/80 bg-card divide-y divide-border/60 shadow-sm overflow-hidden">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-none">
                <AccordionTrigger className="px-6 py-5 text-left text-sm sm:text-base font-semibold text-foreground hover:no-underline hover:text-primary transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
