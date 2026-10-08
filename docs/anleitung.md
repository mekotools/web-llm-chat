# Sprachmodell — Ausführungs-Anleitung

Öffne im Browser **sprachmodell.mekotools.de**. Keine Anmeldung, keine Installation.

Beim ersten Aufruf lädt die Seite einmalig das Modell (rund 280 MB) und braucht
dafür je nach Verbindung ein bis mehrere Minuten. Danach bleibt es im
Browserspeicher: weitere Aufrufe starten in Sekunden. Gerechnet wird immer auf
dem eigenen Gerät — nach dem Laden arbeitet die Seite auch ohne Netzverbindung.

## Voraussetzung: WebGPU

Die Seite rechnet auf der Grafikkarte des Geräts. Dafür braucht der Browser
**WebGPU**:

- **Passende Geräte:** Rechner und Tablets mit aktueller Grafikkarte, Windows,
  macOS oder Linux, Browser Chrome/Edge ab Version 113 oder Firefox ab Version 141.
- **Nicht passend:** ältere Rechner ohne Grafikbeschleunigung, Geräte im
  Fernzugriff (RDP), viele Schulrechner mit abgeschalteter Hardware-Beschleunigung
  und iPhones/iPads mit älterem System.

Kann das Gerät kein WebGPU, erscheint beim Öffnen ein **roter Hinweis** mit dem
Grund. Was WebGPU ist und wie man es prüft, steht unter
[mekotools.de/webgpu](https://mekotools.de/webgpu/).

## In drei Schritten

1. **Frage eintippen.** Unten in das Eingabefeld — eine Frage, eine Bitte, ein
   Satzanfang.
2. **Senden** (Eingabetaste oder der Pfeil-Knopf). Die Antwort erscheint Wort für
   Wort, während sie gerechnet wird.
3. **Weiterfragen.** Das Modell kennt den bisherigen Verlauf und bezieht sich
   darauf. Ein neuer Chat beginnt oben links.

**Tempo.** Das erste Zeichen einer Antwort lässt einige Sekunden auf sich warten,
danach fließt der Text. Das ist normal: das Modell rechnet Zeichen für Zeichen
auf dem Gerät.

## Einstellungen (Zahnrad)

Die wichtigsten Regler in einfachen Worten:

- **Antwortlänge** — wie viel Text das Modell höchstens erzeugen darf.
- **Zufall** (im Programm: *temperature*) — niedrig bedeutet gleichförmige und
  wiederholbare Antworten, hoch bedeutet lebendigere und unberechenbarere.
- **Sprache** — die Oberfläche steht auf Deutsch; andere Sprachen lassen sich
  umstellen.

Alle Einstellungen liegen nur auf dem Gerät (Browserspeicher). Es gibt keine
Konten und keine Übertragung nach außen.

## Dateien und Daten

- Es wird **nichts hochgeladen**. Frage, Antwort und Verlauf bleiben auf dem Gerät;
  es gibt keinen Server, der sie speichern könnte.
- Die Seite lädt **keine fremden Bestandteile**: Modell und Rechenkern kommen von
  unserem Server, sonst nichts. Keine Werbenetze, keine Zähl-Dienste, keine
  fremden Schriftarten. Die Kopfzeile der Seite verbietet dem Browser ausdrücklich
  Verbindungen zu anderen Adressen.
- Der Verlauf liegt im Browserspeicher des Geräts. Auf geteilten Geräten sieht die
  nächste Person mit demselben Browserprofil die alten Chats — vor der Weitergabe
  über das Menü löschen.

## Grenzen

- **Das Modell ist klein** (Qwen2.5 mit 0,5 Milliarden Parametern, auf vier Bit
  verkleinert). Es antwortet auf Deutsch und Englisch brauchbar, erfindet aber
  Fakten, verliert bei längeren Aufgaben den Faden und kennt kein Weltwissen nach
  seinem Stand. Genau das ist zum Anschauen interessant — als Nachschlagewerk ist
  es nicht gedacht.
- **Ein Modell, keine Auswahl.** Ein weiteres Modell wäre ein neuer Bau des
  Abbilds, kein Schalter.
- **Kein Bild, kein Ton.** Die Seite nimmt nur Text.
- **Nur ein Tab.** Wird die Seite in zwei Tabs geöffnet, teilen sich beide die
  Grafikkarte; der zweite Tab arbeitet deutlich langsamer.

## Wenn etwas klemmt

- *Roter Hinweis „kein WebGPU"* → anderer Rechner oder anderer Browser; auf
  Schulrechnern oft die Hardware-Beschleunigung in den Browsereinstellungen.
- *Seite lädt sehr lange* → das erste Laden holt 280 MB; Fortschritt steht als
  Balken auf der Seite.
- *Antwort bricht ab* → der Browserspeicher reicht nicht (mehrere schwere Tabs
  offen). Seite neu laden; das Modell bleibt im Speicher.
