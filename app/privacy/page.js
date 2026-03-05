export const metadata = {
  title: "Privacy Notice",
  description: "Learn how Rudraksh Pharmacy collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <section className="section section-soft">
      <div className="container">
        <div className="section-head">
          <h1>Privacy Notice</h1>
          <p>
            This notice explains how Rudraksh Pharmacy handles personal information shared
            by customers.
          </p>
        </div>

        <article className="content-card">
          <h2>Information We Collect</h2>
          <p>
            We collect account details, profile information, and order-related data needed
            to provide pharmacy services and customer support.
          </p>

          <h2>How We Use Information</h2>
          <p>
            Your data is used for account management, order processing, communication, and
            service improvements. We do not sell your personal information.
          </p>

          <h2>Data Protection</h2>
          <p>
            We apply reasonable safeguards to protect your data. You should also keep your
            login credentials secure and avoid sharing them with others.
          </p>
        </article>
      </div>
    </section>
  );
}
