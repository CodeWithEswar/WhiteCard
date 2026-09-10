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
    a: 'White Card is a personal digital document vault designed to store, organize, and share important government records and student certificates in their original format with Google authentication.',
  },
  {
    q: 'What can I store?',
    a: 'You can store official identity records, passports, driving licences, vehicle records, insurance policies, tax documents, educational marksheets, degrees, transcripts, and course certificates up to 50MB per file.',
  },
  {
    q: 'What is the difference between Government Documents and Student Certificates?',
    a: 'They are two isolated vault spaces within White Card. Government Documents holds civic, state, and identity records, while Student Certificates preserves your academic milestones, degrees, and institutional credentials separately.',
  },
  {
    q: 'Are my files public?',
    a: 'No. All documents are private by default. Files are stored in authenticated, private object storage and cannot be viewed or downloaded by anyone unless you explicitly generate a direct share link.',
  },
  {
    q: 'How do I sign in?',
    a: 'White Card uses standard Google sign-in. You authenticate directly through verified Google OAuth, meaning there is no separate White Card password to create, remember, or reset.',
  },
  {
    q: 'Does White Card read or scan my documents?',
    a: 'No OCR is used in the current product. White Card stores and organizes the files you upload without automatically extracting document text.',
  },
  {
    q: 'Can I upload ZIP files?',
    a: 'Yes. White Card natively supports ZIP archives alongside PDFs, high-resolution images (PNG, JPG, WEBP), Word documents, and spreadsheets.',
  },
  {
    q: 'Can I download the original file?',
    a: 'Yes. Any uploaded document can be downloaded at any time in its exact original format without compression, watermarks, or conversion.',
  },
  {
    q: 'How do direct share links work?',
    a: 'You can generate a direct cryptographic link for any document with a chosen expiration period (24 hours, 7 days, or 30 days). Only recipients with that explicit link can download the file.',
  },
  {
    q: 'Can I revoke a shared link?',
    a: 'Yes. You can revoke any active shared link with one click from your dashboard at any time, which immediately invalidates recipient access.',
  },
  {
    q: 'Can I delete my documents?',
    a: 'Yes. When you delete a document, White Card permanently removes both its database record and the underlying storage file with complete cascade deletion.',
  },
  {
    q: 'Does White Card work on mobile?',
    a: 'Yes. White Card is built with responsive ergonomics for mobile browsers, featuring full touch support, accessible sheets, and a dedicated mobile thumb dock.',
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
              Section 12 • Frequently Asked Questions
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Frequently Asked Questions
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Clear, factual answers about White Card, vault privacy, file formats, and document ownership.
            </p>
          </Reveal>
        </div>

        {/* 12 Accordion Items */}
        <Reveal delay={0.16}>
          <Accordion className="rounded-3xl border border-border/80 bg-card divide-y divide-border/60 shadow-sm overflow-hidden text-left">
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
