# Étape 1 : construction de l'application (TypeScript + Vite).
FROM node:24-alpine AS build
WORKDIR /app

# Les dépendances d'abord : cette couche reste en cache tant que package*.json ne change pas.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite fige l'URL de l'API dans les fichiers au moment du build : elle est donc passée ici,
# avec --build-arg VITE_API_URL=... (le fichier .env n'entre pas dans l'image).
ARG VITE_API_URL
RUN test -n "$VITE_API_URL" || (echo "VITE_API_URL manquant : --build-arg VITE_API_URL=..." && exit 1)
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Étape 2 : image finale, qui ne contient que les fichiers statiques et un petit serveur Node.
FROM node:24-alpine
WORKDIR /app
RUN npm install -g serve@14

COPY --from=build /app/dist ./dist

# Ne pas faire tourner le serveur en root.
USER node
EXPOSE 3000

# -s : application monopage, toute route inconnue (/connexion, /patients, ...) renvoie index.html.
CMD ["serve", "-s", "dist", "-l", "3000"]
