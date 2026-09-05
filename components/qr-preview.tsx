"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

export function QRPreview({ value }: { value: string }) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let live = true;
    QRCode.toString(value, { type: "svg", margin: 1, width: 220, errorCorrectionLevel: "M" })
      .then((result) => live && setSvg(result))
      .catch(() => live && setSvg(""));
    return () => {
      live = false;
    };
  }, [value]);

  return svg ? (
    <div className="qr-svg" dangerouslySetInnerHTML={{ __html: svg }} />
  ) : (
    <div>Generating…</div>
  );
}
