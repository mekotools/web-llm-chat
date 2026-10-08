# MekoTools — Sprachmodell im Browser (mlc-ai/web-llm-chat, WebGPU)
#
# Vier Stufen:
#   1) bau      — Vorlage in fester Fassung klonen, deutsche Sprachdatei und
#                 Anpassungen einspielen (Ankerpruefung bricht bei Aenderungen
#                 der Vorlage ab), Anwendung bauen
#   2) rechenkern — den Rechenkern (4,8 MB) von amtlicher Quelle holen und gegen
#                 mitgelieferte Pruefsummen pruefen. Die Gewichte kommen hier
#                 NICHT mehr mit: sie sind 276 MB und werden vom VPS ausgeliefert
#                 (Repo mekotools-modelle holt sie ueber modelle/holen.sh).
#   3) dienst   — ausliefern. Rechenkern und Gewichte liegen unter derselben
#                 Adresse wie die Seite; die Kopfzeile connect-src 'self'
#                 verbietet Fremdaufrufe zur Laufzeit.
#
# Gerechnet wird im Browser des Geraets (WebGPU). Die Gewichte werden einmal
# geladen und bleiben im Browserspeicher.

FROM node:20-alpine AS bau
ARG VORLAGE_STAND=223895cb1be677504cf26904df5e3b0b451ba992
RUN apk add --no-cache git libc6-compat
WORKDIR /app
RUN git clone --quiet https://github.com/mlc-ai/web-llm-chat.git . \
 && git checkout --quiet "${VORLAGE_STAND}" \
 && git log --oneline -1
COPY sprachdatei ./sprachdatei
COPY patches ./patches
# Anpassungen: deutsche Oberflaeche, Modelle aus eigener Quelle, Hinweis bei
# fehlendem WebGPU, Kopfzeile gegen Fremdaufrufe.
RUN node patches/anpassen.mjs \
 && rm -rf .git
RUN npx --yes yarn@1.22.22 install --frozen-lockfile --network-timeout 600000
RUN BUILD_MODE=standalone npx --yes yarn@1.22.22 build

FROM alpine:3.20 AS rechenkern
ARG RECHENKERN_BASIS=https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_80
ARG RECHENKERN=Qwen2-0.5B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm
RUN apk add --no-cache curl coreutils
COPY modelle /tmp/modelle
# Nur der Rechenkern wird mitgebaut. Die Gewichte holt der VPS ueber
# modelle/holen.sh vom amtlichen Release und prueft sie dort gegen dieselbe
# Pruefsummenliste — ein Bild auf dem Heimanschluss muss nichts vorhalten, was
# es gar nicht ausliefert.
RUN mkdir -p /rechenkern \
 && curl -fSL --retry 3 --retry-delay 2 -o "/rechenkern/${RECHENKERN}" \
      "${RECHENKERN_BASIS}/${RECHENKERN}" \
 && cd /rechenkern \
 && sha256sum -c /tmp/modelle/sha256sums-rechenkern.txt \
 && du -sh /rechenkern

FROM node:20-alpine AS dienst
# Anker zum Spiegel-Repo: ueber diesen Aufkleber verknuepft GitHub das Paket in
# GHCR mit dem Repo — erst dadurch laesst es sich oeffentlich stellen.
LABEL org.opencontainers.image.source="https://github.com/mekotools/web-llm-chat" \
      org.opencontainers.image.title="MekoTools Sprachmodell" \
      org.opencontainers.image.description="Sprachmodell im Browser (WebGPU, deutsche Oberflaeche, Gewichte von eigener Adresse)"
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=bau /app/public ./public
COPY --from=bau /app/.next/standalone ./
COPY --from=bau /app/.next/static ./.next/static
# Die Bibliothek holt die Gewichte unter <Modelladresse>/resolve/main/ ab
# (siehe @mlc-ai/web-llm). Dort liegen sie — ausgeliefert vom VPS, nicht aus
# diesem Bild. Der Rechenkern kommt weiterhin von hier.
COPY --from=rechenkern /rechenkern ./public/wasm
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO /dev/null http://127.0.0.1:3000/ || exit 1
EXPOSE 3000
CMD ["node", "server.js"]
