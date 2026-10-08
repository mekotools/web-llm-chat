import { SubmitKey } from "../store/config";
import type { PartialLocaleType } from "./index";

// Deutsche Sprachfassung, vollständig: dieselben Schlüssel wie die englische
// Vorlage (en.ts). Erzeugt mit erzeugen/de-erzeugen.mjs im Werkzeug-Repo.
const de: PartialLocaleType = {
  Title: "Sprachmodell im Browser",
  Subtitle: "Sprachmodelle laufen im Browser — ohne Server",
  WIP: "In Bearbeitung...",
  ChatItem: {
    ChatItemCount: (count: any) => `${count} Nachrichten`,
  },
  Chat: {
    SubTitle: (count: any) => `${count} Nachrichten im Verlauf`,
    EditMessage: {
      Title: "Alle Nachrichten bearbeiten",
      Topic: {
        Title: "Thema",
        SubTitle: "Das aktuelle Thema ändern",
      },
    },
    Actions: {
      ChatList: "Zur Chat-Liste gehen",
      CompressedHistory: "Komprimierter Gedächtnis-Prompt",
      Export: "Alle Nachrichten als Markdown exportieren",
      Copy: "Kopieren",
      Stop: "Stopp",
      Share: "Teilen",
      Retry: "Wiederholen",
      Delete: "Löschen",
      Edit: "Bearbeiten",
      EditConversation: "Unterhaltung bearbeiten",
    },
    Commands: {
      new: "Neue Unterhaltung starten",
      newt: "Neue Unterhaltung mit Vorlage starten",
      next: "Nächste Unterhaltung",
      prev: "Vorherige Unterhaltung",
      clear: "Kontext leeren",
      del: "Unterhaltung löschen",
    },
    Roles: {
      System: "System-Anweisung",
      Assistant: "Assistent",
      User: "Nutzer",
    },
    InputActions: {
      Stop: "Antwort abbrechen",
      ToBottom: "Zum Neuesten",
      Theme: {
        auto: "Automatisch",
        light: "Hell",
        dark: "Dunkel",
      },
      QuickPrompt: "Schnellvorlagen",
      Clear: "Kontext leeren",
      Settings: "Einstellungen",
      UploadImage: "Bilder hochladen",
    },
    Rename: "Chat umbenennen",
    Typing: "Tippen...",
    Input: (submitKey: any) => { var inputHints = `${submitKey} um zu Senden`; if (submitKey === String(SubmitKey.Enter)) { inputHints += ", Umschalt + Eingabe für Zeilenumbruch"; } return inputHints + ", / zum Durchsuchen von Prompts"; },
    Send: "Senden",
    Config: {
      Reset: "Auf Ausgangswert zurücksetzen",
      SaveAs: "Vorlagen sichern",
      Confirm: "Bestätigen",
    },
    IsContext: "System-Anweisung",
  },
  Export: {
    Title: "Alle Nachrichten",
    Copy: "Alles kopieren",
    Download: "Herunterladen",
    MessageFromYou: "Deine Nachricht",
    MessageFromWebLLM: "Nachricht vom Sprachmodell",
    Share: "Teilen",
    Format: {
      Title: "Dateiformat",
      SubTitle: "Markdown oder PNG-Bild",
    },
    IncludeContext: {
      Title: "Mit Kontext",
      SubTitle: "Kontext-Anweisungen mit ausgeben",
    },
    Steps: {
      Select: "Auswählen",
      Preview: "Vorschau",
    },
    Image: {
      Toast: "Bild wird aufgenommen …",
      Modal: "Zum Sichern lange drücken oder rechtsklicken",
    },
  },
  Select: {
    Search: "Suchen",
    All: "Alle auswählen",
    Latest: "Neueste auswählen",
    Clear: "Auswahl aufheben",
  },
  Memory: {
    Title: "Gedächtnis-Prompt",
    EmptyContent: "Noch nichts.",
    Send: "Gedächtnis senden",
    Copy: "Gedächtnis kopieren",
    Reset: "Sitzung zurücksetzen",
    ResetConfirm: "Das Zurücksetzen löscht den aktuellen Gesprächsverlauf und das Langzeit-Gedächtnis. Möchten Sie wirklich zurücksetzen?",
  },
  Home: {
    NewChat: "Neuer Chat",
    DeleteChat: "Bestätigen Sie, um das ausgewählte Gespräch zu löschen?",
    DeleteToast: "Chat gelöscht",
    Revert: "Zurücksetzen",
  },
  Settings: {
    Title: "Einstellungen",
    SubTitle: "Alle Einstellungen",
    Danger: {
      Reset: {
        Title: "Alle Einstellungen zurücksetzen",
        SubTitle: "Alle Einstellungen auf den Ausgangswert setzen",
        Action: "Zurücksetzen",
        Confirm: "Alle Einstellungen auf den Ausgangswert zurücksetzen?",
      },
      Clear: {
        Title: "Alle Daten löschen",
        SubTitle: "Alle Nachrichten und Einstellungen löschen",
        Action: "Löschen",
        Confirm: "Alle Nachrichten und Einstellungen löschen?",
      },
    },
    Lang: {
      Name: "Sprache",
      All: "Alle Sprachen",
    },
    Avatar: "Bildzeichen",
    FontSize: {
      Title: "Schriftgröße",
      SubTitle: "Schriftgröße des Chat-Inhalts anpassen",
    },
    InjectSystemPrompts: {
      Title: "System-Prompts einfügen",
      SubTitle: "Setzt vor jede Anfrage eine feste Vorgabe an den Anfang der Nachrichtenliste",
    },
    InputTemplate: {
      Title: "Eingabevorlage",
      SubTitle: "Die neueste Nachricht wird in diese Vorlage eingesetzt",
    },
    Update: {
      Version: "Fassung",
      IsLatest: "Neueste Version",
      CheckUpdate: "Update prüfen",
      IsChecking: "Update wird geprüft...",
      FoundUpdate: (x: any) => `Neue Version gefunden: ${x}`,
      GoToUpdate: "Aktualisieren",
    },
    SendKey: "Senden-Taste",
    Theme: "Erscheinungsbild",
    TightBorder: "Enger Rahmen",
    SendPreviewBubble: {
      Title: "Vorschau-Bubble senden",
      SubTitle: "Markdown in der Sprechblase als Vorschau zeigen",
    },
    AutoGenerateTitle: {
      Title: "Titel automatisch erzeugen",
      SubTitle: "Aus dem Inhalt der Unterhaltung einen passenden Titel erzeugen",
    },
    Template: {
      Builtin: {
        Title: "Mitgelieferte Vorlagen ausblenden",
        SubTitle: "Mitgelieferte Vorlagen in der Liste ausblenden",
      },
    },
    Prompt: {
      Disable: {
        Title: "Autovervollständigung deaktivieren",
        SubTitle: "Autovervollständigung mit / starten",
      },
      List: "Prompt-Liste",
      ListCount: (builtin: any, custom: any) => `${builtin} integriert, ${custom} benutzerdefiniert`,
      Edit: "Bearbeiten",
      Modal: {
        Title: "Vorlagenliste",
        Add: "Eine hinzufügen",
        Search: "Vorlagen durchsuchen",
      },
      EditModal: {
        Title: "Edit Prompt",
      },
    },
    HistoryCount: {
      Title: "Anzahl der angehängten Nachrichten",
      SubTitle: "Anzahl der pro Anfrage angehängten gesendeten Nachrichten",
    },
    CompressThreshold: {
      Title: "Schwellenwert für Verlaufskomprimierung",
      SubTitle: "Komprimierung, wenn die Länge der unkomprimierten Nachrichten den Wert überschreitet",
    },
    THINKING: "Denkt nach …",
    Usage: {
      Title: "Kontostand",
      SubTitle: (used: any, total: any) => { return `Diesen Monat ausgegeben $${used}, Abonnement $${total}`; },
      IsChecking: "Wird überprüft...",
      Check: "Erneut prüfen",
      NoAccess: "API-Schlüssel eingeben, um den Kontostand zu überprüfen",
    },
    Model: "Modell",
    ModelClientType: {
      Title: "Modellbetrieb",
      WebLlm: "Im Browser (auf diesem Gerät)",
      MlcLlm: "Über eine Schnittstelle (für Fortgeschrittene)",
    },
    MlcLlmApi: {
      Title: "Adresse der Schnittstelle",
      SubTitle: "Adresse des Servers, der das Modell bereitstellt",
      Connect: {
        Title: "Verbinden",
        SubTitle: "Mit der Schnittstelle verbinden",
      },
    },
    ContextWindowLength: {
      Title: "Länge des Kontextfensters",
      SubTitle: "Größte Zahl von Token im Kontextfenster",
    },
    Temperature: {
      Title: "Temperatur (Zufall)",
      SubTitle: "Niedrig bedeutet gleichförmige, wiederholbare Antworten; hoch bedeutet lebendigere, unberechenbarere",
    },
    TopP: {
      Title: "Auswahlbreite (Top P)",
      SubTitle: "Diesen Wert nicht zusammen mit der Temperatur verändern",
    },
    MaxTokens: {
      Title: "Höchstlänge der Antwort",
      SubTitle: "Wie viele Zeichen das Modell für eine Antwort höchstens erzeugen darf",
    },
    PresencePenalty: {
      Title: "Anreiz für neue Themen",
      SubTitle: "Höherer Wert lässt das Modell eher neue Begriffe aufgreifen statt zu wiederholen",
    },
    FrequencyPenalty: {
      Title: "Bremse für Wiederholungen",
      SubTitle: "Höherer Wert bremst das Wiederholen bereits benutzter Wörter",
    },
    CacheType: {
      Title: "Zwischenspeicher",
      SubTitle: "Modellgewichte in IndexedDB oder im Zwischenspeicher des Browsers ablegen",
    },
    LogLevel: {
      Title: "Umfang der Protokollierung",
      SubTitle: "Wie ausführlich die Konsole mitgeschrieben wird",
    },
    EnableThinking: {
      Title: "Nachdenken erlauben",
      SubTitle: "Schlussfolgernden Modellen schrittweises Denken erlauben",
    },
  },
  Store: {
    DefaultTopic: "Neues Gespräch",
    BotHello: "Hallo! Wie kann ich Ihnen heute helfen?",
    Error: "Etwas ist schief gelaufen, bitte versuchen Sie es später noch einmal.",
    Prompt: {
      History: (content: any) => "Dies ist eine Zusammenfassung des Chatverlaufs zwischen dem KI und dem Benutzer als Rückblick: " + content,
      Topic: "Bitte erstellen Sie einen vier- bis fünfwörtigen Titel, der unser Gespräch zusammenfasst, ohne Einleitung, Zeichensetzung, Anführungszeichen, Punkte, Symbole oder zusätzlichen Text. Entfernen Sie Anführungszeichen.",
      Summarize: "Fassen Sie unsere Diskussion kurz in 200 Wörtern oder weniger zusammen, um sie als Pronpt für zukünftige Gespräche zu verwenden.",
    },
  },
  Copy: {
    Success: "In die Zwischenablage kopiert",
    Failed: "Kopieren fehlgeschlagen, bitte geben Sie die Berechtigung zum Zugriff auf die Zwischenablage frei",
  },
  Download: {
    Success: "Inhalt heruntergeladen.",
    Failed: "Herunterladen fehlgeschlagen.",
  },
  Context: {
    Toast: (x: any) => `Mit ${x} Kontext-Prompts`,
    Edit: "Kontext- und Gedächtnis-Prompts",
    Add: "Hinzufügen",
    Clear: "Kontext geleert",
    Revert: "Zurücknehmen",
  },
  Plugin: {
    Name: "Erweiterung",
  },
  FineTuned: {
    Sysmessage: "Du bist ein Assistent, der",
  },
  Template: {
    Name: "Vorlagen",
    Page: {
      Title: "Vorlagensammlung",
      SubTitle: "Gesicherte Vorlagen",
      Search: "Vorlagen durchsuchen",
      Create: "Anlegen",
    },
    Item: {
      Info: (count: any) => `${count} Vorlagen`,
      Chat: "Unterhaltung",
      View: "Ansehen",
      Edit: "Bearbeiten",
      Delete: "Löschen",
      DeleteConfirm: "Wirklich löschen?",
    },
    EditModal: {
      Title: (readonly: any) => `${readonly ? "Vorlage ansehen" : "Vorlage bearbeiten"}${readonly ? " (nur lesen)" : ""}`,
      Save: "Sichern",
      Download: "Herunterladen",
      Clone: "Kopie anlegen",
    },
    Config: {
      Avatar: "Bild des Assistenten",
      Name: "Name der Vorlage",
      HideContext: {
        Title: "Kontext-Anweisungen ausblenden",
        SubTitle: "Kontext-Anweisungen nicht in der Unterhaltung zeigen",
      },
      Share: {
        Title: "Diese Vorlage teilen",
        SubTitle: "Einen Verweis auf diese Vorlage erzeugen",
        Action: "Verweis kopieren",
      },
    },
  },
  NewChat: {
    Return: "Zurückkehren",
    Skip: "Fang einfach an",
    Title: "Wählen Sie eine Vorlage",
    SubTitle: "Starten Sie den Chat mit einer Vorlage",
    More: "Finde mehr",
    NotShow: "Nie wieder zeigen",
    ConfirmNoShow: "Zum Deaktivieren bestätigen? Sie können es später in den Einstellungen aktivieren.",
  },
  ModelSelect: {
    Title: "Modellwahl",
    SearchPlaceholder: "Modell suchen …",
  },
  UI: {
    Confirm: "Bestätigen",
    Cancel: "Abbrechen",
    Close: "Schließen",
    Create: "Anlegen",
    Edit: "Bearbeiten",
    Export: "Exportieren",
    Import: "Importieren",
    Sync: "Abgleich",
    Config: "Konfiguration",
  },
  Exporter: {
    Description: {
      Title: "Nur Nachrichten nach dem Leeren des Kontexts werden angezeigt",
    },
    Model: "Modell",
    Messages: "Nachrichten",
    Topic: "Thema",
    Time: "Zeit",
  },
  URLCommand: {
    Code: "Zugangscode aus der Adresse erkannt — übernehmen?",
    Settings: "Einstellungen aus der Adresse erkannt — übernehmen?",
  },
  ServiceWorker: {
    Error: "Die Verbindung zum Rechenkern ist verloren. Bitte alle Tabs dieser Seite schließen und neu öffnen.",
  },
  MlcLLMConnect: {
    Title: "Mit einem eigenen Server verbinden",
  },
};

export default de;
