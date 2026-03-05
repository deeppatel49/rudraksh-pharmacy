"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const QUICK_ORDER_UPLOAD_KEY = "Rudraksh_quick_order_prescriptions";
const QUICK_ORDER_HISTORY_KEY = "Rudraksh_quick_order_prescription_history";

function readPrescriptionHistory() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(QUICK_ORDER_HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatHistoryDate(isoDate) {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

export function QuickOrderView() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [historyItems, setHistoryItems] = useState(() => readPrescriptionHistory());

  const selectedCount = useMemo(() => files.length, [files]);
  const safeName = customerName.trim();
  const safeMobile = mobileNumber.replace(/\D/g, "");
  const isNameValid = safeName.length >= 2;
  const isMobileValid = safeMobile.length >= 10 && safeMobile.length <= 15;
  const canContinue = selectedCount > 0 && isNameValid && isMobileValid && !uploading;

  const handleFileSelect = (event) => {
    const pickedFiles = Array.from(event.target.files || []);
    setUploadError("");
    setUploadSuccess("");
    setFiles(pickedFiles);
  };

  const handleContinue = async () => {
    if (selectedCount === 0 || !isNameValid || !isMobileValid) {
      setUploadError("Please upload prescription, enter name, and a valid mobile number.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const uploadedPrescriptions = [];
      const uploadedAt = new Date().toISOString();

      for (const file of files) {
        const body = new FormData();
        body.set("prescription", file);
        body.set("customerName", safeName);
        body.set("mobileNumber", safeMobile);

        const response = await fetch("/api/prescriptions", {
          method: "POST",
          body,
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error || `Upload failed for ${file.name}`);
        }

        uploadedPrescriptions.push({
          fileName: file.name,
          referenceId: payload.referenceId,
          fileUrl: payload.fileUrl,
          uploadedAt,
        });
      }

      window.localStorage.setItem(
        QUICK_ORDER_UPLOAD_KEY,
        JSON.stringify({
          uploadedAt,
          files: uploadedPrescriptions,
        })
      );

      const nextHistory = [...uploadedPrescriptions, ...historyItems].slice(0, 30);
      window.localStorage.setItem(QUICK_ORDER_HISTORY_KEY, JSON.stringify(nextHistory));
      setHistoryItems(nextHistory);

      setUploadSuccess(`${uploadedPrescriptions.length} prescription file(s) uploaded.`);
      router.push("/quick-order/process");
    } catch (error) {
      setUploadError(error?.message || "Unable to upload prescriptions right now.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="section container quick-order-page">
      <div className="quick-order-layout">
        <article className="quick-order-left">
          <h1>Upload prescriptions</h1>
          <p>and let us arrange your medicines for you</p>

          <label className="quick-upload-dropzone" htmlFor="quick-order-files">
            <div className="quick-upload-illustration" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="quick-upload-icon">
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
                <path d="M14 3v5h5" />
                <path d="M12 17v-6" />
                <path d="m9.5 13.5 2.5-2.5 2.5 2.5" />
              </svg>
            </div>
            <span className="quick-upload-btn">Upload prescription</span>
            <small>Drag files from your computer (JPG, PNG and PDF)</small>
          </label>

          <div className="quick-upload-separator">
            <span>OR</span>
          </div>

          <label className="quick-upload-history" htmlFor="quick-order-files">
            <div className="quick-history-copy">
              <svg viewBox="0 0 24 24" className="quick-upload-icon">
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
                <path d="M14 3v5h5" />
                <path d="M9 15h6" />
              </svg>
              <strong>Select from your past prescriptions</strong>
            </div>
            <span className="quick-history-btn">Select files</span>
          </label>

          <input
            id="quick-order-files"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            multiple
            onChange={handleFileSelect}
            className="quick-order-input"
          />
        </article>

        <aside className="quick-order-right">
          <div className="quick-order-customer-fields">
            <label className="quick-order-field">
              <span>Name</span>
              <input
                type="text"
                value={customerName}
                onChange={(event) => {
                  setCustomerName(event.target.value);
                  setUploadError("");
                }}
                placeholder="Enter your full name"
                required
              />
            </label>

            <label className="quick-order-field">
              <span>Mobile Number</span>
              <input
                type="tel"
                inputMode="numeric"
                value={mobileNumber}
                onChange={(event) => {
                  setMobileNumber(event.target.value);
                  setUploadError("");
                }}
                placeholder="Enter your mobile number"
                required
              />
            </label>
          </div>

          <button
            type="button"
            className="quick-continue-btn"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            {uploading ? "Uploading..." : "Continue"}
          </button>
          <p>All uploads are encrypted &amp; visible only to our pharmacists.</p>
          <p>Any prescription you upload is validated before processing the order.</p>
          <a href="#" onClick={(event) => event.preventDefault()}>
            What is a valid prescription?
          </a>

          {selectedCount > 0 ? (
            <p className="quick-files-selected">{selectedCount} file(s) selected and ready</p>
          ) : null}
          {uploadError ? <p className="quick-files-error">{uploadError}</p> : null}
          {uploadSuccess ? <p className="quick-files-success">{uploadSuccess}</p> : null}

          {historyItems.length ? (
            <div className="quick-history-list-wrap">
              <h3>Previous Prescription History</h3>
              <ul className="quick-history-list">
                {historyItems.map((item) => (
                  <li key={`${item.referenceId || item.fileName}-${item.uploadedAt || ""}`}>
                    <div>
                      <strong>{item.fileName || "Prescription"}</strong>
                      <p>{formatHistoryDate(item.uploadedAt)}</p>
                    </div>
                    {item.fileUrl ? (
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
