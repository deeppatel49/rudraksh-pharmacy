import Link from "next/link";
import { ContactInquiryForm } from "../components/contact-inquiry-form";

export const metadata = {
  title: "Contact Us | 24x7 Support | Rudraksh Pharmacy Surat",
  description:
    "Get 24x7 customer support from Rudraksh Pharmacy. Contact us for medicine inquiries, bulk orders, prescription help, and WhatsApp ordering. Call +91 99799 79688 or visit our Surat store.",
  keywords: [
    "contact Rudraksh Pharmacy",
    "pharmacy customer support",
    "medicine inquiry",
    "bulk medicine orders",
    "pharmacy Surat contact",
    "WhatsApp medicine order",
  ],
  openGraph: {
    title: "Contact Rudraksh Pharmacy | 24x7 Customer Support",
    description: "Reach us for medicine inquiries, bulk orders, and expert assistance.",
    type: "website",
    url: "https://rudrakshpharmacy.com/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact Rudraksh Pharmacy",
    description: "24x7 support for all your medicine and healthcare needs.",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default async function ContactPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const initialInquiryType =
    typeof resolvedSearchParams?.inquiryType === "string"
      ? resolvedSearchParams.inquiryType
      : "";
  const initialMessage =
    typeof resolvedSearchParams?.message === "string"
      ? resolvedSearchParams.message
      : "";

  return (
    <section className="section container page-content contact-page">
      <div className="contact-hero">
        <div className="contact-hero-copy">
          <p className="contact-chip">24x7 Customer Support</p>
          <h1>Get Fast Help and Buy Medicines with Confidence</h1>
          <p>
            Talk to our pharmacy team for genuine products, quick guidance, and
            smooth WhatsApp ordering support.
          </p>
          <div className="contact-hero-actions">
            <a href="tel:+919979979688" className="primary-btn">
              Call Now
            </a>
            <Link href="/products" className="secondary-btn">
              Browse Medicines
            </Link>
          </div>
        </div>
        <div className="contact-highlight-grid">
          <article>
            <strong>25,000+</strong>
            <span>Happy Customers</span>
          </article>
          <article>
            <strong>2,500+</strong>
            <span>Products Available</span>
          </article>
          <article>
            <strong>30 min</strong>
            <span>Average Response</span>
          </article>
          <article>
            <strong>100%</strong>
            <span>Licensed Suppliers</span>
          </article>
        </div>
      </div>

      <div className="contact-layout">
        <article className="content-card contact-info-card">
          <h2>Business Details</h2>
          <ul className="clean-list">
            <li>
              <strong>Phone:</strong> +91 99799 79688
            </li>
            <li>
              <strong>Email:</strong> rudrakshpharmacy6363@gmail.com
            </li>
            <li>
              <strong>Address:</strong> 7 and 8, L.P Savani Shopping Center near L . P Savani circle , Adajan, Surat -
              395009
            </li>
            <li>
              <strong>Hours:</strong> Mon-Sat 9:00 AM - 10:00 PM - Sun 10:00 AM - 8:00 PM
            </li>
          </ul>
          <div className="contact-quick-actions">
            <a href="https://wa.me/919979979688" target="_blank" rel="noopener noreferrer">
              WhatsApp Chat
            </a>
            <a href="mailto:rudrakshpharmacy6363@gmail.com">Email Support</a>
            <a href="tel:+919979979688">Call Pharmacy</a>
          </div>
          <div className="delivery-info-note" role="note" aria-label="Delivery information">
            <p>
              <strong>Delivery Info:</strong> Free delivery is available within a 5 km radius.
            </p>
            <p>
              For locations beyond 5 km, please contact the seller to arrange delivery details
              and charges.
            </p>
          </div>
        </article>

        <ContactInquiryForm
          initialInquiryType={initialInquiryType}
          initialMessage={initialMessage}
        />
      </div>
    </section>
  );
}
