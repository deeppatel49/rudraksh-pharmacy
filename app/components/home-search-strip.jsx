"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LOCATION_CACHE_KEY = "Rudraksh_home_location_cache_v1";

function formatLocationLabel(payload, latitude, longitude) {
  const locality =
    payload?.locality
    || payload?.city
    || payload?.principalSubdivision
    || payload?.county
    || "";
  const state = payload?.principalSubdivision || payload?.region || "";

  if (locality && state && locality !== state) {
    return `${locality}, ${state}`;
  }

  if (locality || state) {
    return locality || state;
  }

  return `${Number(latitude).toFixed(2)}, ${Number(longitude).toFixed(2)}`;
}

function readLocationCache() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(LOCATION_CACHE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed?.label) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeLocationCache(payload) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // noop
  }
}

function getInitialLocationState() {
  return {
    label: "Detecting location...",
    locating: true,
  };
}

export function HomeSearchStrip() {
  const router = useRouter();
  const initialLocationState = getInitialLocationState();
  const [query, setQuery] = useState("");
  const [locationLabel, setLocationLabel] = useState(initialLocationState.label);
  const [isLocating, setIsLocating] = useState(initialLocationState.locating);

  const resolveReadableLocation = useCallback(async (latitude, longitude) => {
    const endpoint = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&localityLanguage=en`;
    const response = await fetch(endpoint, { method: "GET" });
    if (!response.ok) {
      throw new Error("Unable to resolve location.");
    }

    const payload = await response.json();
    return formatLocationLabel(payload, latitude, longitude);
  }, []);

  const runLocationLookup = useCallback(async (forceRefresh = false) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationLabel("Location unavailable");
      setIsLocating(false);
      return;
    }

    const cached = readLocationCache();
    if (cached?.label && !forceRefresh) {
      setLocationLabel(cached.label);
      setIsLocating(false);
      return;
    }

    setIsLocating(true);
    if (forceRefresh || !cached?.label) {
      setLocationLabel("Detecting location...");
    }

    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 300000,
      });
    }).catch((error) => ({ error }));

    if (position?.error) {
      if (cached?.label) {
        setLocationLabel(cached.label);
      } else {
        setLocationLabel("Enable location");
      }
      setIsLocating(false);
      return;
    }

    const { latitude, longitude } = position.coords;

    try {
      const readableLabel = await resolveReadableLocation(latitude, longitude);
      setLocationLabel(readableLabel);
      writeLocationCache({
        label: readableLabel,
        latitude,
        longitude,
        savedAt: new Date().toISOString(),
      });
    } catch {
      const fallbackLabel = `${Number(latitude).toFixed(2)}, ${Number(longitude).toFixed(2)}`;
      setLocationLabel(fallbackLabel);
      writeLocationCache({
        label: fallbackLabel,
        latitude,
        longitude,
        savedAt: new Date().toISOString(),
      });
    }

    setIsLocating(false);
  }, [resolveReadableLocation]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      runLocationLookup(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [runLocationLookup]);

  const handleSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) {
      return;
    }

    router.push(`/products?q=${encodeURIComponent(value)}`);
  };

  return (
    <section className="home-search-section" aria-label="Quick medicine search">
      <div className="container home-search-bar">
        <div className="home-search-left">
          <div className="home-search-location">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="home-search-icon">
              <path d="M12 13.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
              <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" />
            </svg>
            <strong>{locationLabel}</strong>
            <button
              type="button"
              className="home-location-refresh"
              aria-label="Refresh location"
              title="Refresh location"
              onClick={() => runLocationLookup(true)}
              disabled={isLocating}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="home-search-icon">
                <path d="M20 12a8 8 0 1 1-2.35-5.65" />
                <path d="M20 5v4h-4" />
              </svg>
            </button>
          </div>

          <form className="home-search-form" role="search" aria-label="Search medicines" onSubmit={handleSearch}>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for Medicines and Health Products"
            />
            <button type="submit" aria-label="Search">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="home-search-icon">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4 4" />
              </svg>
            </button>
          </form>
        </div>

        <Link href="/quick-order" className="home-quick-order" target="_blank" rel="noopener noreferrer">
          <p>
            <span>Quick Buy!</span> Get <strong>Upto 20% off</strong> on medicines*
          </p>
          <span className="home-quick-order-btn">Quick order</span>
        </Link>
      </div>
    </section>
  );
}
