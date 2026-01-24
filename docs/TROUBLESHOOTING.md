# 🔧 Solución de Problemas

Guía completa para diagnosticar y resolver problemas comunes del sistema.

---

## 📋 Índice de Problemas

- [Errores de Autenticación](#errores-de-autenticación)
- [Errores de Conexión](#errores-de-conexión)
- [Errores en Generación de PDFs](#errores-en-generación-de-pdfs)
- [Errores de Email](#errores-de-email)
- [Errores en Google Sheet](#errores-en-google-sheet)
- [Problemas de Performance](#problemas-de-performance)
- [Logs y Debugging](#logs-y-debugging)

---

## 🔐 Errores de Autenticación

### Error: "403 Forbidden" al ejecutar desde Apps Script

**Síntoma:** Aparece error "403 Forbidden" al hacer click en "Generar Certificados"

**Causa más común:** API Key no coincide

**Diagnóstico:**
```javascript
// En Apps Script, verificar:
var apiKey = "TU_CLAVE_AQUI";

// En n8n → Webhook → Credentials → Header Auth
// Value debe ser EXACTAMENTE igual
```

**Solución:**
1. Ir a n8n → Settings → Credentials
2. Buscar credencial "Header Auth"
3. Copiar el "Value" EXACTAMENTE (sin espacios)
4. Pegar en Apps Script en la variable `apiKey`
5. Guardar y probar de nuevo

---

### Error: "Invalid credentials" en nodos de n8n

**Síntoma:** Nodos de Google muestran error rojo con "Invalid credentials"

**Causa:** Credenciales OAuth2 expiradas o mal configuradas

**Solución:**
1. Click en el nodo con error
2. En "Credential to connect with" → Click en el ícono de editar
3. Click en "Reconnect" o "Test connection"
4. Si falla, crear credencial nueva:
   - Settings → Credentials → Add Credential
   - Seleccionar el tipo correspondiente (Google Drive, Sheets, etc.)
   - Ingresar Client ID y Secret de GCP
   - Autorizar

---

### Error: "Access blocked: This app's request is invalid"

**Síntoma:** Al intentar autorizar OAuth aparece pantalla roja de Google

**Causa:** Ámbitos (scopes) no configurados en GCP

**Solución:**
1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. APIs y servicios → Pantalla de consentimiento de OAuth
3. Click en "Editar app"
4. Ámbitos → Agregar o quitar ámbitos
5. Agregar estos ámbitos:
   ```
   https://www.googleapis.com/auth/spreadsheets
   https://www.googleapis.com/auth/drive
   https://www.googleapis.com/auth/presentations
   https://www.googleapis.com/auth/gmail.send
   ```
6. Guardar
7. Volver a n8n y reconectar credenciales

---

## 🌐 Errores de Conexión

### Error: "404 Not Found" al ejecutar desde Apps Script

**Síntoma:** Mensaje "El servidor respondió con error: 404"

**Causa:** URL del webhook incorrecta o workflow desactivado

**Diagnóstico:**
1. Verificar que el workflow esté **activo** en n8n (toggle verde)
2. Verificar URL del webhook

**Solución:**
1. En n8n, abrir el workflow
2. Activar el workflow (toggle en esquina superior derecha)
3. Click en nodo "Webhook"
4. Copiar "Production URL"
5. Pegar en Apps Script:
   ```javascript
   var webhookUrl = "URL_COPIADA_AQUI";
   ```
6. Guardar y probar

---

### Error: "Cannot connect to host" o timeout

**Síntoma:** El script se queda esperando y luego da timeout

**Causa:** Servidor de n8n no accesible o caído

**Diagnóstico:**
```bash
# Desde terminal, probar:
curl -I https://tu-n8n.com/webhook/generar-certificados
```

**Solución:**
1. Verificar que n8n esté corriendo
2. Verificar firewall/networking
3. Si es self-hosted, verificar que el puerto esté abierto
4. Verificar DNS si usás dominio custom

---

### Error: "SSL certificate problem"

**Síntoma:** Error relacionado con certificado SSL

**Causa:** Certificado SSL inválido o autofirmado

**Solución:**
1. Si es producción: renovar certificado SSL (Let's Encrypt, etc.)
2. Si es testing local: usar HTTP en vez de HTTPS (solo para desarrollo)
3. Verificar configuración del reverse proxy (nginx, etc.)

---

## 📄 Errores en Generación de PDFs

### PDFs vacíos o en blanco

**Síntoma:** Se generan PDFs pero están completamente en blanco

**Causa:** Variables mal escritas en la plantilla de Slides

**Diagnóstico:**
1. Abrir plantilla de Google Slides
2. Buscar las variables (ej: `{{NOMBRE_COMPLETO}}`)
3. Verificar que estén EXACTAMENTE como se muestra

**Solución:**
1. Las variables DEBEN tener dobles llaves: `{{ }}`
2. NO pueden tener espacios: `{{ NOMBRE }}` ❌  → `{{NOMBRE}}` ✅
3. Deben estar en mayúsculas
4. Nombres exactos:
   - `{{NOMBRE_COMPLETO}}`
   - `{{NOMBRE_TALLER}}`
   - `{{FECHA_TEXTO}}`
   - `{{NOMBRE_INSTRUCTOR}}`
   - `{{CARGO_INSTRUCTOR}}`

---

### PDF con datos parciales (solo algunos campos)

**Síntoma:** Algunos campos se llenan pero otros no

**Causa:** Nombre de columna no coincide

**Diagnóstico:**
1. Verificar nombres de columnas en Google Sheet
2. Verificar que coincidan EXACTAMENTE con el workflow

**Solución:**
1. Nombres de columnas esperados:
   - `Nombre Estudiante`
   - `Email`
   - `Actividad`
   - `Fecha Actividad`
   - `Nombre Instructor`
   - `Cargo Instructor`
2. No deben tener espacios extra
3. Mayúsculas/minúsculas importan
4. Acentos deben estar correctos

---

### Error: "Presentation not found"

**Síntoma:** Falla en el nodo "Duplicar Plantilla"

**Causa:** ID de plantilla incorrecto o sin permisos

**Solución:**
1. Verificar ID de la plantilla:
   - Abrir presentación en Google Slides
   - Copiar ID de la URL: `presentation/d/[ID_AQUI]/edit`
2. En n8n, nodo "Duplicar Plantilla de Certificado":
   - File → By ID
   - Pegar ID correcto
3. Verificar que la cuenta de n8n tenga acceso a la plantilla

---

### PDFs corruptos o no se abren

**Síntoma:** PDF se descarga pero no se puede abrir

**Causa:** Error en exportación de Google Drive

**Solución:**
1. Verificar que la plantilla se abra correctamente en Slides
2. En nodo "Exportar PDF", verificar opciones:
   ```json
   "googleFileConversion": {
     "conversion": {
       "slidesToFormat": "application/pdf"
     }
   }
   ```
3. Probar descargar manualmente desde Drive para verificar

---

## 📧 Errores de Email

### Emails no se envían

**Síntoma:** Workflow completa pero no llegan emails

**Diagnóstico:**
1. Verificar logs en n8n (Executions)
2. Buscar error en nodo "Enviar Certificado por Email"

**Causas y Soluciones:**

**Causa 1: Credenciales de Gmail incorrectas**
- Solución: Reconectar credencial Gmail OAuth2 en n8n

**Causa 2: Email del destinatario inválido**
- Solución: Verificar formato de emails en Google Sheet
- Debe ser email válido: `usuario@dominio.com`

**Causa 3: Límite de envío de Gmail alcanzado**
- Gmail tiene límite de ~500 emails/día
- Solución: Esperar 24 horas o usar cuenta de Workspace (límite mayor)

---

### Emails van a spam

**Síntoma:** Emails llegan pero van a carpeta de spam

**Solución:**
1. Agregar SPF/DKIM records si usás dominio custom
2. Personalizar más el mensaje (menos automatizado)
3. Pedir a destinatarios que marquen como "No es spam"
4. Usar Gmail Workspace en vez de Gmail gratuito

---

### PDFs no adjuntos en email

**Síntoma:** Email llega pero sin PDF adjunto

**Causa:** Configuración del nodo de Gmail

**Solución:**
1. En nodo "Enviar Certificado por Email"
2. Options → Attachments
3. Verificar que tenga:
   ```json
   "attachmentsUi": {
     "attachmentsBinary": [{}]
   }
   ```
4. Verificar que el nodo anterior (Exportar PDF) genere el binario correctamente

---

## 📊 Errores en Google Sheet

### Error: "Sheet not found"

**Síntoma:** Falla al leer Google Sheet

**Causa:** ID incorrecto o sin permisos

**Solución:**
1. Verificar ID del Sheet:
   - URL: `spreadsheets/d/[ID_AQUI]/edit`
2. En n8n, nodos de Google Sheets:
   - Document → By ID
   - Pegar ID correcto
3. Verificar que la cuenta OAuth tenga acceso al Sheet

---

### No se marcan certificados como "Enviado"

**Síntoma:** El sistema genera certificados pero la columna "Enviado" queda en "NO"

**Causa:** Error en nodo "Marcar como Enviado"

**Diagnóstico:**
1. Ver logs en n8n del nodo "Marcar como Enviado"
2. Verificar que tenga permisos de escritura

**Solución:**
1. Verificar que columna "Email" sea el matching column
2. Verificar que el email en el Sheet coincida exactamente
3. Verificar permisos de la credencial OAuth2

---

### Se procesan certificados ya enviados

**Síntoma:** Se envían certificados duplicados

**Causa:** Filtro no funciona correctamente

**Solución:**
1. En nodo "Leer Lista Certificados", verificar filtros:
   ```json
   "filtersUI": {
     "values": [
       {
         "lookupColumn": "Asistió?",
         "lookupValue": "SI"
       },
       {
         "lookupColumn": "Enviado",
         "lookupValue": "NO"
       }
     ]
   }
   ```
2. Verificar que los valores en Sheet sean EXACTAMENTE "SI" y "NO" (mayúsculas)

---

## ⚡ Problemas de Performance

### Sistema muy lento al generar muchos certificados

**Síntoma:** Procesar 50+ certificados toma mucho tiempo

**Causa:** Rate limiting de Google APIs

**Solución (ya implementada):**
- El nodo "Esperar 5 Segundos" ya maneja esto
- Para acelerar: reducir a 2-3 segundos
- Para mayor volumen: aumentar a 10 segundos

**Optimización adicional:**
```javascript
// En nodo "Esperar X Segundos", cambiar:
"amount": 2  // En vez de 5
```

---

### Error: "Quota exceeded" de Google

**Síntoma:** Falla con mensaje de quota excedida

**Causa:** Demasiadas llamadas a API en poco tiempo

**Solución:**
1. Aumentar tiempo de espera entre certificados
2. Dividir en lotes más pequeños
3. Esperar 1 hora antes de continuar
4. Revisar quotas en GCP Console

---

### Workflow se detiene a mitad de proceso

**Síntoma:** Procesa algunos certificados y se detiene

**Causa:** Error en un certificado específico

**Diagnóstico:**
1. Ver logs de executions en n8n
2. Identificar en qué certificado falló
3. Revisar datos de ese registro

**Solución:**
1. Corregir datos problemáticos en Sheet
2. Marcar certificados procesados como "Enviado = SI"
3. Re-ejecutar workflow

---

## 🐛 Logs y Debugging

### Cómo ver logs en n8n

1. n8n → Executions (menú lateral)
2. Click en la ejecución específica
3. Ver cada nodo:
   - Verde: OK
   - Rojo: Error
4. Click en nodo rojo para ver detalles del error

---

### Cómo ver logs en Apps Script

1. Apps Script → Ver → Registros (Logs)
2. O usar `Logger.log("mensaje")` en el código
3. Ejecutar función y ver output

---

### Debugging paso a paso en n8n

1. Desactivar workflow (toggle)
2. Click en **"Execute Workflow"** (botón manual)
3. Ver resultado de cada nodo
4. Identificar dónde falla
5. Corregir y probar de nuevo

---

### Test de componentes individuales

**Test 1: Webhook**
```bash
curl -X POST \
  -H "x-api-key: TU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"test": true}' \
  https://tu-n8n.com/webhook/generar-certificados
```

**Test 2: Google Sheets**
- En n8n, ejecutar solo nodo "Leer Lista Certificados"
- Verificar que traiga datos

**Test 3: Google Slides**
- Duplicar plantilla manualmente
- Verificar que las variables se reemplacen

---

## 📞 Soporte Adicional

Si ninguna de estas soluciones funciona:

1. **Revisar documentación oficial:**
   - [n8n Docs](https://docs.n8n.io)
   - [Google Workspace API Docs](https://developers.google.com/workspace)

2. **Verificar Issues en GitHub:**
   - Buscar si alguien ya reportó el problema

3. **Crear Issue nuevo:**
   - Incluir logs completos
   - Pasos para reproducir
   - Screenshots si es posible

---

## ✅ Checklist de Diagnóstico Rápido

Cuando algo falla, revisar en orden:

- [ ] ¿El workflow está activo?
- [ ] ¿Las credenciales están conectadas?
- [ ] ¿Los IDs son correctos? (Sheet, Slides, Drive)
- [ ] ¿La API key coincide?
- [ ] ¿Hay datos en el Sheet con filtros correctos?
- [ ] ¿Las variables en Slides están bien escritas?
- [ ] ¿Los logs muestran algún error específico?

---

**La mayoría de problemas se resuelven verificando estos puntos básicos.** 🎯
