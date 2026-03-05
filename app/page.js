import Link from "next/link";
import { HomeSearchStrip } from "./components/home-search-strip";
import { HomeFeaturedBrands } from "./components/home-featured-brands";
import { HomeReviewsMarquee } from "./components/home-reviews-marquee";

const heroVideoSrc = new URL("./img/Creative_logo_dynamic_layout_delpmaspu_.mp4", import.meta.url).toString();

export const metadata = {
  title: "Home",
  description:
    "Shop medicines and wellness essentials from Rudraksh Pharmacy with fast delivery and trusted pharmacist guidance.",
};

const heroStats = [
  { value: "25,000+", label: "Families Supported" },
  { value: "2,500+", label: "Products in Stock" },
  { value: "4.9/5", label: "Customer Rating" },
];

const trustPillars = [
  {
    title: "Doctor-Ready Prescriptions",
    description: "Upload prescriptions and get guided support with verified dispensing workflows.",
  },
  {
    title: "Fast Neighborhood Delivery",
    description: "Priority dispatch lanes designed for urgent daily-care and chronic-care medicine needs.",
  },
  {
    title: "Assured Genuine Inventory",
    description: "Stock sourced through verified partners with pharmacist-led quality checks.",
  },
];

export default function HomePage() {
  return (
    <>
      <HomeSearchStrip />

      <section className="section container home-hero-section">
        <div className="home-hero-shell" aria-label="Pharmacy hero">
          <div className="home-hero-video-bg" aria-hidden="true">
            <video
              className="home-hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/rudraksha-logo-v2.png"
            >
              <source src={heroVideoSrc} type="video/mp4" />
            </video>
          </div>
          <div className="home-hero-overlay" />

          <div className="home-hero-content">
            <p className="home-hero-kicker-new">Trusted Pharmacy Care</p>
            <h1>Smart Medicine Planning for Healthier Families</h1>
            <p>
              Get genuine medicines, expert pharmacist guidance, and same-day
              delivery support for your family&apos;s daily and urgent health needs.
            </p>
            <div className="home-hero-actions-new">
              <Link href="/products" className="primary-btn">
                Shop Medicines
              </Link>
              <Link href="/contact" className="secondary-btn">
                Talk to Pharmacist
              </Link>
            </div>
            <div className="home-hero-stats">
              {heroStats.map((item) => (
                <article key={item.label} className="home-hero-stat-card">
                  <h3>{item.value}</h3>
                  <p>{item.label}</p>
                </article>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section className="promo-hero section">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-visual">
              <div className="pill-grid">
                <span className="pill-item">Vitamin Care</span>
                <span className="pill-item">Daily Wellness</span>
                <span className="pill-item">Medical Devices</span>
                <span className="pill-item">First Aid</span>
              </div>
            </div>
            <div className="promo-copy">
              <p className="promo-kicker">Trusted Rudraksh Pharmacy</p>
              <h1>
                <span className="promo-offer-highlight">Upto 20%</span> Off Medicine Orders
              </h1>
              <p>
                Order authentic medicines and wellness essentials from Rudraksh
                Pharmacy with fast dispatch and secure checkout.
              </p>
              <div className="hero-actions">
                <Link href="/products" className="primary-btn large">
                  Shop Now
                </Link>
                <Link href="/contact" className="secondary-btn large">
                  Contact Team
                </Link>
              </div>
              <div className="promo-meta">
                <div>
                  <strong>Free Delivery</strong>
                  <span>On Select Orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeFeaturedBrands />

      <section className="section container home-trust-pillar-section">
        <div className="section-head">
          <h2>Designed for Reliable Healthcare Shopping</h2>
          <p>
            A cleaner, faster, and more trustworthy experience inspired by top pharmacy platforms,
            built for daily medicine purchases and repeat family care.
          </p>
        </div>
        <div className="home-trust-pillar-grid">
          {trustPillars.map((pillar) => (
            <article key={pillar.title} className="home-trust-pillar-card">
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <HomeReviewsMarquee />

    </>
  );
}
