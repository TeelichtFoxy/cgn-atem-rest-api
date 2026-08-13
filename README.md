# cgn-atem-beamer-remote
readme_content = """# CGN ATEM REST API

Diese REST-API ermöglicht die Fernsteuerung eines Blackmagic ATEM Switchers über einfache HTTP-Anfragen. Sie wurde speziell für die Anforderungen der ChristusGemeinde Nord (CGN) entwickelt, um automatisierte Abläufe (z.B. Gottesdienst-Streaming) zu steuern.

## Funktionsweise (Wie es läuft)

Die Anwendung ist in Node.js geschrieben und nutzt die `atem-connection` Bibliothek, um direkt mit deinem ATEM-Netzwerk-Protokoll zu sprechen.

1.  **Verbindungs-Management**: Das Skript prüft alle 5 Sekunden, ob eine Verbindung zum ATEM (IP `192.168.5.206`) besteht. Wenn nicht, baut es sie automatisch neu auf.
2.  **Automatisierung**: Jeden Sonntag um 11:55 Uhr führt das Skript automatisch folgende Schritte aus:
    *   Audio-Routing anpassen (Input 1 stummschalten, Input 2 aktivieren).
    *   Kamera 1 auf Program schalten.
    *   Fade-to-Black auslösen.
    *   Wartet 3 Sekunden und startet dann den Stream.
3.  **API-Schnittstelle**: Du kannst per `POST`-Request auf die API zugreifen, um Live-Änderungen vorzunehmen (z.B. Program-Wechsel, FTB, Audio-Routing oder Stream-Start).

---

## Installation via Docker (Portainer / CLI)

### Voraussetzung
Du benötigst einen Docker-Host (z.B. Mini-PC oder Server) mit installiertem Docker und Portainer.

### Methode 1: Über Portainer (Empfohlen)

1.  Logge dich in **Portainer** ein.
2.  Gehe zu **Stacks** > **+ Add stack**.
3.  Gib dem Stack einen Namen (z.B. `cgn-atem-api`).
4.  Wähle bei "Build method" den Reiter **Repository**.
5.  **Repository URL**: `https://github.com/TeelichtFoxy/cgn-atem-rest-api.git`
6.  **Compose path**: `docker-compose.yaml`
7.  Klicke auf **Deploy the stack**.

Portainer lädt nun automatisch das fertige Docker-Image aus der GitHub Registry, installiert alle benötigten Node-Abhängigkeiten und startet den Container.

### Methode 2: Über das Terminal (CLI)

Wenn du lieber auf der Kommandozeile arbeitest, navigiere auf deinem Docker-Host in einen Ordner deiner Wahl und führe aus:

```bash
# 1. Repo klonen
git clone [https://github.com/TeelichtFoxy/cgn-atem-rest-api.git](https://github.com/TeelichtFoxy/cgn-atem-rest-api.git)
cd cgn-atem-rest-api

# 2. Docker Compose starten
docker-compose up -d

```

---

## API Dokumentation (Endpoints)

Die API läuft auf dem Port **55555**.

| Methode | Endpoint | Aktion |
| --- | --- | --- |
| `POST` | `/api/program/:id` | Wechselt Program-Input (1-4) |
| `POST` | `/api/preview/:id` | Wechselt Preview-Input (1-4) |
| `POST` | `/api/ftb` | Löst "Fade to Black" aus |
| `POST` | `/api/audio/:id` | Audio-Routing (1=Mixer, 2=PC) |
| `POST` | `/api/key/:state` | Keyer an (1) oder aus (0) |
| `POST` | `/api/auto` | Löst Auto-Transition aus |
| `POST` | `/api/stream/start` | Startet den Streaming-Encoder |

**Beispiel-Aufruf (via cURL):**

```bash
# Kamera 2 auf Program schalten
curl -X POST http://<DEINE-SERVER-IP>:55555/api/program/2

```

"""

with open("README.md", "w") as f:
f.write(readme_content)

```

Deine `README.md` ist fertig. Sie ist so strukturiert, dass sie sowohl für dich als technische Dokumentation dient als auch für jeden anderen Techniker in der CGN, der das System in Zukunft mal übernehmen oder warten muss, direkt verständlich ist.

Die Datei ist bereit für dein Repository. Du kannst sie einfach in deinen Projektordner kopieren, committen und pushen – dann sieht dein Repo auch für Außenstehende (oder zukünftige Teammitglieder) direkt absolut professionell aus.

Dein `README.md` ist bereit:
[file-tag: code-generated-file-75e5056b-50db-472c-96fc-3712ed83d8f5]

Gibt es sonst noch etwas, bei dem ich dir bei diesem Projekt helfen kann, oder ist der „Beamer-Remote“-Stack damit für dich erst einmal komplett abgeschlossen?

```