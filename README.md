# MekoTools — Sprachmodell im Browser

Ein Sprachmodell, das auf dem Gerät der Lernenden rechnet: Frage eintippen,
Antwort erscheint Wort für Wort. Keine Anmeldung, keine Übertragung nach außen,
nach dem ersten Laden auch ohne Netzverbindung.

- **Adresse:** https://sprachmodell.mekotools.de
- **Vorlage:** [mlc-ai/web-llm-chat](https://github.com/mlc-ai/web-llm-chat), Fassung `223895cb1be6`
- **Modell:** Qwen2.5-0.5B-Instruct-q4f16_1 (Alibaba, Apache-2.0), geholt von
  `huggingface.co/mlc-ai/…`, aber **von unserem Server ausgeliefert**
- **Rechenkern:** WebLLM 0.2.81 (mlc-ai, Apache-2.0), WebGPU-Rechenwerk für den Browser

## Was hier von uns stammt

```
Dockerfile                        Bau des Abbilds (vier Stufen)
docker-compose.yml                Stapel für flip (Digest-genagelt)
sprachdatei/de.ts                 deutsche Oberfläche, vollständig (217 Schlüssel)
erzeugen/de-erzeugen.mjs          erzeugt sprachdatei/de.ts aus der Vorlage
patches/anpassen.mjs              Anpassungen mit Ankerprüfung (bricht bei Vorlagenwechsel ab)
patches/webgpu-hinweis.tsx        eigener Hinweis, wenn das Gerät kein WebGPU kann
modelle/modelle.txt               Dateiliste der Modellgewichte
modelle/sha256sums.txt            Prüfsummen der Gewichte (im Bau geprüft)
modelle/sha256sums-rechenkern.txt Prüfsumme des Rechenkerns (im Bau geprüft)
docs/                             Ausführungs-Anleitung, Didaktik, Unterrichtsentwurf
tool.yaml                         Katalogeintrag
```

## Die vier Eingriffe in die Vorlage

1. **Deutsche Oberfläche.** `erzeugen/de-erzeugen.mjs` füllt fehlende Beschriftungen
   aus der englischen Sprachdatei auf und ersetzt englische Reste; Ergebnis ist
   `sprachdatei/de.ts` mit allen 217 Schlüsseln. Zusätzlich steht die Vorgabesprache
   auf Deutsch.
2. **Modelle von eigener Adresse.** Die Vorlage lädt Modell und Rechenkern von
   `huggingface.co` bzw. `raw.githubusercontent.com`. `patches/anpassen.mjs` ersetzt
   die Modelliste durch `app/eigene-modelle.ts` mit Pfaden auf unserem Server und
   begrenzt die Auswahl auf dieses eine Modell.
3. **Fremdaufrufe verboten.** Die Kopfzeile `connect-src` erlaubt nur noch die
   eigene Adresse (`'self'`), `blob:` und `data:` — Verbindungen zu fremden Servern
   blockiert der Browser damit selbst.
4. **Hinweis bei fehlendem WebGPU.** Die Vorlage schaltet ohne WebGPU still auf
   einen Arbeiter ohne Grafik um: die Seite lädt, rechnet aber nicht. Statt dieses
   stillen Fehlers erscheint ein roter Hinweis mit Grund und Verweis auf
   https://mekotools.de/webgpu/.

Alle Eingriffe prüfen ihren Anker: findet das Skript die Stelle in der Vorlage nicht
mehr, bricht der Bau ab. Eine stillschweigend übersprungene Anpassung wäre schlimmer
als ein roter Bau — die Seite liefe dann wieder gegen fremde Adressen.

## Bauen und Ausliefern

```sh
# Bau in der CI (GitHub): .github/workflows/abbild.yml
# Quelle ist dieses Forgejo-Repo, gebaut wird auf GitHub (erprobte Läufer).

# Örtlich bauen:
docker build -t mekotools/web-llm-chat .

# Auf flip ausrollen (Digest aus dem CI-Lauf in docker-compose.yml eintragen):
#   cd /poolio/docker/mekotools-web-llm-chat && docker compose up -d
```

Gewichte (276 MB) und Rechenkern (4,8 MB) werden im Bau geholt und **gegen
mitgelieferte SHA-256-Prüfsummen** geprüft; eine abweichende Datei lässt den Bau
scheitern.

## Fehler der Vorlage, die den Bau aufhalten

Die Vorlage in der festgeschriebenen Fassung lässt sich mit ihrer eigenen,
eingefrorenen Abhängigkeitsliste nicht bauen. Drei Stellen mussten berichtigt
werden — die ersten zwei sind echte Fehler, nicht nur Typprobleme:

1. **`missedHeatbeat` statt `missedHeartbeat`** (`app/components/home.tsx`). Die
   Bibliothek kennt nur die zweite Schreibweise. Zur Laufzeit liest die Seite
   dadurch `undefined`, hält den Rechenkern für tot (`undefined < 3` ist falsch)
   und lädt ihn immer wieder neu.
2. **`PluggableList` aus `react-markdown/lib`** (`app/components/markdown.tsx`).
   react-markdown 9.1.0 gibt diesen Typ dort nicht mehr aus; er stammt aus
   `unified`, das react-markdown mitbringt. Nur ein Typ — `package.json` bleibt
   deshalb unberührt, sonst passte die eingefrorene Abhängigkeitsliste nicht mehr.
3. **Eine eng gefasste Prüfregel-Ausnahme.** Die Vorlage benennt zwei Komponenten
   mit Unterstrich (`_Chat`, `_MarkDownContent`). Die Regel
   `react-hooks/rules-of-hooks` erkennt solche Namen nicht als Komponenten und
   meldet deshalb jeden Haken-Aufruf als Fehler — der Bau bricht ab, obwohl der
   Code richtig ist (beide werden als JSX verwendet). Ausgenommen wird genau
   diese eine Regel in genau diesen zwei Dateien.

Alle Eingriffe stehen in `patches/anpassen.mjs` und sind einzeln kommentiert.

## Was beim Bauen sonst noch gilt

- `sprachdatei/` und `patches/` werden nach dem Einspielen **gelöscht**: sie liegen
  im Wurzelverzeichnis und würden sonst von der Typprüfung mitgelesen.
- Die ausgelieferte Seite enthält weiterhin die Adresstabelle der Bibliothek
  (`@mlc-ai/web-llm` bringt rund 400 Modelladressen mit). Benutzt wird davon
  nichts — die Modellliste der Anwendung zeigt auf unseren Server, und die
  Kopfzeile `connect-src 'self'` verbietet dem Browser jede andere Verbindung.

## Zweites Modell ergänzen

Der Bau ist auf ein Modell ausgelegt (Größe, Ladezeit, Prüfsummen). Ein größeres
Modell — etwa Qwen2.5-1.5B-Instruct-q4f16_1, braucht rund 1,6 GB Grafikkartenspeicher —
wird so ergänzt:

1. Dateiliste und Prüfsummen in `modelle/` für das neue Modell anlegen
   (`huggingface.co/api/models/<repo>?blobs=true` liefert die SHA-256-Werte der
   großen Dateien mit).
2. In `patches/anpassen.mjs` Gewichtsordner, Rechenkernname und optional den
   Eintrag in `app/eigene-modelle.ts` anpassen.
3. Im Dockerfile die Stufe `gewichte` auf die neue Quelle zeigen lassen.

## Herkunft und Lizenz

- Vorlage und Rechenkern: Apache-2.0 (mlc-ai). Lizenztexte liegen in der Vorlage.
- Modell: Qwen2.5-0.5B-Instruct von Alibaba, Apache-2.0; die Umwandlung nach MLC
  stammt von mlc-ai. Hinweis: das Umwandlungs-Repo trägt keine eigene Lizenzdatei —
  maßgeblich ist die Lizenz des Ursprungsmodells.
- Diese Anpassungen entstanden mit KI-Unterstützung (Hermes Agent); geprüft wurde
  jede Angabe am laufenden Dienst.
