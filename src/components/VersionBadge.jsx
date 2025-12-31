// src/components/VersionBadge.jsx
import { useEffect, useState } from "react";
import appBridge from "../services/appBridge";

export default function VersionBadge() {
  const [ver, setVer] = useState("");

  useEffect(() => {
    (async () => {
      const v = await appBridge.getVersion();
      if (v) setVer(v);
    })();
  }, []);

  if (!ver) return null;

  return (
    <div style={{
      position: "fixed",
      right: 12,
      bottom: 10,
      zIndex: 9999,
      fontSize: 12,
      opacity: 0.8,
      padding: "4px 8px",
      borderRadius: 8,
      background: "var(--surface)",
      color: "var(--text)",
      userSelect: "none",
      pointerEvents: "none",
      border: "1px solid var(--divider)",
      boxShadow: "var(--shadow-1)"
    }}>
      v{ver}
    </div>
  );
}
