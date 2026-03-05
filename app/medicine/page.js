import { ProductGrid } from "../components/product-grid";
import { getCachedMedicines } from "../data/medicines";
import { products as otherProducts } from "../data/products";

export const metadata = {
  title: "Medicines - Rudraksh Pharmacy",
  description:
    "Browse our comprehensive collection of medicines from 1mg, including prescription and OTC medications for all your healthcare needs.",
};

export default async function MedicinePage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const categoryParam = resolvedSearchParams?.cat;
  const queryParam = resolvedSearchParams?.q;

  const initialCategory =
    typeof categoryParam === "string" && categoryParam.trim() ? categoryParam : "All";
  const initialQuery = typeof queryParam === "string" ? queryParam : "";

  // Get medicines from CSV
  const medicines = getCachedMedicines();
  
  // Combine with other products
  const allProducts = [...medicines, ...otherProducts];

  return (
    <section className="products-page">
      <div className="products-page-hero">
        <div className="container products-page-hero-inner">
          <div className="products-hero-main">
            <p className="products-page-kicker">Rudraksh Pharmacy Medicine Catalog</p>
            <h1>Complete Medicine Collection</h1>
            <p>
              Discover our extensive range of medicines sourced from trusted manufacturers.
              From prescription medications to over-the-counter remedies, we have everything
              you need for your health and wellness.
            </p>
            <div className="products-page-actions">
              <a href="#products-list" className="primary-btn">Browse Medicines</a>
            </div>
            <div className="products-page-trust">
              <span>Genuine Medicines</span>
              <span>Trusted Manufacturers</span>
              <span>Expert Guidance</span>
            </div>
          </div>

          <aside className="products-hero-side" aria-label="Service highlights">
            <h2>Why Choose Our Pharmacy</h2>
            <ul>
              <li>
                <strong>Extensive Collection</strong>
                <span>Over {medicines.length}+ medicines from leading pharmaceutical companies.</span>
              </li>
              <li>
                <strong>Prescription Support</strong>
                <span>Upload your prescription and get verified medications delivered to your door.</span>
              </li>
              <li>
                <strong>Quality Assured</strong>
                <span>All medicines are sourced directly from authorized distributors.</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>

      <section className="container products-overview-strip" aria-label="Products overview">
        <article className="products-overview-item">
          <h3>Prescription Medicines</h3>
          <p>Get your prescribed medications with proper documentation.</p>
        </article>
        <article className="products-overview-item">
          <h3>OTC Medications</h3>
          <p>Common remedies for everyday health concerns.</p>
        </article>
        <article className="products-overview-item">
          <h3>Fast Delivery</h3>
          <p>Quick and secure delivery to your doorstep.</p>
        </article>
      </section>

      <ProductGrid
        key={`${initialCategory}-${initialQuery}`}
        initialCategory={initialCategory}
        initialQuery={initialQuery}
        allProducts={allProducts}
      />
    </section>
  );
}
