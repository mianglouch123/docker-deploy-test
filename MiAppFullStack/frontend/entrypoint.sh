#!/bin/sh

set -e

# 1. Definimos dónde están los archivos dentro del contenedor
TEMPLATE_FILE="/usr/share/nginx/html/assets/config.template.json"
OUTPUT_FILE="/usr/share/nginx/html/assets/config.json"

# 2. Asignamos la variable (si Docker no la envía, usa localhost por defecto)
export API_URL=${API_URL:-"http://localhost:5000"}

# 3. Ejecutamos envsubst
envsubst '${API_URL}' < "$TEMPLATE_FILE" > "$OUTPUT_FILE"

# 4. Mensaje para los logs
echo "Configuración realizada con API_URL=$API_URL"