export default function ScreenTransition({ children, type = "fade" }) {
  const anim = {
    fade:  "fadeIn 0.4s ease-out",
    up:    "fadeUp 0.5s ease-out",
    scale: "scaleIn 0.4s ease-out",
  }[type] || "fadeIn 0.4s";

  return (
    <div style={{ animation: anim, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
      {children}
    </div>
  );
}
