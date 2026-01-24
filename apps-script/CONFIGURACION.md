# 🔧 Guía de Configuración

Este documento explica todos los valores que necesitás configurar para que el sistema funcione.

---

## 📋 Valores Removidos del JSON (por seguridad)

Los siguientes valores fueron reemplazados por placeholders y deben ser configurados:

### 🔑 Credenciales de n8n

Todos los nodos tienen credenciales que referencian a IDs genéricos. Deberás configurar estas credenciales en tu instancia de n8n:

#### Credential IDs Removidos:

| Servicio | ID Original (removido) | Placeholder en JSON | Nombre sugerido |
|----------|------------------------|---------------------|-----------------|
| Google Drive | `EnGMhuFovJWLsTsK` | `GOOGLE_DRIVE_CREDENTIALS_ID` | "Google Drive OAuth2" |
| Google Sheets | `STadpRCcyiEIkgPW` | `GOOGLE_SHEETS_CREDENTIALS_ID` | "Google Sheets OAuth2" |
| Google Slides | `0uiP8bGXh7zSnWmo` | `GOOGLE_SLIDES_CREDENTIALS_ID` | "Google Slides OAuth2" |
| Gmail | `rg1npUcxtABpTRVv` | `GMAIL_CREDENTIALS_ID` | "Gmail OAuth2" |
| Webhook Auth | `iAa3wqNaRqOFtH2A` | `WEBHOOK_HEADER_AUTH_ID` | "Header Auth" |

**Acción requerida:**
1. En n8n: **Settings → Credentials → Add Credential**
2. Crear cada credencial OAuth2 necesaria
3. El JSON usará automáticamente las credenciales que crees

---

### 📄 IDs de Google Workspace

Los siguientes IDs fueron reemplazados:

#### Google Sheet

| Campo | ID Original (removido) | Placeholder | Cómo obtenerlo |
|-------|------------------------|-------------|----------------|
| Sheet ID | `1tE8i6ZSx9JIJI0dC7WpGIJKuLnF3YpO3eK7fbT1QkGs` | `YOUR_GOOGLE_SHEET_ID` | URL del sheet: `docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit` |

#### Google Slides (Plantilla)

| Campo | ID Original (removido) | Placeholder | Cómo obtenerlo |
|-------|------------------------|-------------|----------------|
| Template ID | `1Ic9TzyXa_Ip-wMMcPwy_nd0geCE7Uy_21P7wSLzpn3k` | `YOUR_TEMPLATE_SLIDE_ID` | URL de la presentación: `docs.google.com/presentation/d/[ESTE_ES_EL_ID]/edit` |

#### Google Drive (Carpeta de Destino)

| Campo | ID Original (removido) | Placeholder | Cómo obtenerlo |
|-------|------------------------|-------------|----------------|
| Folder ID | `183hxN6mQ472qIym7r56o2xAbaf1XPl5j` | `YOUR_DRIVE_FOLDER_ID` | URL de la carpeta: `drive.google.com/drive/folders/[ESTE_ES_EL_ID]` |

---

### 🌐 Webhook

#### URL del Webhook

**Removido:** `https://n8n.somoslibresuba.com/webhook/generar-certificados`

**Acción requerida:**
1. En n8n, activar el workflow
2. Copiar la URL del webhook (aparece en el nodo "Webhook")
3. Reemplazar en Apps Script:
   ```javascript
   var webhookUrl = "TU_URL_AQUI";
   ```

#### API Key / Header Auth

**Removido por seguridad**

**Acción requerida:**
1. En n8n: nodo "Webhook" → Credential
2. Crear "Header Auth" credential:
   - Header Name: `x-api-key`
   - Value: `[TU_CLAVE_SECRETA_AQUI]` (generá una contraseña fuerte)
3. Copiar la MISMA clave en Apps Script:
   ```javascript
   var apiKey = "TU_CLAVE_SECRETA_AQUI";
   ```

---

## 🎯 Checklist de Configuración

### Paso 1: Configurar n8n

- [ ] Importar JSON del workflow
- [ ] Crear credenciales OAuth2 para:
  - [ ] Google Drive
  - [ ] Google Sheets
  - [ ] Google Slides
  - [ ] Gmail
- [ ] Configurar Header Auth para webhook
- [ ] Asignar credenciales a cada nodo
- [ ] Activar workflow
- [ ] Copiar URL del webhook

### Paso 2: Preparar Google Workspace

- [ ] Crear Google Sheet con estructura correcta
- [ ] Crear plantilla en Google Slides con variables
- [ ] Crear carpeta en Drive para PDFs
- [ ] Copiar IDs de cada recurso

### Paso 3: Actualizar IDs en n8n

En cada nodo que lo requiera, reemplazar:

**Nodo "Leer Lista Certificados":**
- [ ] `documentId` → ID de tu Google Sheet

**Nodo "Duplicar Plantilla de Certificado":**
- [ ] `fileId` → ID de tu plantilla de Slides
- [ ] `folderId` → ID de tu carpeta de Drive

**Nodo "Marcar como Enviado":**
- [ ] `documentId` → ID de tu Google Sheet

**Nodo "Guardar en Drive":**
- [ ] `folderId` → ID de tu carpeta de Drive

### Paso 4: Configurar Apps Script

- [ ] Copiar código en Google Sheet → Extensions → Apps Script
- [ ] Reemplazar `webhookUrl`
- [ ] Reemplazar `apiKey`
- [ ] Guardar como "Generar Certificados"
- [ ] Ejecutar `onOpen()` manualmente la primera vez
- [ ] Autorizar permisos

### Paso 5: Verificación

- [ ] Ejecutar `testConexion()` en Apps Script
- [ ] Verificar que aparece el menú "🎓 Certificados"
- [ ] Hacer test con 1-2 registros
- [ ] Verificar que se envían emails
- [ ] Verificar que se guardan PDFs en Drive
- [ ] Verificar que se marca "Enviado = SI"

---

## 🔐 Información Removida del Apps Script

### URLs y Claves

**Removido:**
```javascript
var webhookUrl = "https://n8n.somoslibresuba.com/webhook/generar-certificados";
var apiKey = "[CLAVE_PRIVADA]";
```

**Debe reemplazarse por:**
```javascript
var webhookUrl = "TU_URL_DE_N8N_AQUI";
var apiKey = "TU_CLAVE_SECRETA_AQUI";
```

---

## 🛡️ Seguridad

### ⚠️ NUNCA COMMITEAR:

- ❌ API Keys
- ❌ OAuth Client Secrets
- ❌ Tokens de acceso
- ❌ IDs de recursos privados (opcional)
- ❌ URLs de producción con claves embebidas

### ✅ Buenas Prácticas:

- ✅ Usar variables de entorno
- ✅ .gitignore configurado
- ✅ Credenciales en n8n (no en JSON)
- ✅ Rotar API keys periódicamente
- ✅ Usar OAuth2 en vez de API keys cuando sea posible

---

## 📝 Notas Adicionales

### Webhook ID

**Removido:** `webhookId: "b9f80c65-d787-467e-a099-ba5a1e9b4b96"`

Este ID se genera automáticamente cuando importás el workflow en n8n. No necesitás configurarlo manualmente.

### Instance ID

**Removido:** `instanceId: "42a51fe85188c9d9a9a5099c0d58d015b9e739750d2c39e02b59fc3da241a13a"`

Es único de cada instancia de n8n. Se genera automáticamente.

### Workflow ID

**Removido:** `id: "nnysba6mgGmROmVu"`

n8n asigna un nuevo ID cuando importás el workflow.

---

## 🆘 Soporte

Si tenés problemas con la configuración:

1. Verificar que todas las credenciales estén correctamente creadas
2. Revisar los logs en n8n (Executions → Ver detalles)
3. Ejecutar `testConexion()` en Apps Script
4. Verificar permisos en Google Cloud Platform

---

## 📚 Referencias

- [n8n Credentials](https://docs.n8n.io/credentials/)
- [Google OAuth2 Setup](https://console.cloud.google.com/)
- [Apps Script Authorization](https://developers.google.com/apps-script/guides/services/authorization)

---

**⚡ Una vez configurado todo, el sistema estará listo para generar certificados!**
