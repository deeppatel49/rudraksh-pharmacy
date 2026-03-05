import { ProductGrid } from "../components/product-grid";
import { getCachedMedicines } from "../data/medicines";
import { products as otherProducts } from "../data/products";
import { HomeSearchStrip } from "../components/home-search-strip";

export const metadata = {
  title: "Products",
  description:
    "Browse Rudraksh Pharmacy products including OTC medicines, wellness supplements, and medical devices.",
};

export default async function ProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const categoryParam = resolvedSearchParams?.cat;
  const queryParam = resolvedSearchParams?.q;

  const initialCategory =
    typeof categoryParam === "string" && categoryParam.trim() ? categoryParam : "All";
  const initialQuery = typeof queryParam === "string" ? queryParam : "";

  // Get all medicines from CSV
  const medicines = getCachedMedicines();
  
  // Combine with other products
  const allProducts = [...medicines, ...otherProducts];

  return (
    <section className="products-page">
      <div className="products-page-hero">
        <div className="container products-page-hero-inner">
          <div className="products-hero-main">
            <p className="products-page-kicker">Rudraksh Pharmacy Catalog</p>
            <h1>Products for Everyday Health Needs</h1>
            <p>
              Discover trusted medicines, wellness essentials, and first-aid products
              selected for safety, quality, and reliable care.
            </p>
            <div className="products-page-actions">
              <a href="#products-list" className="primary-btn">Browse Products</a>
            </div>
            <div className="products-page-trust">
              <span>Genuine Products</span>
              <span>Verified Sources</span>
              <span>Pharmacist Support</span>
            </div>
          </div>

          <aside className="products-hero-side" aria-label="Service highlights">
            <h2>Why Customers Choose Us</h2>
            <ul>
              <li>
                <strong>Wide Assortment</strong>
                <span>Over {medicines.length}+ medicines plus wellness, Ayurvedic, and first-aid essentials.</span>
              </li>
              <li>
                <strong>Prescription Support</strong>
                <span>Upload your prescription and get assistance from our team.</span>
              </li>
              <li>
                <strong>Simple Checkout</strong>
                <span>Quick cart flow designed for smooth repeat orders.</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>

      <HomeSearchStrip />

      <section className="container products-overview-strip" aria-label="Products overview">
        <article className="products-overview-item">
          <h3>Curated Categories</h3>
          <p>Browse by category to quickly find what you need.</p>
        </article>
        <article className="products-overview-item">
          <h3>Trusted Brands</h3>
          <p>Handpicked brand portfolio focused on quality care.</p>
        </article>
        <article className="products-overview-item">
          <h3>Prescription Ready</h3>
          <p>Secure upload process for prescribed medicines.</p>
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
