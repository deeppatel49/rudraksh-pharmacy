"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "../data/products";
import { useAuth } from "../context/auth-context";
import { useCart } from "../context/cart-context";

const MEDICINE_CATEGORIES = new Set(["Wellness", "First Aid", "OTC", "Ayurvedic", "Medicine"]);
const PRODUCTS_PER_PAGE = 50;
const MEDICINE_THEME_COLORS = [
  ["#e8f7ee", "#d4f0df", "#2f855a"],
  ["#eaf4ff", "#d7e9ff", "#1e4f8a"],
  ["#fff4e6", "#ffe7c7", "#9a5518"],
  ["#f3ecff", "#e5d7ff", "#5a3da8"],
  ["#e9fbfb", "#d1f2f3", "#176d73"],
];

function hashText(input) {
  return String(input || "")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function getDrugLabel(product) {
  const hint = `${product?.drugType || ""} ${product?.packSize || ""} ${product?.name || ""}`.toLowerCase();
  if (hint.includes("syrup")) {
    return "SYRUP";
  }
  if (hint.includes("injection") || hint.includes("vial")) {
    return "INJECTION";
  }
  if (hint.includes("capsule")) {
    return "CAPSULE";
  }
  if (hint.includes("tablet") || hint.includes("tab")) {
    return "TABLET";
  }
  return "MEDICINE";
}

function getProductImageSrc(product) {
  const seed = hashText(`${product?.id || "default"}-${product?.name || "medicine"}`);
  const [bg1, bg2, textColor] = MEDICINE_THEME_COLORS[seed % MEDICINE_THEME_COLORS.length];
  const label = getDrugLabel(product);
  const pillX = 60 + (seed % 90);
  const pillY = 120 + (seed % 25);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700" width="900" height="700">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
  </defs>
  <rect width="900" height="700" fill="url(#bg)"/>
  <rect x="50" y="90" width="800" height="520" rx="28" fill="#ffffff" stroke="#d9e5ef" stroke-width="4"/>
  <rect x="95" y="145" width="420" height="300" rx="20" fill="#f8fbff" stroke="#d3e1ec" stroke-width="3"/>
  <circle cx="${pillX}" cy="${pillY}" r="34" transform="translate(120 90)" fill="#ffffff" stroke="#b9cddd" stroke-width="5"/>
  <rect x="220" y="185" width="210" height="70" rx="35" fill="#ffffff" stroke="#b9cddd" stroke-width="5"/>
  <rect x="220" y="185" width="105" height="70" rx="35" fill="#d6f5e3"/>
  <g fill="#ffffff" stroke="#b9cddd" stroke-width="3">
    <rect x="560" y="170" width="260" height="230" rx="18"/>
    <circle cx="610" cy="220" r="22"/>
    <circle cx="685" cy="220" r="22"/>
    <circle cx="760" cy="220" r="22"/>
    <circle cx="610" cy="290" r="22"/>
    <circle cx="685" cy="290" r="22"/>
    <circle cx="760" cy="290" r="22"/>
    <circle cx="610" cy="360" r="22"/>
    <circle cx="685" cy="360" r="22"/>
    <circle cx="760" cy="360" r="22"/>
  </g>
  <text x="95" y="520" font-family="Segoe UI, Arial, sans-serif" font-size="56" font-weight="800" fill="${textColor}">${label}</text>
  <text x="95" y="570" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="600" fill="#5b6b79">Pharmacy Product</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function ProductGrid({ initialCategory = "All", initialQuery = "", allProducts = products }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [imageErrors, setImageErrors] = useState({});
  const { user } = useAuth();
  const { addItem } = useCart();
  const normalizedQuery = initialQuery.trim().toLowerCase();

  const searchableProducts = useMemo(() => {
    return allProducts.map((product) => ({
      ...product,
      searchText: `${product.name} ${product.category} ${product.description} ${product.manufacturer || ""}`.toLowerCase(),
    }));
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    const categoryKey = initialCategory.trim().toLowerCase();

    return searchableProducts.filter((product) => {
      const matchesCategory =
        categoryKey === "all"
        || (categoryKey === "medicine"
          ? MEDICINE_CATEGORIES.has(product.category)
          : product.category.toLowerCase() === categoryKey);
      const matchesSearch = !normalizedQuery || product.searchText.includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [initialCategory, normalizedQuery, searchableProducts]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, safeCurrentPage]);

  const handleAuthRedirect = (productId, actionType, nextPath, quantity = 1, productSnapshot = null) => {
    const params = new URLSearchParams({
      next: nextPath,
      action: actionType,
      productId,
      quantity: String(Math.max(1, Math.floor(quantity))),
    });

    if (productSnapshot?.name) {
      params.set("pname", productSnapshot.name);
    }
    if (Number.isFinite(Number(productSnapshot?.price))) {
      params.set("pprice", String(Number(productSnapshot.price)));
    }
    if (productSnapshot?.image) {
      params.set("pimg", productSnapshot.image);
    }

    router.push(`/login?${params.toString()}`);
  };

  const handleAddToCart = (product) => {
    if (!user) {
      handleAuthRedirect(product.id, "add_to_cart", "/products", 1, {
        name: product.name,
        price: product.price,
        image: product.image,
      });
      return;
    }

    addItem(product.id, 1, undefined, {
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <section id="products-list" className="section container products-grid-section">
      <div className="product-grid">
        {filteredProducts.length > 0 ? paginatedProducts.map((product) => {
          return (
            <article
              key={product.id}
              className="product-card"
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/products/${product.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  router.push(`/products/${product.id}`);
                }
              }}
            >
              <div className="product-card-badges">
                <span className="product-badge bestseller-badge">UP TO 20% OFF</span>
              </div>

                <div className="product-image-wrap">
                  <img
                    src={getProductImageSrc(product)}
                    alt={product.imageAlt || `${product.name} medicine`}
                    className="product-image"
                    loading="lazy"
                    decoding="async"
                    onError={() => {
                      setImageErrors((prev) => ({
                        ...prev,
                        [product.id]: (prev[product.id] || 0) + 1,
                      }));
                    }}
                  />
                  <span className="product-stock-pill in">
                    {product.inStock === false ? "Available" : "In Stock"}
                  </span>
                </div>

              <div className="product-card-body">
                <div className="product-card-copy">
                  <h3>{product.name}</h3>
                  {product.manufacturer && product.manufacturer !== "N/A" && (
                    <p className="product-manufacturer">By {product.manufacturer}</p>
                  )}
                  <p className="product-pack-size">{product.packSize || product.description}</p>
                </div>

                <div className="product-card-footer">
                  <button
                    type="button"
                    className="product-add-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          );
        }) : (
          <article className="product-card empty-state">
            <h3>No products found</h3>
            <p>Try another search or choose a different category.</p>
          </article>
        )}
      </div>

      {filteredProducts.length > PRODUCTS_PER_PAGE ? (
        <div className="products-pagination" aria-label="Products pagination">
          <button
            type="button"
            className="secondary-btn page-btn"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={safeCurrentPage === 1}
          >
            Previous
          </button>
          <span className="page-indicator">
            Page {safeCurrentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="primary-btn page-btn"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safeCurrentPage === totalPages}
          >
            Next
          </button>
        </div>
      ) : null}

    </section>
  );
}
