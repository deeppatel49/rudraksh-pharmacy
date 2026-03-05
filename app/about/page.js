import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Rudraksh Pharmacy's mission, expertise, and commitment to safe and affordable healthcare products.",
};

const trustStats = [
  { label: "Happy Customers", value: "25,000+" },
  { label: "Products Available", value: "2,500+" },
  { label: "Licensed Pharmacists", value: "12" },
  { label: "Daily Orders", value: "900+" },
];

const aboutHighlights = [
  "Every medicine is sourced from licensed and verified supply partners",
  "Prescription and OTC guidance is handled by trained pharmacy staff",
  "Cold-chain and sensitive items are handled with strict quality checks",
];

const storyStats = [
  { label: "Repeat Prescription Users", value: "60%" },
  { label: "Monthly Medicine Orders", value: "3,200+" },
  { label: "Years in Pharmacy Care", value: "11+" },
  { label: "Families Served", value: "25,000+" },
  { label: "Delivery Coverage Zones", value: "40+" },
  { label: "Verified Genuine Products", value: "100%" },
];

const careJourney = [
  {
    title: "Share Your Requirement",
    text: "Search products or contact our support team with your medicine and wellness needs.",
  },
  {
    title: "Pharmacy Verification",
    text: "Our team verifies product availability and confirms safe alternatives where needed.",
  },
  {
    title: "Fast Dispatch and Support",
    text: "Orders are packed with care, dispatched quickly, and supported on WhatsApp updates.",
  },
];

const patientReasons = [
  "Trusted local pharmacy with digital convenience",
  "Transparent pricing and genuine product assurance",
  "Fast response for urgent medicine requirements",
  "Pharmacist-backed support for better purchase confidence",
];

export default function AboutPage() {
  return (
    <>
      <section className="section container home-story">
        <div className="home-story-grid">
          <article className="home-story-copy">
            <p className="home-story-chip">Story Behind Rudraksh Pharmacy</p>
            <h2>Built to Make Genuine Medicines Simple and Trustworthy</h2>
            <p>
              Rudraksh Pharmacy started with one clear goal: families should get
              authentic medicines quickly, at fair prices, with reliable support.
              We combine local pharmacy care with digital convenience so every
              order feels safe and transparent.
            </p>
            <div className="home-story-points">
              <p>Licensed sourcing and strict medicine quality checks</p>
              <p>Fast response on WhatsApp for urgent requirements</p>
              <p>Pharmacist-guided support for safer medicine buying</p>
            </div>
            <div className="home-story-actions">
              <Link href="/products" className="primary-btn">
                Explore Medicines
              </Link>
              <Link href="/contact" className="secondary-btn">
                Contact Pharmacy
              </Link>
            </div>
          </article>

          <article className="home-story-visual">
            <div className="home-story-image-wrap">
              <Image
                src="/rudraksha-logo-v2.png"
                alt="Rudraksh Pharmacy trusted medicine care"
                width={460}
                height={460}
                className="home-story-image"
                priority
              />
            </div>
            <div className="home-story-badges">
              <span>Trusted Local Pharmacy</span>
              <span>Authentic Products</span>
              <span>Fast Delivery Support</span>
            </div>
          </article>
        </div>
      </section>

      <section className="container trust-strip">
        <article>
          <h3>Licensed Pharmacy</h3>
          <p>Serving patients with certified medicine sourcing and handling.</p>
        </article>
        <article>
          <h3>Fast Dispatch</h3>
          <p>Priority medicines are dispatched quickly across service areas.</p>
        </article>
        <article>
          <h3>Secure Ordering</h3>
          <p>Login-based ordering flow with direct WhatsApp confirmation.</p>
        </article>
      </section>

      <section className="section container stats-grid highlight-stats">
        {trustStats.map((item) => (
          <article key={item.label} className="stat-card">
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </article>
        ))}
      </section>

      <section className="section container about-story-wrap">
        <article className="about-story-main">
          <p className="about-story-kicker">Pharmacy Care Promise</p>
          <p>
            We are a patient-first pharmacy team focused on safe medicines,
            transparent pricing, and dependable support. From daily care to
            urgent requirements, we prioritize health outcomes with responsible
            pharmacy practices.
          </p>
          <div className="about-story-points">
            {aboutHighlights.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </article>

        <div className="about-story-duo">
          <article className="about-story-card">
            <h2>Our Vision</h2>
            <p>
              To become the most trusted neighborhood pharmacy platform for
              families seeking safe, affordable, and timely medicine access.
            </p>
          </article>
          <article className="about-story-card">
            <h2>Our Mission</h2>
            <p>
              Deliver authentic medicines, clear pharmacist guidance, and a
              smooth ordering experience that improves everyday health care.
            </p>
          </article>
        </div>

        <div className="about-story-stats">
          {storyStats.map((item) => (
            <article key={item.label} className="about-story-stat">
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section container about-journey">
        <div className="section-head">
          <h2>How Rudraksh Pharmacy Supports You</h2>
          <p>
            A simple and reliable care journey designed for busy families, senior
            patients, and daily wellness buyers.
          </p>
        </div>
        <div className="about-journey-grid">
          {careJourney.map((step, index) => (
            <article key={step.title} className="about-journey-card">
              <span className="journey-index">Step {index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section container about-patient-strip">
        <div className="about-patient-inner">
          <h2>Why Patients and Families Choose Us</h2>
          <div className="about-patient-list">
            {patientReasons.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <div className="about-patient-actions">
            <Link href="/products" className="primary-btn large">
              Start Shopping
            </Link>
            <Link href="/contact" className="secondary-btn large">
              Talk to Support
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
