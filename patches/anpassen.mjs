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
  "      appConfig: {\n        // Der Rechenkern der Bibliothek verlangt vollstaendige Adressen: er baut\n        // aus dem Eintrag eine URL und haengt dabei \"resolve/main/\" an (siehe\n        // @mlc-ai/web-llm). Ein relativer Pfad loest dort einen TypeError aus —\n        // genau der Fehler, der die Seite unbrauchbar machte. Deshalb hier gegen\n        // die Adresse der Seite aufloesen; die Gewichte liegen unter\n        // /modelle/qwen2.5-0.5b/resolve/main/.\n        model_list: EIGENE_MODELLE.map((m) => ({\n          ...m,\n          model: new URL(m.model, document.baseURI).href,\n          model_lib: new URL(m.model_lib, document.baseURI).href,\n        })),\n        useIndexedDBCache: this.llmConfig?.cache === \"index_db\",\n      },",
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

/* 12. Seitentitel und Beschreibung auf Deutsch und ohne Fremdverweise.
   Die Vorlage traegt ihren eigenen Namen, ihre Beschreibung und ihre Adresse
   (chat.webllm.ai) an sechs Stellen in `app/layout.tsx` ein — im Titel des
   Browsers, in den Vorschaukarten und in den strukturierten Daten. Fuer ein
   Werkzeug, das keine fremde Adresse aufrufen soll, gehoert dort unser eigener
   Name und unsere eigene Adresse hin. Das Vorschaubild liegt ebenfalls bei uns
   (public/mlc-logo.png). */
function ersetzeAlle(pfad, anker, ersatz, beschreibung) {
  const quelle = readFileSync(pfad, "utf8");
  const treffer = quelle.split(anker).length - 1;
  if (treffer === 0) {
    fehler.push(`${beschreibung}: Anker nicht gefunden in ${pfad}`);
    return;
  }
  writeFileSync(pfad, quelle.split(anker).join(ersatz));
  aenderungen.push(`${beschreibung} (${treffer} Stellen)`);
}

ersetzeAlle(
  "app/layout.tsx",
  "WebLLM Chat - Browser-based AI conversation",
  "Sprachmodell im Browser",
  "Vorschaubild-Beschriftung auf Deutsch",
);
ersetzeAlle(
  "app/layout.tsx",
  "https://chat.webllm.ai",
  "https://sprachmodell.mekotools.de",
  "Fremde Adresse durch die eigene ersetzt",
);
ersetzeAlle(
  "app/layout.tsx",
  "Chat with AI large language models running natively in your browser. Enjoy private, server-free, seamless AI conversations.",
  "Ein Sprachmodell im Browser ausprobieren: Frage eintippen, Antwort erscheint. Ohne Anmeldung, ohne Übertragung — gerechnet wird auf dem eigenen Gerät.",
  "Beschreibung der Seite auf Deutsch",
);
ersetzeAlle(
  "app/layout.tsx",
  "Chat with AI large language models running natively in your browser",
  "Sprachmodell im Browser: antwortet ohne Anmeldung, gerechnet wird auf dem eigenen Gerät",
  "Kurzbeschreibung der Seite auf Deutsch",
);
ersetzeAlle(
  "app/layout.tsx",
  "WebLLM Chat",
  "Sprachmodell im Browser",
  "Seitentitel auf Deutsch",
);
ersetzeAlle("app/layout.tsx", '"WebLLM",', '"Sprachmodell",', "Suchbegriff auf Deutsch");

/* 13. Deutsche Oberflaeche als Vorgabe.
   `DEFAULT_LANG = "de"` steht schon in Schritt 2. Es reichte aber nicht: die
   Vorlage richtet sich zuerst nach der Sprache des Browsers und faellt nur
   sonst auf die Vorgabe zurueck. Auf einem Geraet mit englischer
   Spracheinstellung erschien die ganze Oberflaeche deshalb englisch, obwohl die
   deutsche Sprachdatei beiliegt. Hier faellt die Browsersprache weg; eine andere
   Sprache waehlt man weiterhin in den Einstellungen (oder mit ?lang=xx). */
ersetze(
  "app/locales/index.ts",
  `  try {
    return navigator.language.toLowerCase();
  } catch {
    return DEFAULT_LANG;
  }`,
  `  try {
    // MekoTools: deutsche Vorgabe. Die Sprache des Browsers wird bewusst
    // nicht ausgewertet — sonst erscheint die Oberflaeche auf Geraeten mit
    // englischer Einstellung englisch. Umstellen: Einstellungen oder ?lang=xx.
    return DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }`,
  "Browsersprache nicht mehr ausgewertet",
);
ersetze("app/layout.tsx", '<html lang="en">', '<html lang="de">', "Sprachkennzeichnung auf Deutsch");

/* 15. Nur Modelle anbieten, die hier wirklich liegen.

   Die Vorlage setzt beim Start `config.setModels(DEFAULT_MODELS)` — die
   vollstaendige Liste der WebLLM-Vorlagen (Phi, Llama 3B/8B, DeepSeek 7B,
   Hermes …). Im Auswahlfeld standen dadurch ueber 30 Modelle, von denen
   keines ausser dem eigenen geladen werden kann: die Kopfzeile laesst nur den
   eigenen Server zu, die Gewichte der anderen liegen bei Hugging Face. Wer
   eines davon waehlte, bekam einen Ladefehler — genau der Eindruck "die
   Modelle sind nicht da". Uebrig bleibt, was in eigene-modelle.ts steht. */
ersetze(
  "app/components/home.tsx",
  "      config.setModels(DEFAULT_MODELS);",
  `      // MekoTools: nur Modelle, deren Gewichte auf diesem Server liegen.
      // Ohne diesen Filter ueberschreibt die Vorlage die Auswahl mit ihrer
      // vollstaendigen Fremdliste.
      config.setModels(
        DEFAULT_MODELS.filter((m) =>
          EIGENE_MODELLE.some((e) => e.model_id === m.name),
        ),
      );`,
  "Auswahlliste auf vorhandene Modelle begrenzt (home.tsx)",
);

ersetze(
  "app/components/home.tsx",
  `import { DEFAULT_MODELS, Path, SlotID } from "../constant";`,
  `import { DEFAULT_MODELS, Path, SlotID } from "../constant";
import { EIGENE_MODELLE } from "../eigene-modelle";`,
  "Eigene Modellangaben eingebunden (home.tsx)",
);

/* 16. Zwischenspeicher fuer Gewichte und Rechenkern.

   Die Dateien gingen ohne Haltbarkeitsangabe ueber die Leitung (max-age=0),
   und WebLLMs eigener Speicher greift nur beim Rechnen. Ergebnis: bei jedem
   Aufruf liefen die 271 MB erneut. Diese Regel legt sie in den
   Zwischenspeicher des Browsers; ab dem zweiten Aufruf wird nichts mehr
   geholt. */
ersetze(
  "app/worker/service-worker.ts",
  "    ...defaultCache,",
  `    /* MekoTools: Gewichte und Rechenkern. CacheFirst ohne Ablauf — die
       Dateien tragen ihre Fassung im Namen. */
    {
      matcher: ({ sameOrigin, url: { pathname } }) =>
        sameOrigin &&
        (pathname.startsWith("/modelle/") || pathname.startsWith("/wasm/")),
      handler: new CacheFirst({
        cacheName: "mekotools-gewichte",
      }),
    },
    ...defaultCache,`,
  "Zwischenspeicher fuer Gewichte und Rechenkern (service-worker.ts)",
);

/* 17. Haltbarkeit in der Kopfzeile — greift auch ohne Service Worker. */
ersetze(
  "next.config.mjs",
  `      {
        source: "/api/:path*",
        headers: CorsHeaders,
      },`,
  `      {
        source: "/api/:path*",
        headers: CorsHeaders,
      },
      {
        /* MekoTools: Gewichte und Rechenkern tragen ihre Fassung im Namen und
           aendern sich unter derselben Adresse nie. Ein Jahr Haltbarkeit —
           vorher stand dort max-age=0, also eine Rueckfrage bei jedem Aufruf. */
        source: "/modelle/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/wasm/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },`,
  "Haltbarkeit fuer Gewichte und Rechenkern (next.config.mjs)",
);

/* 18. Modellbetrieb: der Schnittstellen-Betrieb faellt weg.

   Er wuerde einen fremden Server aufrufen; die Kopfzeile laesst aber nur den
   eigenen zu (connect-src 'self'). Ein Schalter, der garantiert scheitert,
   gehoert nicht in die Oberflaeche. */
ersetze(
  "app/components/model-config.tsx",
  `          <option value={ModelClient.MLCLLM_API} key={ModelClient.MLCLLM_API}>
            {Locale.Settings.ModelClientType.MlcLlm}
          </option>
        </Select>`,
  `        </Select>
        <p style={{ opacity: 0.7, fontSize: "0.85em", marginTop: 4 }}>
          Dieses Werkzeug rechnet im Browser und ruft keinen fremden Server
          auf. Der Betrieb ueber eine Schnittstelle ist deshalb nicht moeglich.
        </p>`,
  "Schnittstellen-Betrieb entfernt (war durch die Kopfzeile gesperrt)",
);

/* 19. Das eine vorhandene Modell erklaeren. */
ersetze(
  "app/components/model-config.tsx",
  `            </Select>
          </ListItem>

          {config.modelConfig.model.toLowerCase().startsWith("qwen3") && (`,
  `            </Select>
            <p style={{ opacity: 0.7, fontSize: "0.85em", marginTop: 4 }}>
              Auf diesem Server liegt genau ein Modell: Qwen 2.5 mit 0,5 Mrd.
              Parametern. Es ist klein und schnell und kommt mit deutschen
              Texten zurecht. Der Download ist rund 271 MB gross, laeuft einmal
              und bleibt danach im Browserspeicher.
            </p>
          </ListItem>

          {config.modelConfig.model.toLowerCase().startsWith("qwen3") && (`,
  "Modellbeschreibung auf Deutsch",
);

/* 20. Bericht. */
if (fehler.length) {
  console.error("Die Anpassung ist fehlgeschlagen:");
  for (const f of fehler) console.error("  - " + f);
  process.exit(1);
}
console.log(`Anpassung abgeschlossen (${aenderungen.length} Eingriffe):`);
for (const a of aenderungen) console.log("  - " + a);
