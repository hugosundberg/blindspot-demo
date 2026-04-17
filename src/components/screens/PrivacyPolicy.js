import { Phone } from "../ui";

export default function PrivacyPolicy({ onBack }) {
  return (
    <Phone>
      <div style={{ padding: "20px 24px 12px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div
          role="button"
          aria-label="Go back"
          tabIndex={0}
          onClick={onBack}
          onKeyDown={e => e.key === "Enter" && onBack()}
          style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--s1)", border: "1px solid var(--bdr)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "var(--txt-m)" }}
        >
          ←
        </div>
        <div style={{ fontFamily: "var(--fd)", fontSize: 22, letterSpacing: 2 }}>PRIVACY POLICY</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 32px", fontSize: 13, color: "var(--txt-m)", lineHeight: 1.7, display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ color: "var(--txt-d)", fontFamily: "var(--fm)", fontSize: 10, letterSpacing: 1 }}>
          LAST UPDATED: APRIL 2026
        </p>

        <section>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: 14, color: "var(--txt)", letterSpacing: 2, marginBottom: 6 }}>WHAT WE COLLECT</h2>
          <p>Blindspot does not collect or store any personal information. The display name and colour you choose exist only in memory for the duration of your game session and are deleted when the session ends.</p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: 14, color: "var(--txt)", letterSpacing: 2, marginBottom: 6 }}>GAME DATA</h2>
          <p>Game state (room code, player names, scores) is held temporarily on our server and automatically removed when the game ends or the last player disconnects. We do not persist this data to any database.</p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: 14, color: "var(--txt)", letterSpacing: 2, marginBottom: 6 }}>CRASH REPORTING</h2>
          <p>We use Sentry to capture anonymous crash reports. These reports include device type and the error stack trace, but contain no personal information.</p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: 14, color: "var(--txt)", letterSpacing: 2, marginBottom: 6 }}>THIRD PARTIES</h2>
          <p>We do not sell, trade, or share any data with third parties.</p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: 14, color: "var(--txt)", letterSpacing: 2, marginBottom: 6 }}>CONTACT</h2>
          <p>Questions? Email <span style={{ color: "var(--red)" }}>privacy@blindspot.gg</span></p>
        </section>
      </div>
    </Phone>
  );
}
