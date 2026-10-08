# Sprachmodell — Didaktische Anleitung

## Was das Werkzeug zeigt

Ein Sprachmodell liegt sonst hinter einem Anmeldefenster im Netz; hier läuft es
sichtbar **auf dem Tisch**. Drei Beobachtungen lassen sich damit unmittelbar
machen:

1. **Text entsteht Zeichen für Zeichen.** Die Antwort wird nicht abgerufen,
   sondern gerechnet — man sieht ihr beim Entstehen zu. Das erklärt, warum
   Sprachmodelle Fehler nicht „merken": jedes Zeichen ist eine Wahrscheinlichkeit,
   kein Blick in ein Lexikon.
2. **Klein heißt begrenzt.** Das Modell hat 0,5 Milliarden Parameter. Es schreibt
   flüssig, erfindet aber Fakten, zählt falsch und verliert bei mehrstufigen
   Aufgaben den Faden. Wer das einmal gesehen hat, beurteilt große Modelle anders.
3. **Der Weg nach außen fehlt.** Es gibt keine Anmeldung, kein Konto, keine
   Übertragung. Das Werkzeug eignet sich deshalb als Gegenstück zu den
   bekannten Chat-Diensten, deren Geschäftsmodell die Daten sind.

## Wozu es taugt — und wozu nicht

**Geeignet für:** Sprache untersuchen (Wie beginnt das Modell Sätze? Welche
Wörter benutzt es auffällig oft?), Textsorten nachahmen lassen, Prompt-Schreiben
üben, den Unterschied zwischen flüssig und richtig herausarbeiten, Datenschutz
und Rechenwege vergleichen.

**Nicht geeignet für:** Recherche, Hausaufgabenlösungen, Faktenprüfung,
Übersetzungen mit Anspruch, Programmcode für den Ernstfall. Dafür ist das Modell
zu klein — und das ist die Lektion, nicht der Mangel.

## Das Modell

- **Qwen2.5-0.5B-Instruct**, auf vier Bit verkleinert (q4f16_1). Entwickelt von
  Alibaba, quelloffen unter Apache-2.0.
- Läuft über **WebLLM** (mlc-ai), das Sprachmodell-Rechenwerk im Browser, das die
  Grafikkarte über die WebGPU-Schnittstelle benutzt. Ebenso quelloffen unter
  Apache-2.0.
- Die Gewichte (das „Erlernte") liegen auf unserem Server und werden bei Bedarf
  geladen. Nichts davon verlässt das Gerät wieder.

## Vergleich: kleines Modell hier, großer Dienst im Netz

| Frage | Sprachmodell auf dem Tisch | Bekannter Chat-Dienst |
| --- | --- | --- |
| Wo läuft die Rechnung? | auf dem Gerät | in einem Rechenzentrum |
| Was kostet es? | nichts, nur Strom | Abonnement oder Daten |
| Wer sieht die Frage? | niemand außerhalb des Geräts | der Anbieter |
| Wie gut ist der Text? | brauchbar, aber fehlerhaft | deutlich besser |
| Funktioniert es ohne Netz? | nach dem ersten Laden ja | nein |

Für eine Unterrichtseinheit genügt es meist, die Tabelle **leer** an die Tafel zu
schreiben und die Spalten von den Lernenden füllen zu lassen.

## Der rote Hinweis gehört dazu

Kann ein Gerät kein WebGPU, sagt die Seite das ausdrücklich (roter Hinweis statt
stiller Fehlfunktion). Das ist selbst ein Unterrichtsanlass: Rechenleistung ist
eine Voraussetzung, die nicht überall vorhanden ist — und die Geräte in der Schule
sind nicht die Geräte zu Hause.
