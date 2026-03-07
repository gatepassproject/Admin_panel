const LAST_UPDATED = "March 7, 2026";

export default function AccountDeletionPage() {
  return (
    <main
      style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "40px 20px 72px",
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>Account Deletion Policy</h1>
      <p style={{ color: "#475569", marginBottom: 28 }}>
        Last updated: {LAST_UPDATED}
      </p>

      <p>
        This page explains how users of the GatePass app can request account deletion
        and what data is deleted or retained.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>1. How to Request Deletion</h2>
      <ul>
        <li>
          In-app support/help channels (where available in your GatePass app role
          dashboard).
        </li>
        <li>Email request to support@ctgroup.in.</li>
      </ul>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>2. Verification</h2>
      <p>
        We verify requester identity before processing deletion to prevent unauthorized
        account removal.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>3. What We Delete</h2>
      <ul>
        <li>User account profile data is deleted or anonymized.</li>
        <li>Push tokens and non-required account-linked metadata are removed.</li>
      </ul>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>4. What May Be Retained</h2>
      <p>
        Certain records such as gate pass history, security logs, and audit records may
        be retained where required for legal, fraud prevention, institutional security,
        or regulatory compliance.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>5. Processing Timeline</h2>
      <ul>
        <li>Acknowledgment: typically within 3 business days.</li>
        <li>Completion: typically within 30 days, subject to verification.</li>
      </ul>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>6. Contact</h2>
      <p>
        CT Group
        <br />
        Email: support@ctgroup.in
        <br />
        Phone: +91-181-5055127
      </p>
    </main>
  );
}
