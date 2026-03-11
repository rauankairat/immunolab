export default function VerifiedPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
      background: "#f7f9f7",
    }}>
      <div style={{
        textAlign: "center",
        padding: "3rem 2rem",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        maxWidth: "400px",
        width: "90%",
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
        <h1 style={{
          color: "#1a5319",
          fontSize: "1.6rem",
          fontWeight: 700,
          margin: "0 0 0.8rem",
        }}>
          Email Verified!
        </h1>
        <p style={{
          color: "rgba(0,0,0,0.6)",
          fontSize: "1rem",
          lineHeight: 1.6,
          margin: 0,
        }}>
          Your email has been confirmed. You can close this tab.
        </p>
      </div>
    </div>
  );
}