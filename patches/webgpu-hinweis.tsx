"use client";

/**
 * Dieser Baustein stammt von MekoTools (nicht aus der Vorlage).
 *
 * Er prüft im Browser, ob das Gerät WebGPU kann, und blendet sonst einen
 * Hinweis ein. Die Vorlage schaltet ohne WebGPU still auf einen Arbeiter ohne
 * Grafik um — die Seite lädt dann, rechnet aber nicht. Genau dieser stille
 * Fehler soll hier sichtbar werden.
 *
 * Ablauf wie auf der Katalogseite: navigator.gpu vorhanden? → requestAdapter()
 * mit Frist (manche Geräte melden WebGPU und antworten nie).
 */
import { useEffect, useState } from "react";

export default function WebgpuHinweis() {
  const [lage, setLage] = useState<"unbekannt" | "da" | "fehlt">("unbekannt");
  const [grund, setGrund] = useState("");

  useEffect(() => {
    let fertig = false;
    const melde = (text: string) => {
      if (fertig) return;
      fertig = true;
      setGrund(text);
      setLage("fehlt");
    };

    const gpu = (navigator as any).gpu;
    if (!("gpu" in navigator)) {
      melde("Dieser Browser kennt die WebGPU-Schnittstelle nicht.");
      return;
    }

    const frist = setTimeout(() => {
      melde(
        "Der Browser antwortet nicht auf die WebGPU-Anfrage — die Grafik ist vermutlich nicht verfügbar.",
      );
    }, 4000);

    gpu
      .requestAdapter()
      .then((karte: unknown) => {
        clearTimeout(frist);
        if (karte) {
          setLage("da");
        } else {
          melde("Der Browser findet keine Grafik, die WebGPU kann.");
        }
      })
      .catch((fehler: any) => {
        clearTimeout(frist);
        melde("WebGPU meldet einen Fehler: " + (fehler?.message ?? fehler));
      });

    return () => clearTimeout(frist);
  }, []);

  if (lage !== "fehlt") {
    return null;
  }

  return (
    <div
      role="alert"
      style={{
        background: "#fdecea",
        borderLeft: "4px solid #b3261e",
        color: "#3b0a06",
        padding: "10px 14px",
        margin: "8px 12px 12px",
        borderRadius: "4px",
        fontSize: "14px",
        lineHeight: 1.5,
      }}
    >
      <strong>Dieses Gerät kann kein WebGPU.</strong> {grund} Das Sprachmodell
      rechnet komplett auf dem eigenen Gerät und braucht dafür die Grafikkarte —
      hier wird es nicht antworten können. Auf einem anderen Rechner, in einem
      neueren Browser oder mit eingeschalteter Hardwarebeschleunigung geht es.
      Was WebGPU ist und wie man es prüft, steht unter{" "}
      <a href="https://mekotools.de/webgpu/" style={{ color: "#b3261e" }}>
        mekotools.de/webgpu
      </a>
      .
    </div>
  );
}
