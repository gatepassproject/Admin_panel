const LAST_UPDATED = "March 7, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main
      style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "40px 20px 72px",
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: "#475569", marginBottom: 28 }}>
        Last updated: {LAST_UPDATED}
      </p>

      <p>
        This Privacy Policy explains how CT Group (&quot;we&quot;,
        &quot;our&quot;, &quot;us&quot;) collects, uses, stores, and shares data
        when you use the GatePass mobile application.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>1. App and Developer Information</h2>
      <p>
        App Name: GatePass
        <br />
        Android Package: com.gatepass.app
        <br />
        Developer/Organization: CT Group
        <br />
        Contact Email: support@ctgroup.in
        <br />
        Contact Phone: +91-181-5055127
        <br />
        Office Address: CT Group Administrative Block, Jalandhar, Punjab
      </p>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>2. Data We Collect</h2>
      <ul>
        <li>Account data: name, email, phone number, role, department, user ID.</li>
        <li>Profile and verification data: profile photos and pass verification images.</li>
        <li>Documents: uploaded proof files (image/PDF) when required for pass workflows.</li>
        <li>
          Location data: precise/coarse location, including background location only
          during active tracking workflows.
        </li>
        <li>
          Device and notification data: push notification token and device/app metadata.
        </li>
        <li>
          Usage logs: pass requests, approvals/rejections, gate entry/exit events,
          timestamps, and related audit trails.
        </li>
      </ul>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>3. Why We Use Data</h2>
      <ul>
        <li>To authenticate users and enforce role-based access.</li>
        <li>To process and validate digital gate passes.</li>
        <li>To support security verification workflows (including camera/QR checks).</li>
        <li>To provide notifications, alerts, and operational communication.</li>
        <li>To maintain institutional audit and security records.</li>
        <li>To enable student tracking and campus safety features where configured.</li>
      </ul>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>4. Permissions and Sensitive Data Access</h2>
      <p>
        The app may request runtime permissions such as camera, location (foreground
        and background), notifications, storage/media access, and biometric access
        based on enabled features. Permissions are requested in context and can be
        managed in device settings.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>5. Data Sharing</h2>
      <ul>
        <li>
          Data is shared only with authorized institutional roles and service providers
          required to operate the app (for example, Firebase services).
        </li>
        <li>We do not sell personal and sensitive user data.</li>
        <li>
          We may disclose data if required by law, legal process, or valid government
          request.
        </li>
      </ul>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>6. Data Security</h2>
      <p>
        We use industry-standard safeguards, including authenticated access controls
        and encryption in transit (HTTPS/TLS), to protect personal and sensitive user
        data.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>7. Data Retention</h2>
      <p>
        We retain data only as long as needed for app functionality, institutional
        security operations, legal obligations, and compliance requirements. Retention
        periods may vary by data type (for example, account data, pass logs, and
        uploaded files).
      </p>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>8. Account Deletion and User Rights</h2>
      <p>
        Users can request access, correction, or deletion of account data.
        <br />
        Account deletion process: <a href="/account-deletion">/account-deletion</a>
        <br />
        Deletion support email: support@ctgroup.in
      </p>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>9. Children and Eligibility</h2>
      <p>
        GatePass is intended for authorized users of the institution and is used under
        institutional workflows and supervision.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be
        reflected by updating the &quot;Last updated&quot; date above.
      </p>
    </main>
  );
}
