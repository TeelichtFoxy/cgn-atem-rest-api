# CGN ATEM REST API

Diese REST-API ermöglicht die Fernsteuerung eines Blackmagic ATEM Mini Pro Switchers über einfache HTTP-Anfragen. Sie wurde speziell für die Anforderungen der ChristusGemeinde Nord (CGN) entwickelt, um automatisierte Abläufe zu steuern.

## Funktionsweise

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
3.  Gib dem Stack einen Namen (z.B. `cgn-atem-rest-api`).
4.  **Repository URL**: `https://github.com/TeelichtFoxy/cgn-atem-rest-api.git`
5.  Gib folgende Konfiguration ein:
```bash
version: '3.8'

services:
  cgn-atem-rest-api:
    image: ghcr.io/teelichtfoxy/cgn-atem-rest-api:main
    container_name: cgn-atem-rest-api
    restart: unless-stopped
    ports:
      - "55555:55555"
    networks:
      - bridge

networks:
  bridge:
    driver: bridge
```
7.  Klicke auf **Deploy the stack**.

Portainer lädt nun automatisch das fertige Docker-Image aus der GitHub Registry, installiert alle benötigten Node-Abhängigkeiten und startet den Container.

### Methode 2: Über das Terminal (CLI)

Wenn du lieber auf der Kommandozeile arbeitest, navigiere auf deinem Docker-Host in einen Ordner deiner Wahl und führe aus:

```bash
# 1. Ordner erstellen und wechseln:
mkdir cgn-atem-rest-api && cd cgn-atem-rest-api

# 2. Aktuelle docker-compose.yaml in den Ordner laden
curl -O https://raw.githubusercontent.com/TeelichtFoxy/cgn-atem-rest-api/main/docker-compose.yaml

# 3. Docker Compose starten
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
