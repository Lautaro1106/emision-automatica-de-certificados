# 📦 Guía de Instalación Paso a Paso

Esta guía te llevará desde cero hasta tener el sistema completamente funcional.

---

## ⏱️ Tiempo Estimado

- **Primera instalación:** 45-60 minutos
- **Instalaciones posteriores:** 15-20 minutos

---

## 📋 Prerequisitos

Antes de comenzar, asegurate de tener:

- [ ] Cuenta de Google (Gmail o Workspace)
- [ ] Acceso a Google Cloud Platform
- [ ] Instancia de n8n funcionando (self-hosted o cloud)
- [ ] Conocimientos básicos de:
  - Google Sheets
  - n8n (o willingness to learn!)
  - Apps Script (nivel básico)

---

## 🚀 Instalación Completa

### FASE 1: Configurar Google Cloud Platform

#### 1.1 Crear Proyecto en GCP

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Click en el selector de proyectos (arriba a la izquierda)
3. Click en **"Nuevo Proyecto"**
4. Nombre: `Certificados Automaticos` (o el que prefieras)
5. Click en **"Crear"**
6. Esperar a que se cree el proyecto

#### 1.2 Habilitar APIs Necesarias

1. En el menú lateral: **APIs y servicios → Biblioteca**
2. Buscar y habilitar las siguientes APIs:
   - ✅ **Google Sheets API**
   - ✅ **Google Slides API**
   - ✅ **Google Drive API**
   - ✅ **Gmail API**

Para cada una:
- Buscar el nombre
- Click en la API
- Click en **"Habilitar"**
- Esperar confirmación

#### 1.3 Crear Credenciales OAuth 2.0

1. **APIs y servicios → Credenciales**
2. Click en **"Crear credenciales" → "ID de cliente de OAuth 2.0"**
3. Si es la primera vez, configurar pantalla de consentimiento:
   - Tipo de usuario: **Externo**
   - Nombre de la app: `Sistema Certificados`
   - Email de asistencia: tu email
   - Logo: opcional
   - Ámbitos: no agregar nada aún
   - Guardar

4. Volver a **Credenciales → Crear credenciales → ID de cliente OAuth 2.0**
5. Tipo de aplicación: **Aplicación web**
6. Nombre: `n8n Integration`
7. URIs de redirección autorizados:
   ```
   https://TU-INSTANCIA-N8N.com/rest/oauth2-credential/callback
   ```
   (Reemplazar con tu URL de n8n)
8. Click en **"Crear"**
9. **IMPORTANTE:** Copiar y guardar:
   - ID de cliente
   - Secreto de cliente

#### 1.4 Configurar Ámbitos OAuth

1. **APIs y servicios → Pantalla de consentimiento de OAuth**
2. **Ámbitos → Agregar o quitar ámbitos**
3. Agregar estos ámbitos:
   ```
   https://www.googleapis.com/auth/spreadsheets
   https://www.googleapis.com/auth/drive
   https://www.googleapis.com/auth/presentations
   https://www.googleapis.com/auth/gmail.send
   ```
4. Guardar y continuar

---

### FASE 2: Preparar Google Workspace

#### 2.1 Crear Google Sheet

1. Ir a [Google Sheets](https://sheets.google.com)
2. Crear nueva hoja de cálculo
3. Nombre: `Lista Certificados`
4. Crear estas columnas en la primera fila:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Nombre Estudiante | Email | Actividad | Fecha Actividad | Nombre Instructor | Cargo Instructor | ID Firma | Asistió? | Enviado |

5. Formato de datos esperado:
   - **Nombre Estudiante:** Texto libre
   - **Email:** email válido
   - **Actividad:** Texto libre
   - **Fecha Actividad:** Texto (formato: DD/MM/YYYY)
   - **Nombre Instructor:** Texto libre
   - **Cargo Instructor:** Texto libre
   - **ID Firma:** Texto (futuro uso)
   - **Asistió?:** `SI` o `NO`
   - **Enviado:** `SI` o `NO`

6. **Copiar ID del Sheet:**
   - Desde la URL: `docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit`
   - Guardar en un archivo de texto temporal

#### 2.2 Crear Plantilla de Certificado

1. Ir a [Google Slides](https://slides.google.com)
2. Crear nueva presentación
3. Nombre: `Plantilla Certificado`
4. Diseñar certificado con estas **variables de texto**:
   - `{{NOMBRE_COMPLETO}}` - donde va el nombre del estudiante
   - `{{NOMBRE_TALLER}}` - donde va el nombre de la actividad
   - `{{FECHA_TEXTO}}` - donde va la fecha
   - `{{NOMBRE_INSTRUCTOR}}` - donde va el nombre del instructor
   - `{{CARGO_INSTRUCTOR}}` - donde va el cargo

   **Importante:** Escribir EXACTAMENTE con llaves dobles `{{ }}`

5. Agregar logos, diseño, colores
6. **Copiar ID de la Presentación:**
   - Desde la URL: `docs.google.com/presentation/d/[ESTE_ES_EL_ID]/edit`
   - Guardar en archivo de texto

#### 2.3 Crear Carpeta de Destino en Drive

1. Ir a [Google Drive](https://drive.google.com)
2. Crear nueva carpeta
3. Nombre: `Certificados Generados`
4. **Copiar ID de la Carpeta:**
   - Abrir la carpeta
   - Desde la URL: `drive.google.com/drive/folders/[ESTE_ES_EL_ID]`
   - Guardar en archivo de texto

---

### FASE 3: Configurar n8n

#### 3.1 Crear Credenciales OAuth2 en n8n

Para **cada servicio** de Google (Drive, Sheets, Slides, Gmail):

1. En n8n: **Settings → Credentials → Add Credential**
2. Buscar el servicio (ej: "Google Sheets OAuth2 API")
3. Completar:
   - **Client ID:** (el que copiaste de GCP)
   - **Client Secret:** (el que copiaste de GCP)
4. Click en **"Connect my account"**
5. Autorizar en ventana de Google
6. Guardar credencial con nombre descriptivo:
   - "Google Drive OAuth2"
   - "Google Sheets OAuth2"
   - "Google Slides OAuth2"
   - "Gmail OAuth2"

#### 3.2 Crear Credencial de Header Auth

1. **Settings → Credentials → Add Credential**
2. Buscar: **"Header Auth"**
3. Configurar:
   - **Name:** Webhook Auth - Certificados
   - **Header Name:** `x-api-key`
   - **Value:** `[GENERAR_UNA_CONTRASEÑA_FUERTE_AQUI]`
   
   Ejemplo de contraseña fuerte:
   ```
   Cert2025!SecureKey#XyZ789
   ```
   
4. **COPIAR Y GUARDAR** esta contraseña (la necesitarás en Apps Script)
5. Guardar credencial

#### 3.3 Importar Workflow

1. En n8n: **Workflows → Add Workflow → Import from File**
2. Copiar todo el contenido de `workflows/Certificados_Automaticos.json`
3. Pegar en el campo de texto
4. Click en **"Import"**
5. El workflow aparecerá pero con errores (es normal)

#### 3.4 Configurar Credenciales en Nodos

Para **cada nodo** que lo requiera:

**Nodos de Google Drive:**
- Duplicar Plantilla de Certificado
- Exportar PDF
- Guardar en Drive
- Eliminar Archivo Temporal

Acción:
1. Click en el nodo
2. En **"Credential to connect with"**
3. Seleccionar: **"Google Drive OAuth2"**

**Nodos de Google Sheets:**
- Leer Lista Certificados
- Marcar como Enviado

Acción:
1. Click en el nodo
2. Seleccionar: **"Google Sheets OAuth2"**

**Nodo de Google Slides:**
- Reemplazar Datos en Plantilla

Acción:
1. Click en el nodo
2. Seleccionar: **"Google Slides OAuth2"**

**Nodo de Gmail:**
- Enviar Certificado por Email

Acción:
1. Click en el nodo
2. Seleccionar: **"Gmail OAuth2"**

**Nodo Webhook:**

Acción:
1. Click en el nodo "Webhook"
2. En **"Credential for Header Auth"**
3. Seleccionar: **"Webhook Auth - Certificados"**

#### 3.5 Actualizar IDs de Recursos

**Nodo "Leer Lista Certificados":**
1. Click en el nodo
2. En **"Document"** → Mode: "By ID"
3. Pegar ID del Google Sheet

**Nodo "Duplicar Plantilla de Certificado":**
1. Click en el nodo
2. En **"File"** → Mode: "By ID"
3. Pegar ID de la plantilla de Slides
4. En **"Folder"** → Mode: "By ID"
5. Pegar ID de la carpeta de Drive

**Nodo "Marcar como Enviado":**
1. Click en el nodo
2. En **"Document"** → Mode: "By ID"
3. Pegar ID del Google Sheet

**Nodo "Guardar en Drive":**
1. Click en el nodo
2. En **"Folder"** → Mode: "By ID"
3. Pegar ID de la carpeta de Drive

#### 3.6 Activar Workflow

1. Click en el toggle en la esquina superior derecha
2. El workflow cambiará a **"Active"**
3. Click en el nodo **"Webhook"**
4. **COPIAR LA URL** que aparece (Production URL)
   - Ejemplo: `https://n8n.tu-dominio.com/webhook/generar-certificados`
5. Guardar esta URL

---

### FASE 4: Configurar Apps Script

#### 4.1 Abrir Editor de Apps Script

1. Abrir el Google Sheet que creaste
2. Menú: **Extensiones → Apps Script**
3. Se abre el editor en nueva pestaña
4. Borrar el código de ejemplo

#### 4.2 Copiar Código

1. Abrir `apps-script/enviarCertificados.gs`
2. Copiar TODO el código
3. Pegar en el editor de Apps Script

#### 4.3 Configurar Variables

Buscar estas líneas:

```javascript
var webhookUrl = "YOUR_N8N_WEBHOOK_URL";
var apiKey = "YOUR_API_KEY_HERE";
```

Reemplazar por:

```javascript
var webhookUrl = "https://n8n.tu-dominio.com/webhook/generar-certificados"; // URL que copiaste
var apiKey = "Cert2025!SecureKey#XyZ789"; // La contraseña que creaste en n8n
```

#### 4.4 Guardar y Nombrar

1. Click en **"Sin título"** (arriba)
2. Cambiar nombre a: `Generar Certificados`
3. Click en **💾 Guardar**

#### 4.5 Autorizar Permisos (Primera vez)

1. Seleccionar función: `onOpen`
2. Click en **▶️ Ejecutar**
3. Aparecerá popup de autorización:
   - "Este proyecto quiere acceder a..."
   - Click en **"Revisar permisos"**
4. Seleccionar tu cuenta de Google
5. Click en **"Avanzado"**
6. Click en **"Ir a Generar Certificados (no seguro)"**
7. Click en **"Permitir"**

#### 4.6 Verificar Menú

1. Volver al Google Sheet
2. Refrescar la página (F5)
3. Debe aparecer nuevo menú: **🎓 Certificados**
4. Si no aparece, ejecutar `onOpen()` de nuevo en Apps Script

---

### FASE 5: Testing

#### 5.1 Test de Conexión

1. Ir a Apps Script
2. Seleccionar función: `testConexion`
3. Click en **▶️ Ejecutar**
4. Ver logs: **Ver → Registros**
5. Debe decir: `✅ Test exitoso! Código: 200`

Si falla:
- Verificar URL del webhook
- Verificar API key
- Verificar que workflow esté activo en n8n

#### 5.2 Test con Datos Reales

1. En Google Sheet, agregar 1 fila de prueba:

| Nombre Estudiante | Email | Actividad | Fecha Actividad | Nombre Instructor | Cargo Instructor | ID Firma | Asistió? | Enviado |
|-------------------|-------|-----------|-----------------|-------------------|------------------|----------|----------|---------|
| Juan Test | tu-email@gmail.com | Prueba Sistema | 24/01/2026 | María López | Instructora | TEST001 | SI | NO |

2. En el Sheet: **🎓 Certificados → Generar y Enviar**
3. Confirmar en el diálogo
4. Esperar mensaje de éxito
5. Verificar:
   - [ ] Email recibido con PDF
   - [ ] PDF en carpeta de Drive
   - [ ] Columna "Enviado" = "SI"

---

## ✅ Checklist Final de Instalación

### Google Cloud Platform
- [ ] Proyecto creado
- [ ] APIs habilitadas (Sheets, Slides, Drive, Gmail)
- [ ] Credenciales OAuth2 creadas
- [ ] Client ID y Secret copiados
- [ ] Ámbitos configurados

### Google Workspace
- [ ] Google Sheet creado con columnas correctas
- [ ] Plantilla de Slides creada con variables
- [ ] Carpeta de Drive creada
- [ ] IDs de todos los recursos copiados

### n8n
- [ ] Credenciales OAuth2 configuradas para cada servicio
- [ ] Credencial Header Auth creada
- [ ] Workflow importado
- [ ] Credenciales asignadas a nodos
- [ ] IDs de recursos actualizados
- [ ] Workflow activado
- [ ] URL del webhook copiada

### Apps Script
- [ ] Código copiado
- [ ] Variables configuradas (webhookUrl, apiKey)
- [ ] Permisos autorizados
- [ ] Menú visible en Sheet
- [ ] Test de conexión exitoso

### Testing
- [ ] Test de conexión: OK
- [ ] Test con 1 registro: OK
- [ ] Email recibido: OK
- [ ] PDF generado: OK
- [ ] Estado actualizado: OK

---

## 🐛 Troubleshooting

### Error: "403 Forbidden" en test

**Causa:** API Key incorrecta

**Solución:**
1. Verificar que el `apiKey` en Apps Script sea EXACTAMENTE igual al "Value" en la credencial "Header Auth" de n8n
2. No debe haber espacios extra
3. Case-sensitive (mayúsculas/minúsculas importan)

### Error: "404 Not Found"

**Causa:** URL del webhook incorrecta

**Solución:**
1. Verificar que el workflow esté **activo** en n8n
2. Copiar nuevamente la URL del nodo Webhook
3. Verificar que no haya espacios extra al pegar

### No aparece el menú en Google Sheet

**Solución:**
1. Ir a Apps Script
2. Ejecutar función `onOpen` manualmente
3. Refrescar el Sheet (F5)
4. Si persiste: cerrar y volver a abrir el Sheet

### Error de permisos en OAuth

**Solución:**
1. Verificar que TODAS las APIs estén habilitadas en GCP
2. Verificar que los ámbitos estén correctamente configurados
3. En n8n, reconectar las credenciales OAuth2
4. Hacer "Reconnect" en cada credencial

### PDF vacío o sin personalización

**Causa:** Variables mal escritas en la plantilla

**Solución:**
1. Abrir plantilla de Slides
2. Verificar que las variables estén EXACTAMENTE así:
   - `{{NOMBRE_COMPLETO}}`
   - `{{NOMBRE_TALLER}}`
   - Etc.
3. NO usar espacios dentro de las llaves
4. Usar dobles llaves {{ }}

---

## 🎉 ¡Instalación Completa!

Si llegaste hasta acá y todos los tests pasaron, **¡felicitaciones!** 

El sistema está listo para generar certificados automáticamente.

---

## 📚 Próximos Pasos

- Lee `docs/TROUBLESHOOTING.md` para problemas comunes
- Lee `docs/ARQUITECTURA.md` para entender cómo funciona
- Personaliza la plantilla de certificado
- Personaliza el template del email

---

**¿Problemas con la instalación?** Verificá primero `TROUBLESHOOTING.md`
