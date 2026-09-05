import { LegalKnowledgeChunk } from "./types.js";

export const LEGAL_KNOWLEDGE_BASE: LegalKnowledgeChunk[] = [
  // --- HEALTHCARE & MEDICAL LEGAL RIGHTS ---
  {
    id: "med-001",
    title: "Hospital Emergency Care & Patient Rights (EMTALA & Standard of Care)",
    category: "Healthcare & Medical Legal Rights",
    jurisdiction: "General / US / Federal",
    source: "Emergency Medical Treatment & Labor Act (EMTALA) / Consumer Health Rights",
    keywords: ["hospital", "medical", "emergency", "patient", "treatment", "doctor", "health", "refusal", "bill"],
    content: `Hospitals with emergency departments are legally required to provide a medical screening examination and stabilizing treatment to any individual seeking emergency medical care, regardless of ability to pay. Patients have the right to informed consent, access to their complete medical records, clear itemized billing statements, and the right to appeal unexpected medical charges or balance billing under the No Surprises Act.`
  },
  {
    id: "med-002",
    title: "Hospital Billing Disputes & Itemized Audit Rights",
    category: "Healthcare & Medical Legal Rights",
    jurisdiction: "General / Federal",
    source: "Healthcare Financial Management & Medical Debt Protection Framework",
    keywords: ["hospital", "bill", "billing", "charges", "overcharge", "itemized", "insurance", "dispute", "audit"],
    content: `Patients facing excessive hospital bills have the legal right to request an itemized billing statement with specific CPT/HCPCS procedure codes. Under price transparency mandates and medical debt regulations, hospitals must disclose charity care options for eligible income levels before sending debts to collections, and patients can formally dispute incorrect or duplicate charges.`
  },
  {
    id: "med-003",
    title: "Medical Malpractice & Standard of Care Requirements",
    category: "Healthcare & Medical Legal Rights",
    jurisdiction: "General / State Statutory Law",
    source: "Tort Law & Medical Professional Negligence Statutes",
    keywords: ["malpractice", "doctor", "negligence", "hospital", "injury", "harm", "standard of care", "physician"],
    content: `Medical malpractice occurs when a healthcare provider breaches the applicable standard of medical care, directly causing injury or harm to the patient. Establishing a valid claim requires proving doctor-patient duty, failure to adhere to professional standards, direct causation, and quantifiable damages. Most jurisdictions impose strict statutes of limitation (typically 1 to 3 years from discovery).`
  },

  // --- TENANCY & LEASE ---
  {
    id: "lease-001",
    title: "Residential Lease Early Termination & Constructive Eviction",
    category: "Tenancy & Lease",
    jurisdiction: "General / State Housing Code",
    source: "Uniform Residential Landlord & Tenant Act (URLTA)",
    keywords: ["lease", "rental", "terminate", "early", "landlord", "eviction", "habitability", "rent", "break"],
    content: `Tenants may terminate a residential lease early without penalty under specific legally recognized conditions, including landlord breach of the Implied Warranty of Habitability (severe health/safety hazards like lack of heat/water), constructive eviction, active military deployment (SCRA), or domestic violence protection statutes. Written notice detailing the breach and cure period is mandatory.`
  },
  {
    id: "lease-002",
    title: "Security Deposit Deductions & Return Timelines",
    category: "Tenancy & Lease",
    jurisdiction: "General / State Housing Law",
    source: "Statutory Security Deposit Regulations",
    keywords: ["security deposit", "deposit", "refund", "deduction", "wear and tear", "landlord", "tenant"],
    content: `Landlords must return a tenant's security deposit within statutory deadlines (typically 14 to 30 days post-moveout) along with an itemized accounting of any deductions. Deductions are strictly restricted to unpaid rent or damage exceeding normal wear and tear. Unreasonable or fraudulent withholdings may entitle the tenant to statutory penalties (often 2x to 3x the deposit amount).`
  },
  {
    id: "lease-003",
    title: "Notice Period Penalties & Duty to Mitigate Damages",
    category: "Tenancy & Lease",
    jurisdiction: "General / Contract Law",
    source: "Restatement (Second) of Contracts § 350",
    keywords: ["notice period", "penalty", "mitigate", "mitigation", "landlord", "rent", "lease break"],
    content: `When a tenant terminates a lease prior to its expiration, landlords in most jurisdictions have a mandatory legal duty to exercise reasonable efforts to re-rent the unit (duty to mitigate damages). The departing tenant is generally only liable for rent during the actual vacancy period until a replacement tenant is secured, subject to reasonable re-letting administrative fees.`
  },

  // --- EMPLOYMENT & LABOR ---
  {
    id: "emp-001",
    title: "Employment Termination & Notice Requirements",
    category: "Employment & Labor",
    jurisdiction: "General / Labor Code",
    source: "FLSA / State Employment Standards",
    keywords: ["employment", "job", "terminate", "fired", "severance", "notice", "at-will", "layoff"],
    content: `In at-will employment jurisdictions, either party may terminate the employment relationship at any time, with or without cause, provided the termination does not violate anti-discrimination laws, public policy, or express contract terms. Where an employment contract or severance agreement mandates a written notice period (e.g., 30 days), failure to provide notice obligates the employer to pay compensation for that period.`
  },
  {
    id: "emp-002",
    title: "Enforceability of Non-Compete & Restrictive Covenants",
    category: "Employment & Labor",
    jurisdiction: "General / State Labor Code",
    source: "Federal Trade Commission & State Non-Compete Statutes",
    keywords: ["non-compete", "restrictive covenant", "employer", "competition", "geographic", "scope"],
    content: `Non-compete clauses are subject to strict legal scrutiny and must be reasonable in geographic scope, duration (typically 6-24 months), and legitimate business interest protection (such as trade secrets). In several jurisdictions (e.g., California, Minnesota, Oklahoma), non-compete agreements for employees are completely void or severely restricted by law.`
  },

  // --- COMMERCIAL & NDAS ---
  {
    id: "nda-001",
    title: "Non-Disclosure Agreement (NDA) Scope & Exclusions",
    category: "Commercial & NDAs",
    jurisdiction: "General / Contract Law",
    source: "Defend Trade Secrets Act (DTSA) / Uniform Trade Secrets Act",
    keywords: ["nda", "confidentiality", "secret", "disclosure", "breach", "exclusion", "term"],
    content: `A valid Non-Disclosure Agreement (NDA) defines protected proprietary information and obligates recipient parties to maintain secrecy. Standard legal exclusions must include information that is publicly known, independently developed, or required to be disclosed by court order or government subpoena. Unlimited perpetual terms for standard business information are often unenforceable.`
  },

  // --- CONSUMER & CONTRACT LAW ---
  {
    id: "con-001",
    title: "Breach of Contract Remedies & Limitation of Liability",
    category: "Consumer & Contract Law",
    jurisdiction: "General / Uniform Commercial Code",
    source: "UCC Article 2 / Restatement of Contracts",
    keywords: ["contract", "breach", "remedy", "damages", "liability", "warranty", "clause", "cancellation"],
    content: `When a party breaches a material contract term, the non-breaching party is entitled to remedies including expectation damages, rescission, or specific performance. Limitation of liability clauses capping damages to fees paid are enforceable unless deemed unconscionable or attempting to exclude liability for intentional torts or gross negligence.`
  }
];
