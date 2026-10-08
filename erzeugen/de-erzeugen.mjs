// Erzeugt eine vollständige deutsche Sprachdatei für web-llm-chat.
//
// Warum ein Erzeuger und keine Handarbeit: unsere deutsche Datei muss
// **dieselben Schlüssel** wie die englische Vorlage (en.ts) haben. Fehlt einer,
// bleibt genau diese Beschriftung englisch — sichtbar erst an der Stelle, die
// man zufällig aufruft. Der Erzeuger bricht deshalb ab, wenn ein Schlüssel
// weder im Altbestand noch in der Übersetzungstabelle steht.
//
// Er liest die fremden Dateien als **Text** (kein Übersetzer nötig): Importe
// werden entfernt und durch Platzhalter für die Aufzählungswerte ersetzt.
//
// Aufruf:
//   node de-erzeugen.mjs <pfad zu app/locales/en.ts> <pfad zu app/locales/de.ts>
// Ergebnis:
//   sprachdatei/de.ts   (vollständig, alle Schlüssel der englischen Vorlage)

import fs from "fs";
import path from "path";

const [enPfad, dePfad] = process.argv.slice(2);
if (!enPfad || !dePfad) {
  console.error("Aufruf: node de-erzeugen.mjs <en.ts> <de.ts>");
  process.exit(2);
}

function lade(pfad) {
  let t = fs.readFileSync(pfad, "utf8");
  const namen = new Set();
  t = t.replace(/^[ \t]*import\s+\{([^}]+)\}\s+from\s+[^;]+;/gm, (_, inner) => {
    inner.split(",").forEach((n) => {
      const s = n.trim().split(/\s+as\s+/);
      namen.add((s[1] || s[0]).trim());
    });
    return "";
  });
  t = t.replace(/^[ \t]*import\s+[^;]+;/gm, "");
  const i = t.search(/^[ \t]*export\s+default\s+/m);
  const name = i >= 0 ? t.slice(i).match(/export\s+default\s+([A-Za-z0-9_$]+)/)[1] : null;
  t = i >= 0 ? t.slice(0, i) : t; // alles ab dem Export weg (dort stehen Typdeklarationen)
  t = t.replace(/([A-Za-z_$][\w$]*)\s*:\s*(number|string|boolean|any)\b/g, "$1");
  // Typangabe an der Deklaration (z. B. `const de: PartialLocaleType = {`)
  t = t.replace(/^([ \t]*const\s+[A-Za-z0-9_$]+)\s*:\s*[^=]+=/gm, "$1 =");
  let vor = "";
  for (const n of namen) {
    vor += `const ${n} = new Proxy({}, { get: (t, k) => "\\u27e8${n}." + String(k) + "\\u27e9" });\n`;
  }
  const quelle = "(function(){" + vor + t + "\nreturn " + (name || "{}") + ";})";
  return eval(quelle)();
}

const uebersetzungen = {
  Title: "Sprachmodell im Browser",
  Subtitle: "Sprachmodelle laufen im Browser — ohne Server",

  "Chat.EditMessage.Title": "Alle Nachrichten bearbeiten",
  "Chat.EditMessage.Topic.Title": "Thema",
  "Chat.EditMessage.Topic.SubTitle": "Das aktuelle Thema ändern",
  "Chat.Actions.Share": "Teilen",
  "Chat.Actions.Edit": "Bearbeiten",
  "Chat.Actions.EditConversation": "Unterhaltung bearbeiten",
  "Chat.Actions.Stop": "Stopp",
  "Chat.Actions.Delete": "Löschen",
  "Chat.Config.Reset": "Auf Ausgangswert zurücksetzen",
  "Chat.Commands.new": "Neue Unterhaltung starten",
  "Chat.Commands.newt": "Neue Unterhaltung mit Vorlage starten",
  "Chat.Commands.next": "Nächste Unterhaltung",
  "Chat.Commands.prev": "Vorherige Unterhaltung",
  "Chat.Commands.clear": "Kontext leeren",
  "Chat.Commands.del": "Unterhaltung löschen",
  "Chat.Roles.System": "System-Anweisung",
  "Chat.Roles.Assistant": "Assistent",
  "Chat.Roles.User": "Nutzer",
  "Chat.InputActions.Stop": "Antwort abbrechen",
  "Chat.InputActions.ToBottom": "Zum Neuesten",
  "Chat.InputActions.Theme.auto": "Automatisch",
  "Chat.InputActions.Theme.light": "Hell",
  "Chat.InputActions.Theme.dark": "Dunkel",
  "Chat.InputActions.QuickPrompt": "Schnellvorlagen",
  "Chat.InputActions.Clear": "Kontext leeren",
  "Chat.InputActions.Settings": "Einstellungen",
  "Chat.InputActions.UploadImage": "Bilder hochladen",
  "Chat.Config.SaveAs": "Vorlagen sichern",
  "Chat.Config.Confirm": "Bestätigen",
  "Chat.IsContext": "System-Anweisung",

  "Export.Share": "Teilen",
  "Export.Format.Title": "Dateiformat",
  "Export.Format.SubTitle": "Markdown oder PNG-Bild",
  "Export.IncludeContext.Title": "Mit Kontext",
  "Export.IncludeContext.SubTitle": "Kontext-Anweisungen mit ausgeben",
  "Export.Steps.Select": "Auswählen",
  "Export.Steps.Preview": "Vorschau",
  "Export.Image.Toast": "Bild wird aufgenommen …",
  "Export.Image.Modal": "Zum Sichern lange drücken oder rechtsklicken",
  "Exporter.Description.Title": "Nur Nachrichten nach dem Leeren des Kontexts werden angezeigt",

  "Select.Search": "Suchen",
  "Select.All": "Alle auswählen",
  "Select.Latest": "Neueste auswählen",
  "Select.Clear": "Auswahl aufheben",

  "Settings.Danger.Reset.Title": "Alle Einstellungen zurücksetzen",
  "Settings.Danger.Reset.SubTitle": "Alle Einstellungen auf den Ausgangswert setzen",
  "Settings.Danger.Reset.Action": "Zurücksetzen",
  "Settings.Danger.Reset.Confirm": "Alle Einstellungen auf den Ausgangswert zurücksetzen?",
  "Settings.Danger.Clear.Title": "Alle Daten löschen",
  "Settings.Danger.Clear.SubTitle": "Alle Nachrichten und Einstellungen löschen",
  "Settings.Danger.Clear.Action": "Löschen",
  "Settings.Danger.Clear.Confirm": "Alle Nachrichten und Einstellungen löschen?",
  "Settings.InputTemplate.Title": "Eingabevorlage",
  "Settings.InputTemplate.SubTitle": "Die neueste Nachricht wird in diese Vorlage eingesetzt",
  "Settings.AutoGenerateTitle.Title": "Titel automatisch erzeugen",
  "Settings.AutoGenerateTitle.SubTitle":
    "Aus dem Inhalt der Unterhaltung einen passenden Titel erzeugen",
  "Settings.Template.Builtin.Title": "Mitgelieferte Vorlagen ausblenden",
  "Settings.Template.Builtin.SubTitle": "Mitgelieferte Vorlagen in der Liste ausblenden",
  "Settings.THINKING": "Denkt nach …",
  "Settings.ModelClientType.Title": "Modellbetrieb",
  "Settings.ModelClientType.WebLlm": "Im Browser (WebLLM)",
  "Settings.ModelClientType.MlcLlm": "Über eine Schnittstelle (für Fortgeschrittene)",
  "Settings.MlcLlmApi.Title": "Adresse der Schnittstelle",
  "Settings.MlcLlmApi.SubTitle": "Adresse, die der Befehl „MLC-LLM serve“ erzeugt",
  "Settings.MlcLlmApi.Connect.Title": "Verbinden",
  "Settings.MlcLlmApi.Connect.SubTitle": "Mit der Schnittstelle verbinden",
  "Settings.ContextWindowLength.Title": "Länge des Kontextfensters",
  "Settings.ContextWindowLength.SubTitle": "Größte Zahl von Token im Kontextfenster",
  "Settings.Avatar": "Bildzeichen",
  "Settings.Update.Version": "Fassung",
  "Settings.Temperature.Title": "Temperatur (Zufall)",
  "Settings.Temperature.SubTitle":
    "Niedrig bedeutet gleichförmige, wiederholbare Antworten; hoch bedeutet lebendigere, unberechenbarere",
  "Settings.TopP.Title": "Auswahlbreite (Top P)",
  "Settings.TopP.SubTitle": "Diesen Wert nicht zusammen mit der Temperatur verändern",
  "Settings.MaxTokens.Title": "Höchstlänge der Antwort",
  "Settings.MaxTokens.SubTitle":
    "Wie viele Zeichen das Modell für eine Antwort höchstens erzeugen darf",
  "Settings.PresencePenalty.Title": "Anreiz für neue Themen",
  "Settings.PresencePenalty.SubTitle":
    "Höherer Wert lässt das Modell eher neue Begriffe aufgreifen statt zu wiederholen",
  "Settings.FrequencyPenalty.Title": "Bremse für Wiederholungen",
  "Settings.FrequencyPenalty.SubTitle":
    "Höherer Wert bremst das Wiederholen bereits benutzter Wörter",
  "Settings.CacheType.Title": "Zwischenspeicher",
  "Settings.CacheType.SubTitle":
    "Modellgewichte in IndexedDB oder im Zwischenspeicher des Browsers ablegen",
  "Settings.LogLevel.Title": "Umfang der Protokollierung",
  "Settings.LogLevel.SubTitle": "Wie ausführlich die Konsole mitgeschrieben wird",
  "Settings.EnableThinking.Title": "Nachdenken erlauben",
  "Settings.EnableThinking.SubTitle":
    "Schlussfolgernden Modellen schrittweises Denken erlauben",
  "Settings.Lang.Name": "Sprache",
  "Settings.SendPreviewBubble.SubTitle": "Markdown in der Sprechblase als Vorschau zeigen",
  "Settings.Prompt.Modal.Title": "Vorlagenliste",
  "Settings.Prompt.Modal.Add": "Eine hinzufügen",
  "Settings.Prompt.Modal.Search": "Vorlagen durchsuchen",

  "Download.Success": "Inhalt heruntergeladen.",
  "Download.Failed": "Herunterladen fehlgeschlagen.",
  "Context.Clear": "Kontext geleert",
  "Context.Revert": "Zurücknehmen",

  "Template.Name": "Vorlagen",
  "Template.Page.Title": "Vorlagensammlung",
  "Template.Page.SubTitle": "Gesicherte Vorlagen",
  "Template.Page.Search": "Vorlagen durchsuchen",
  "Template.Page.Create": "Anlegen",
  "Template.Item.Info": (count) => `${count} Vorlagen`,
  "Template.Item.Chat": "Unterhaltung",
  "Template.Item.View": "Ansehen",
  "Template.Item.Edit": "Bearbeiten",
  "Template.Item.Delete": "Löschen",
  "Template.Item.DeleteConfirm": "Wirklich löschen?",
  "Template.EditModal.Title": (readonly) =>
    `${readonly ? "Vorlage ansehen" : "Vorlage bearbeiten"}${readonly ? " (nur lesen)" : ""}`,
  "Template.EditModal.Save": "Sichern",
  "Template.EditModal.Download": "Herunterladen",
  "Template.EditModal.Clone": "Kopie anlegen",
  "Template.Config.Avatar": "Bild des Assistenten",
  "Template.Config.Name": "Name der Vorlage",
  "Template.Config.HideContext.Title": "Kontext-Anweisungen ausblenden",
  "Template.Config.HideContext.SubTitle":
    "Kontext-Anweisungen nicht in der Unterhaltung zeigen",
  "Template.Config.Share.Title": "Diese Vorlage teilen",
  "Template.Config.Share.SubTitle": "Einen Verweis auf diese Vorlage erzeugen",
  "Template.Config.Share.Action": "Verweis kopieren",

  "ModelSelect.Title": "Modellwahl",
  "ModelSelect.SearchPlaceholder": "Modell suchen …",

  "UI.Export": "Exportieren",
  "UI.Import": "Importieren",
  "UI.Sync": "Abgleich",
  "UI.Config": "Konfiguration",
  "UI.Confirm": "Bestätigen",
  "UI.Cancel": "Abbrechen",
  "UI.Close": "Schließen",
  "UI.Create": "Anlegen",
  "UI.Edit": "Bearbeiten",

  "Plugin.Name": "Erweiterung",
  "URLCommand.Code": "Zugangscode aus der Adresse erkannt — übernehmen?",
  "URLCommand.Settings": "Einstellungen aus der Adresse erkannt — übernehmen?",
  "ServiceWorker.Error":
    "Die Verbindung zum Rechenkern ist verloren. Bitte alle Tabs dieser Seite schließen und neu öffnen.",
  "MlcLLMConnect.Title": "Mit der MLC-LLM-Schnittstelle verbinden",
};

function flach(o, p = "") {
  const r = {};
  for (const [k, v] of Object.entries(o)) {
    const q = p ? p + "." + k : k;
    if (v && typeof v === "object" && !Array.isArray(v)) Object.assign(r, flach(v, q));
    else r[q] = v;
  }
  return r;
}

const en = lade(enPfad);
const de = lade(dePfad);
const fe = flach(en);
const fd = flach(de);

const offen = Object.keys(fe).filter((k) => !(k in uebersetzungen) && !(k in fd));
if (offen.length) {
  console.error("ABBRUCH: für diese Schlüssel fehlt eine Übersetzung:");
  offen.forEach((k) => console.error("   " + k));
  process.exit(1);
}

const wert = (key) => (key in uebersetzungen ? uebersetzungen[key] : fd[key]);

function baue(vorlage, pfad = "") {
  if (typeof vorlage === "function") return wert(pfad);
  if (vorlage && typeof vorlage === "object") {
    const r = {};
    for (const k of Object.keys(vorlage)) r[k] = baue(vorlage[k], pfad ? pfad + "." + k : k);
    return r;
  }
  return wert(pfad);
}

// Funktionswerte als Text. Kurzschreibweise (`SubTitle(a, b) { ... }`) wird in
// Pfeilform umgeschrieben — als Objektwert ist sie sonst syntaktisch falsch.
//
// Wichtig: zur Laufzeit sind Typangaben weg (JavaScript kennt keine Typen), und
// `Function.toString()` liefert sie deshalb nicht mit. Ein Parameter ohne Angabe
// wäre in der erzeugten Datei ein „implizit any" und die Typprüfung des Baus
// bricht ab. Deshalb bekommt jeder Parameter ohne Angabe ausdrücklich `: any`
// — die Prüfung gegen die Sprachvorlage bleibt dadurch erhalten.
function mitTypen(paramliste) {
  return paramliste
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map((p) => {
      const ohneVorgabe = p.split("=")[0].trim();
      if (ohneVorgabe.includes(":")) return p;
      const vorgabe = p.includes("=") ? "=" + p.split("=").slice(1).join("=") : "";
      const ruhe = ohneVorgabe.startsWith("...");
      const name = ruhe ? ohneVorgabe.slice(3) : ohneVorgabe;
      return `${ruhe ? "..." : ""}${name}: any${vorgabe}`;
    })
    .join(", ");
}

function funktionAlsText(v) {
  const s = v.toString().replace(/\s+/g, " ").trim();
  const m = s.match(/^(async\s+)?([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{([\s\S]*)\}$/);
  if (m) return `${m[1] || ""}(${mitTypen(m[3])}) => {${m[4]}}`;
  const p = s.match(/^(\(?)([^()=]*|\([^)]*\))(\)?)\s*=>\s*([\s\S]*)$/);
  if (p) {
    const liste = p[2].replace(/^\(|\)$/g, "");
    return `(${mitTypen(liste)}) => ${p[4]}`;
  }
  return s;
}

function zeig(v, tiefe = 0) {
  const pad = "  ".repeat(tiefe);
  if (typeof v === "function") return funktionAlsText(v);
  if (typeof v === "string") return JSON.stringify(v);
  const zeilen = Object.entries(v).map(
    ([k, x]) =>
      `${pad}  ${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${zeig(x, tiefe + 1)},`,
  );
  return "{\n" + zeilen.join("\n") + "\n" + pad + "}";
}

const kopf = `import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";

// Deutsche Sprachfassung, vollständig: dieselben Schlüssel wie die englische
// Vorlage (en.ts). Erzeugt mit erzeugen/de-erzeugen.mjs im Werkzeug-Repo.
const de: PartialLocaleType = `;

const zielVerzeichnis = "sprachdatei";
fs.mkdirSync(zielVerzeichnis, { recursive: true });
const ziel = path.join(zielVerzeichnis, "de.ts");
const ergebnis = baue(en);

function findeLeer(o, p = "", raus = []) {
  if (o === undefined || o === null) { raus.push(p); return raus; }
  if (typeof o === "object") for (const [k, v] of Object.entries(o)) findeLeer(v, p ? p + "." + k : k, raus);
  return raus;
}
const leer = findeLeer(ergebnis);
if (leer.length) {
  console.error("ABBRUCH: leere Werte an diesen Stellen:", leer.join(", "));
  process.exit(1);
}

fs.writeFileSync(ziel, kopf + zeig(ergebnis) + ";\n\nexport default de;\n");

const flachNeu = flach(ergebnis);
console.log("geschrieben:", ziel);
console.log("Schlüssel englisch:", Object.keys(fe).length, "| deutsch:", Object.keys(flachNeu).length);
console.log(
  "aus der Tabelle:",
  Object.keys(uebersetzungen).length,
  "| aus dem Altbestand:",
  Object.keys(fe).length - Object.keys(uebersetzungen).length,
);
const englischGleich = Object.keys(flachNeu).filter(
  (k) => k in fe && String(flachNeu[k]) === String(fe[k]),
);
console.log("Werte, die noch wie englisch lauten:", englischGleich.length, englischGleich.join(", "));
