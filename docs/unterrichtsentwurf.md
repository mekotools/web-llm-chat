# Sprachmodell — Unterrichtsentwurf (eine Doppelstunde, 90 Minuten)

**Fach:** Deutsch, Informatik oder fächerübergreifend · **Klassen:** ab Jahrgang 8
**Voraussetzungen:** Rechner oder Tablet mit WebGPU (siehe Anleitung), Beamer
**Vorbereitung:** Seite einmal auf den Schülergeräten öffnen, damit das Modell im
Browserspeicher liegt — sonst geht die halbe Stunde für das Laden drauf.

## Grobziel

Die Lernenden beurteilen die Ausgabe eines Sprachmodells, statt sie zu glauben,
und können benennen, was ein Rechenweg auf dem eigenen Gerät von einem Dienst im
Netz unterscheidet.

## Verlauf

**1. Einstieg — 10 min: Was war das?**
Auf dem Beamer läuft die Seite. Die Lehrkraft stellt zwei Fragen: eine, die das
Modell gut beantwortet („Schreibe einen Satz, in dem alle Wörter mit S beginnen."),
und eine Faktenfrage („Wie viele Einwohner hatte Spandau 1893?"). Beide Antworten
werden nicht bewertet, sondern festgehalten: Was ist Ihnen aufgefallen?
Erwartung: flüssige Sätze, trotzdem unsicher klingende Zahlen.

**2. Erarbeitung — 25 min: Vier Aufgabenkarten in Gruppen**

Jede Gruppe bekommt eine der Karten und notiert Beobachtungen in Stichworten:

- **Karte A — Flüssig, aber falsch:** eine Faktenfrage aus dem Heimatort stellen
  und jede Zahl im Internet nachprüfen.
- **Karte B — Immer derselbe Ton:** dreimal dieselbe Bitte eingeben („Beschreibe
  einen Regentag"). Wie ähnlich sind die Antworten? Woran liegt das?
- **Karte C — Kein Gedächtnis für Zahlen:** eine Rechenaufgabe mit mehreren
  Schritten stellen („Ein Zug fährt …") und den Rechenweg prüfen.
- **Karte D — Was weiß es über Sie?** Prüfen, ob die Seite eine Anmeldung
  verlangt, ob Werbung erscheint und wohin die Angaben gehen könnten (Menü →
  Einstellungen, Netzwerkanzeige des Browsers).

**3. Sicherung — 20 min: Tafeltabelle**

Die Gruppen stellen vor; die Lehrkraft schreibt die Beobachtungen in eine Tabelle
(Textqualität, Fakten, Wiederholbarkeit, Daten). Die Spalte „Dienst im Netz" wird
gemeinsam gefüllt — aus Erfahrung aller. Kernaussage zum Mitschreiben:

> Ein Sprachmodell rechnet Wahrscheinlichkeiten für das nächste Zeichen. Es
> „weiß" nichts, es „schreibt" etwas, das wahrscheinlich passt. Auf dem eigenen
> Gerät sieht niemand mit; dafür ist die Rechnung begrenzt.

**4. Vertiefung — 25 min: Der Rechenweg vor Augen**

Kleine Übung mit der Netzwerkanzeige des Browsers (F12 → Netzwerk):

1. Seite neu laden und beobachten, welche Dateien geladen werden — Modell und
   Rechenkern kommen von unserem Server, sonst nichts.
2. Eine Frage stellen: **kein** einziger neuer Aufruf nach außen. Der Beweis, dass
   gerechnet wird und nicht gefragt.
3. Gegenprobe: Ein bekannter Chat-Dienst im Netz wird zu Vergleichszwecken
   geöffnet (falls erlaubt); hier zeigt die Anzeige bei jeder Nachricht Verkehr
   nach außen.

**5. Abschluss — 10 min: Blitzlicht**

Jede Person nennt einen Satz: „Ich würde dieses Modell einsetzen für … / nie für …"

## Hausaufgabe (optional)

Drei Fragen notieren, bei denen das Modell erkennbar falsch antwortet, und
aufschreiben, woran man den Fehler erkennt, ohne nachzuschlagen.

## Material

- [Ausführungs-Anleitung](anleitung.md) — Bedienung und Voraussetzungen
- [Didaktische Anleitung](didaktik.md) — Hintergrund und Vergleichstabelle
- Linkliste der Faktenfragen (Aufgabe A) nach Wahl der Lehrkraft

## Beurteilung

Beobachtet wird nicht die Richtigkeit der Modellantworten, sondern die Qualität
der Prüfung: Werden Aussagen nachgeprüft? Wird der Unterschied zwischen flüssig
und richtig benannt? Wird der Rechenweg auf dem Gerät als Datenschutz-Vorteil
**und** als Grenze beschrieben?
