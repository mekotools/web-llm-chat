/**
 * Passt die Vorlage (mlc-ai/web-llm-chat) für MekoTools an.
 *
 * Jeder Eingriff hat einen Anker: fehlt der Text, bricht der Bau mit einer
 * klaren Meldung ab. Das ist Absicht — eine stillschweigend übersprungene
 * Anpassung wäre schlimmer als ein roter Bau (die Seite liefe dann wieder
 * gegen fremde Adressen oder ohne deutsche Beschriftungen).
 *
 * Die Anker sind aus der Vorlage abgeschrieben (Einfassung beachtet!) und
 * werden genau einmal erwartet.
 *
 * Läuft im Bau (Dockerfile), Arbeitsverzeichnis ist die geklonte Vorlage.
 */
import {
  readFileSync,
  writeFileSync,
  copyFileSync,
  existsSync,
  rmSync,
} from "node:fs";

const MODELL = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";
const MODELL_KLASSE = "/modelle/qwen2.5-0.5b";
const RECHENKERN = "/wasm/Qwen2-0.5B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm";

const fehler = [];
const aenderungen = [];

/** Ersetzt genau einen Anker; bricht ab, wenn er fehlt oder mehrfach vorkommt. */
function ersetze(pfad, anker, ersatz, beschreibung) {
  const quelle = readFileSync(pfad, "utf8");
  const treffer = quelle.split(anker).length - 1;
  if (treffer === 0) {
    fehler.push(`${beschreibung}: Anker nicht gefunden in ${pfad}`);
    return;
  }
  if (treffer > 1) {
    fehler.push(
      `${beschreibung}: Anker ${treffer}× gefunden in ${pfad} (erwartet 1)`,
    );
    return;
  }
  writeFileSync(pfad, quelle.replace(anker, ersatz));
  aenderungen.push(beschreibung);
}

/* 1. Deutsche Sprachdatei einsetzen (vollständig erzeugt, 217 Schlüssel). */
if (!existsSync("sprachdatei/de.ts")) {
  fehler.push("Deutsche Sprachdatei fehlt");
} else {
  copyFileSync("sprachdatei/de.ts", "app/locales/de.ts");
  aenderungen.push("Deutsche Sprachdatei eingesetzt");
}

/* 2. Vorgabesprache Deutsch (statt Englisch). */
ersetze(
  "app/locales/index.ts",
  'const DEFAULT_LANG = "en";',
  'const DEFAULT_LANG = "de";',
  "Vorgabesprache Deutsch",
);

/* 3. Eigene Modellliste: Gewichte und Rechenkern von eigener Adresse. */
writeFileSync(
  "app/eigene-modelle.ts",
  `/**
 * Diese Datei stammt von MekoTools (nicht aus der Vorlage).
 *
 * Sie ersetzt die mitgelieferte Modelliste: Gewichte und Rechenkern liegen auf
 * demselben Server wie die Seite. Damit ruft die Seite zur Laufzeit keine
 * fremde Adresse auf — nachprüfbar über die Kopfzeile connect-src 'self'
 * (siehe next.config.mjs) und über das Zugriffsprotokoll des Behälters.
 */
export const EIGENES_MODELL_ID = "${MODELL}";

export const EIGENE_MODELLE = [
  {
    model: "${MODELL_KLASSE}/",
    model_id: "${MODELL}",
    model_lib: "${RECHENKERN}",
    low_resource_required: true,
    vram_required_MB: 944.62,
    overrides: {
      context_window_size: 4096,
    },
  },
];
`,
);
aenderungen.push("Eigene Modellliste angelegt (app/eigene-modelle.ts)");

/* 4. Die Vorlage benutzt die eigene Liste statt der fremden. */
ersetze(
  "app/client/webllm.ts",
  "  InitProgressReport,\n  prebuiltAppConfig,\n  ChatCompletionMessageParam,",
  "  InitProgressReport,\n  ChatCompletionMessageParam,",
  "Fremde Modellliste entfernt (webllm.ts)",
);

ersetze(
  "app/client/webllm.ts",
  "      appConfig: {\n        ...prebuiltAppConfig,\n        useIndexedDBCache: this.llmConfig?.cache === \"index_db\",\n      },",
  "      appConfig: {\n        model_list: EIGENE_MODELLE,\n        useIndexedDBCache: true,\n      },",
  "Modelle aus eigener Quelle (webllm.ts)",
);

ersetze(
  "app/client/webllm.ts",
  'import { DEFAULT_MODELS } from "../constant";',
  'import { DEFAULT_MODELS } from "../constant";\nimport { EIGENE_MODELLE } from "../eigene-modelle";',
  "Modellliste eingebunden (webllm.ts)",
);

/* 5. Vorgabemodell und Auswahlliste auf das eigene Modell begrenzen. */
ersetze(
  "app/store/config.ts",
  'import { LogLevel, prebuiltAppConfig } from "@mlc-ai/web-llm";',
  'import { LogLevel } from "@mlc-ai/web-llm";',
  "Fremde Modellliste entfernt (config.ts)",
);

ersetze(
  "app/store/config.ts",
  "import {\n  DEFAULT_INPUT_TEMPLATE,\n  DEFAULT_MODELS,",
  "import {\n  EIGENES_MODELL_ID,\n  EIGENE_MODELLE,\n} from \"../eigene-modelle\";\nimport {\n  DEFAULT_INPUT_TEMPLATE,\n  DEFAULT_MODELS,",
  "Eigene Modellangaben eingebunden (config.ts)",
);

ersetze(
  "app/store/config.ts",
  'const DEFAULT_MODEL = "Llama-3.2-1B-Instruct-q4f32_1-MLC";',
  "const DEFAULT_MODEL = EIGENES_MODELL_ID;",
  "Vorgabemodell umgestellt",
);

ersetze(
  "app/store/config.ts",
  "  context_window_size:\n    prebuiltAppConfig.model_list.find((m) => m.model_id === DEFAULT_MODEL)\n      ?.overrides?.context_window_size ?? 4096,",
  "  context_window_size:\n    EIGENE_MODELLE.find((m) => m.model_id === DEFAULT_MODEL)?.overrides\n      ?.context_window_size ?? 4096,",
  "Kontextfenster aus eigener Liste",
);

ersetze(
  "app/store/config.ts",
  "  modelClientType: ModelClient.WEBLLM,\n  models: DEFAULT_MODELS,",
  "  modelClientType: ModelClient.WEBLLM,\n  models: DEFAULT_MODELS.filter((m) => m.name === EIGENES_MODELL_ID),",
  "Auswahlliste auf das eigene Modell begrenzt",
);

ersetze(
  "app/store/config.ts",
  "          models: DEFAULT_MODELS as any as ModelRecord[],",
  "          models: DEFAULT_MODELS.filter((m) => m.name === EIGENES_MODELL_ID) as any as ModelRecord[],",
  "Auswahlliste auch beim Übernehmen alter Einstellungen begrenzt",
);

/* 6. Keine Fremdaufrufe zur Laufzeit: Kopfzeile verbietet sie. */
ersetze(
  "next.config.mjs",
  "connect-src 'self' blob: data: https: http:;",
  "connect-src 'self' blob: data:;",
  "Kopfzeile verbietet Fremdaufrufe",
);

/* 7. Eigener Hinweis, wenn das Gerät kein WebGPU kann. */
if (!existsSync("patches/webgpu-hinweis.tsx")) {
  fehler.push("Baustein patches/webgpu-hinweis.tsx fehlt");
} else {
  copyFileSync(
    "patches/webgpu-hinweis.tsx",
    "app/components/webgpu-hinweis.tsx",
  );
  ersetze(
    "app/components/home.tsx",
    'import Locale from "../locales";',
    'import Locale from "../locales";\nimport WebgpuHinweis from "./webgpu-hinweis";',
    "Hinweis eingebunden (home.tsx)",
  );
  ersetze(
    "app/components/home.tsx",
    '        <div className={styles["window-content"]} id={SlotID.AppBody}>',
    '        <div className={styles["window-content"]} id={SlotID.AppBody}>\n          <WebgpuHinweis />',
    "Hinweis angezeigt (home.tsx)",
  );
}

/* 8. Eng gefasste Ausnahme für eine Prüfregel der Vorlage.
   Die Vorlage benennt zwei Komponenten mit Unterstrich (`_Chat`,
   `_MarkDownContent`). Die Prüfregel react-hooks/rules-of-hooks erkennt solche
   Namen nicht als Komponenten und meldet deshalb jeden Aufruf eines Hakens in
   ihnen als Fehler — der Bau bricht ab. Die Namen sind Absicht der Vorlage, das
   Verhalten ist richtig (beide werden als JSX verwendet); deshalb wird genau
   diese eine Regel in genau diesen zwei Dateien ausgenommen. */
const ausnahme =
  "/* eslint-disable react-hooks/rules-of-hooks -- Die Vorlage benennt Komponenten mit Unterstrich (_Chat, _MarkDownContent); die Pruefregel erkennt das nicht. */\n";
for (const datei of ["app/components/chat.tsx", "app/components/markdown.tsx"]) {
  const inhalt = readFileSync(datei, "utf8");
  if (inhalt.includes("eslint-disable react-hooks/rules-of-hooks")) {
    aenderungen.push(`Ausnahme war schon vorhanden (${datei})`);
    continue;
  }
  writeFileSync(datei, ausnahme + inhalt);
  aenderungen.push(`Eng gefasste Ausnahme fuer die Pruefregel (${datei})`);
}

/* 9. Tippfehler der Vorlage berichtigen.
   Die Vorlage liest `missedHeatbeat` (falsch geschrieben); die Bibliothek kennt
   nur `missedHeartbeat`. Ohne Berichtigung bricht nicht nur die Typpruefung den
   Bau ab — auch zur Laufzeit liest die Seite dann `undefined`, haelt den
   Rechenkern faelschlich fuer tot und laedt ihn immer wieder neu. */
ersetze(
  "app/components/home.tsx",
  ".missedHeatbeat < 3,",
  ".missedHeartbeat < 3,",
  "Tippfehler der Vorlage berichtigt (missedHeartbeat)",
);

/* 10. Zweiter Fehler der Vorlage: ein Typ, den die Bibliothek nicht mehr
   ausgibt. react-markdown 9.1.0 (in der Vorlage festgeschrieben) liefert
   `PluggableList` nicht mehr unter `react-markdown/lib`; der Typ stammt aus
   `unified`, das react-markdown ohnehin mitbringt. Nur ein Typ, kein Laufzeit-
   Bestandteil — package.json bleibt deshalb unberuehrt (sonst wuerde die
   eingefrorene Abhaengigkeitsliste nicht mehr passen). */
ersetze(
  "app/components/markdown.tsx",
  'import { PluggableList } from "react-markdown/lib";',
  'import type { PluggableList } from "unified";',
  "Nicht mehr ausgegebenen Typ berichtigt (PluggableList)",
);

/* 11. Die Eingaben des Baus wieder entfernen.
   `sprachdatei/` und `patches/` liegen im Wurzelverzeichnis des Projekts und
   werden von der Typpruefung mitgelesen — `sprachdatei/de.ts` importiert
   beispielsweise "../store/config", eine Datei, die es dort nicht gibt, und
   bricht den Bau ab. Nach dem Einspielen sind sie nicht mehr noetig. */
for (const ordner of ["sprachdatei", "patches"]) {
  rmSync(ordner, { recursive: true, force: true });
}
aenderungen.push("Eingaben des Baus entfernt (sprachdatei/, patches/)");

/* 12. Bericht. */
if (fehler.length) {
  console.error("Die Anpassung ist fehlgeschlagen:");
  for (const f of fehler) console.error("  - " + f);
  process.exit(1);
}
console.log(`Anpassung abgeschlossen (${aenderungen.length} Eingriffe):`);
for (const a of aenderungen) console.log("  - " + a);
