# 🏗️ Arquitectura del Sistema

Documentación técnica sobre el diseño, decisiones de arquitectura y flujo de datos del sistema.

---

## 📋 Índice

- [Visión General](#visión-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura de Componentes](#arquitectura-de-componentes)
- [Flujo de Datos](#flujo-de-datos)
- [Decisiones de Diseño](#decisiones-de-diseño)
- [Optimizaciones](#optimizaciones)
- [Escalabilidad](#escalabilidad)

---

## 🎯 Visión General

### Problema

La organización necesitaba generar más de 100 certificados educativos mensuales de forma manual, enfrentando:
- Alto costo operativo (horas de trabajo manual)
- Errores humanos en nombres, fechas, etc.
- Inconsistencias en diseño
- Proceso no escalable
- Falta de trazabilidad

### Solución

Sistema automatizado end-to-end que:
1. Lee datos de asistentes desde Google Sheets
2. Genera certificados personalizados en PDF
3. Envía por email automáticamente
4. Almacena PDFs organizadamente
5. Registra trazabilidad completa

### Constraints (Restricciones)

- **Presupuesto:** $0 - debe operar 100% en planes gratuitos
- **Skills del equipo:** No-code/low-code preferido sobre código custom
- **Infraestructura:** Aprovechar Google Workspace existente
- **Tiempo de implementación:** 1-2 semanas

---

## 🛠️ Stack Tecnológico

### Componentes Principales

```
┌─────────────────────────────────────────────┐
│          Google Workspace                   │
│  • Sheets (Base de datos)                   │
│  • Slides (Plantillas)                      │
│  • Drive (Almacenamiento)                   │
│  • Gmail (Envío)                            │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│       Google Cloud Platform                 │
│  • OAuth 2.0 (Autenticación)                │
│  • APIs (Sheets, Slides, Drive, Gmail)      │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│              n8n Workflow                   │
│  • Orchestration (Orquestación)             │
│  • Business Logic (Lógica de negocio)       │
│  • Error Handling (Manejo de errores)       │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│          Google Apps Script                 │
│  • UI Trigger (Botón manual)                │
│  • Webhook Caller (Llamada a n8n)           │
└─────────────────────────────────────────────┘
```

### Tecnologías por Capa

| Capa | Tecnología | Rol |
|------|-----------|-----|
| **Presentación** | Google Apps Script | Interfaz de usuario (botón) |
| **Orchestration** | n8n | Orquestación de flujos |
| **APIs** | Google Cloud Platform | Integración con servicios |
| **Data Storage** | Google Sheets | Base de datos |
| **Template Engine** | Google Slides | Generación de documentos |
| **File Storage** | Google Drive | Almacenamiento persistente |
| **Email Delivery** | Gmail API | Envío de emails |

---

## 🏛️ Arquitectura de Componentes

### Diagrama de Arquitectura

```
┌────────────────────────────────────────────────────────────┐
│                        USER LAYER                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Google Sheets UI                                   │   │
│  │  • Menú: "🎓 Certificados → Generar y Enviar"      │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↓                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Apps Script: enviarCertificados()                  │   │
│  │  • Confirmación de usuario                          │   │
│  │  • Autenticación (API Key)                          │   │
│  │  • HTTP POST → Webhook                              │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌────────────────────────────────────────────────────────────┐
│                    ORCHESTRATION LAYER                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  n8n Workflow: "Certificados Automaticos"          │   │
│  │                                                      │   │
│  │  [1] Webhook Trigger                                │   │
│  │       ↓                                              │   │
│  │  [2] Leer Google Sheets (filtrado)                 │   │
│  │       ↓                                              │   │
│  │  [3] Loop Over Items (procesamiento batch)         │   │
│  │       ↓                                              │   │
│  │  [4] Duplicar Plantilla Slides                     │   │
│  │       ↓                                              │   │
│  │  [5] Reemplazar Variables                          │   │
│  │       ↓                                              │   │
│  │  [6] Exportar a PDF                                │   │
│  │       ↓                                              │   │
│  │  [7] Enviar Email + Guardar Drive                  │   │
│  │       ↓                                              │   │
│  │  [8] Eliminar Temporal                             │   │
│  │       ↓                                              │   │
│  │  [9] Marcar como Enviado                           │   │
│  │       ↓                                              │   │
│  │  [10] Wait 5s → Next Item                          │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
                            ↓ OAuth 2.0
┌────────────────────────────────────────────────────────────┐
│                    GOOGLE CLOUD LAYER                       │
│  ┌──────────────┬──────────────┬──────────────┬─────────┐  │
│  │ Sheets API   │ Slides API   │ Drive API    │ Gmail   │  │
│  │ • Read       │ • Duplicate  │ • Upload     │ API     │  │
│  │ • Update     │ • Replace    │ • Delete     │ • Send  │  │
│  └──────────────┴──────────────┴──────────────┴─────────┘  │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│  ┌─────────────┬─────────────┬─────────────┬────────────┐  │
│  │ Sheets DB   │ Slide       │ Drive       │ Gmail      │  │
│  │ (State)     │ Templates   │ Storage     │ Delivery   │  │
│  └─────────────┴─────────────┴─────────────┴────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Responsabilidades por Componente

#### 1. Apps Script (UI Layer)
- **Responsabilidad:** Interfaz de usuario y trigger manual
- **Funciones:**
  - Mostrar menú en Google Sheets
  - Validar intención del usuario
  - Autenticar request (API Key)
  - Llamar webhook de n8n
  - Mostrar resultado al usuario

#### 2. n8n Workflow (Orchestration Layer)
- **Responsabilidad:** Orquestación y lógica de negocio
- **Funciones:**
  - Recibir trigger vía webhook
  - Filtrar y leer datos de Google Sheets
  - Coordinar llamadas a APIs de Google
  - Manejar errores y reintentos
  - Implementar rate limiting
  - Actualizar estado en base de datos

#### 3. Google Cloud Platform (API Layer)
- **Responsabilidad:** Autenticación y acceso a servicios
- **Funciones:**
  - Autenticación OAuth 2.0
  - Validación de permisos
  - Rate limiting de APIs
  - Logging y monitoreo

#### 4. Google Workspace (Data + Services Layer)
- **Responsabilidad:** Almacenamiento y servicios finales
- **Funciones:**
  - **Sheets:** Base de datos de asistentes y estado
  - **Slides:** Plantillas de certificados
  - **Drive:** Storage de PDFs generados
  - **Gmail:** Entrega de emails

---

## 🔄 Flujo de Datos

### Flujo Completo (Happy Path)

```
1. Usuario
   ↓ Click en "Generar Certificados"
   
2. Apps Script
   ↓ Confirmación → HTTP POST
   
3. n8n Webhook
   ↓ Recibe trigger
   
4. Google Sheets API
   ↓ Query: WHERE Asistió='SI' AND Enviado='NO'
   ↓ Returns: [Estudiante1, Estudiante2, ...]
   
5. n8n Loop (por cada estudiante)
   
   5.1. Google Drive API
        ↓ Duplicate Template Slide
        ↓ Returns: temp_presentation_id
   
   5.2. Google Slides API
        ↓ Replace variables in temp_presentation_id
        ↓ {{NOMBRE}} → "Juan Pérez"
        ↓ Returns: updated_presentation_id
   
   5.3. Google Drive API
        ↓ Export presentation as PDF
        ↓ Returns: pdf_binary_data
   
   5.4. Gmail API
        ↓ Send email(to: estudiante.email, attachment: pdf)
        ↓ Returns: message_id
   
   5.5. Google Drive API
        ↓ Upload PDF to folder
        ↓ Returns: file_id
   
   5.6. Google Drive API
        ↓ Delete temp_presentation_id
        ↓ Returns: success
   
   5.7. Google Sheets API
        ↓ Update row: Enviado='SI'
        ↓ Returns: success
   
   5.8. Wait
        ↓ Sleep 5 seconds
        ↓ (Rate limiting)
   
   → Next estudiante

6. End
   ↓ All processed
   ↓ Return success to user
```

### Estructura de Datos

#### Google Sheet (Input)

```
Row | Nombre Estudiante | Email | Actividad | Fecha | Instructor | Cargo | Asistió | Enviado
----|-------------------|-------|-----------|-------|------------|-------|---------|--------
1   | Juan Pérez       | j@... | PowerBI   | 15/01 | María L.   | Inst. | SI      | NO
2   | Ana García       | a@... | PowerBI   | 15/01 | María L.   | Inst. | SI      | NO
```

#### Slide Template (Transformation)

```
Antes:
┌─────────────────────────────────────┐
│  Certificado de Asistencia          │
│                                     │
│  {{NOMBRE_COMPLETO}}                │
│  {{NOMBRE_TALLER}}                  │
│  {{FECHA_TEXTO}}                    │
│                                     │
│  {{NOMBRE_INSTRUCTOR}}              │
│  {{CARGO_INSTRUCTOR}}               │
└─────────────────────────────────────┘

Después:
┌─────────────────────────────────────┐
│  Certificado de Asistencia          │
│                                     │
│  Juan Pérez                         │
│  PowerBI                            │
│  15 de Enero de 2026                │
│                                     │
│  María López                        │
│  Instructora                        │
└─────────────────────────────────────┘
```

#### PDF Output (Storage)

```
Drive Folder Structure:
Certificados Generados/
  ├── Certificado Juan Pérez - 15-01-2026.pdf
  ├── Certificado Ana García - 15-01-2026.pdf
  └── ...
```

---

## 🎯 Decisiones de Diseño

### 1. ¿Por qué n8n y no código custom?

**Decisión:** Usar n8n como orquestador

**Razones:**
- ✅ **Visual workflow:** Más fácil de mantener para no-developers
- ✅ **Built-in connectors:** Google APIs ya implementadas
- ✅ **Error handling:** Retry logic incluido
- ✅ **No deployment:** No hay que deployar código
- ✅ **Logging:** Execution logs out-of-the-box

**Alternativa descartada:** Node.js custom
- ❌ Requiere deployment
- ❌ Más tiempo de desarrollo
- ❌ Menos visual para debugging

---

### 2. ¿Por qué Google Sheets como base de datos?

**Decisión:** Usar Google Sheets en vez de BD tradicional

**Razones:**
- ✅ **Familiaridad:** Equipo ya usa Sheets
- ✅ **No setup:** No hay que configurar servidor DB
- ✅ **UI gratis:** Interface de edición incluida
- ✅ **Colaboración:** Múltiples usuarios pueden editar
- ✅ **Costo:** $0

**Alternativa descartada:** PostgreSQL/MySQL
- ❌ Requiere servidor
- ❌ Requiere UI custom para editar
- ❌ Costos de hosting

---

### 3. ¿Por qué Apps Script y no botón en n8n?

**Decisión:** Trigger desde Google Sheet UI

**Razones:**
- ✅ **UX:** Usuarios ya están en el Sheet
- ✅ **Confirmación:** Popup nativo de Google
- ✅ **Feedback:** Alertas visuales inmediatas
- ✅ **Contexto:** El usuario ve los datos que va a procesar

**Alternativa descartada:** Manual trigger en n8n
- ❌ Usuario debe salir del Sheet
- ❌ No hay confirmación visual
- ❌ Menos user-friendly

---

### 4. ¿Por qué esperar 5 segundos entre certificados?

**Decisión:** Rate limiting de 5 segundos

**Razones:**
- ✅ **Quotas:** Google APIs tienen límites de requests/segundo
- ✅ **Stability:** Evita saturar APIs
- ✅ **Free tier:** Permite operar en plan gratuito
- ✅ **Buffer:** Margen de seguridad para picos

**Cálculo:**
```
100 requests / 100 segundos = 1 req/segundo (límite de Google)
Con 5 segundos = 0.2 req/segundo (20% del límite)
Margen de seguridad: 80%
```

---

### 5. ¿Por qué no usar plantilla HTML en vez de Slides?

**Decisión:** Google Slides para plantillas

**Razones:**
- ✅ **WYSIWYG:** No-code, visual editor
- ✅ **Diseño:** Más fácil para diseñadores
- ✅ **PDF nativo:** Exportación a PDF incluida
- ✅ **Sin dependencies:** No hay que instalar librerías de PDF

**Alternativa descartada:** HTML + Puppeteer
- ❌ Requiere servidor con Puppeteer
- ❌ Más complejo de diseñar
- ❌ Costos adicionales

---

## ⚡ Optimizaciones

### 1. Optimización de API Calls

**Problema original:**
- Sistema típico usa 15-20 API calls por certificado
- Cuota Google: 100 requests / 100 segundos
- Máximo: 5-6 certificados/100s

**Solución implementada:**
- Reducción a **7 API calls** por certificado
- Permite: 14 certificados/100s
- **2.5x mejora** en throughput

**Cómo se logró:**

1. **Filtrado en origen:** 
   - ❌ Antes: Traer todos → filtrar en n8n
   - ✅ Ahora: Filtrar directo en Sheets API

2. **Reutilización de datos:**
   - ❌ Antes: Múltiples queries al Sheet
   - ✅ Ahora: Una query, reusar resultado

3. **Batch operations:**
   - ❌ Antes: Update row por row
   - ✅ Ahora: Merge y update en batch

---

### 2. Manejo de Archivos Temporales

**Problema:** Plantillas duplicadas se acumulan en Drive

**Solución:**
- Nodo dedicado: "Eliminar Archivo Temporal"
- Se ejecuta DESPUÉS de exportar PDF
- Mantiene Drive limpio

**Beneficio:**
- No hay archivos basura
- Storage siempre organizado

---

### 3. Idempotencia

**Problema:** ¿Qué pasa si falla a mitad de proceso?

**Solución:**
- Columna "Enviado" como flag
- Solo procesar donde Enviado='NO'
- Update después de cada certificado

**Beneficio:**
- Re-ejecución segura
- No duplicados
- Resiliencia a fallos

---

## 📈 Escalabilidad

### Límites Actuales

| Métrica | Límite | Causa |
|---------|--------|-------|
| Certificados/hora | ~720 | Rate limiting (5s wait) |
| Certificados/día | ~17,280 | Cuota diaria Google (teórico) |
| Certificados/ejecución | ~500 | Timeout de n8n (30min default) |

### Escenarios de Crecimiento

#### Escenario 1: 500 certificados/mes (actual)
- ✅ **Solución actual suficiente**
- Tiempo: ~35 minutos
- Costo: $0

#### Escenario 2: 2,000 certificados/mes
- ✅ **Solución actual suficiente**
- Tiempo: ~2.5 horas (dividir en lotes)
- Costo: $0

#### Escenario 3: 10,000 certificados/mes
- ⚠️ **Requiere optimización**
- Opciones:
  1. Paralelizar workflows (múltiples cuentas Google)
  2. Reducir wait time a 2s
  3. Usar Google Workspace (cuotas mayores)

#### Escenario 4: 100,000+ certificados/mes
- ❌ **Requiere re-arquitectura**
- Solución sugerida:
  - Migrar a servicio dedicado (AWS Lambda + S3)
  - Usar queue system (SQS, RabbitMQ)
  - Cache de plantillas
  - CDN para PDFs

---

## 🔒 Seguridad

### Modelo de Autenticación

```
User → Apps Script → API Key → n8n Webhook
n8n → OAuth 2.0 → Google APIs
```

### Layers de Seguridad

1. **User Layer:**
   - Confirmación manual (UX protection)
   
2. **Transport Layer:**
   - HTTPS only
   - API Key validation
   
3. **API Layer:**
   - OAuth 2.0 tokens
   - Scoped permissions
   - Short-lived access tokens

### Datos Sensibles

| Dato | Almacenamiento | Protección |
|------|----------------|------------|
| API Key | n8n credentials + Apps Script | Encrypted at rest |
| OAuth tokens | n8n credentials | Auto-refresh, encrypted |
| Emails estudiantes | Google Sheets | Google Workspace security |
| PDFs | Google Drive | Permissions heredadas |

---

## 🧪 Testing Strategy

### Niveles de Testing

1. **Component Testing:**
   - Cada nodo de n8n individualmente
   - Apps Script function aislada

2. **Integration Testing:**
   - Workflow completo con 1 certificado
   - Verificar outputs en cada step

3. **End-to-End Testing:**
   - Desde botón hasta email recibido
   - Verificar datos en Sheet, Drive, Gmail

4. **Load Testing:**
   - Procesar 100+ certificados
   - Verificar rate limiting
   - Medir tiempos

---

## 📚 Referencias Técnicas

### APIs Utilizadas

- [Google Sheets API v4](https://developers.google.com/sheets/api)
- [Google Slides API v1](https://developers.google.com/slides/api)
- [Google Drive API v3](https://developers.google.com/drive/api)
- [Gmail API v1](https://developers.google.com/gmail/api)

### Herramientas

- [n8n Documentation](https://docs.n8n.io)
- [Apps Script Guide](https://developers.google.com/apps-script)
- [OAuth 2.0 Protocol](https://oauth.net/2/)

---

**Esta arquitectura permite operar el sistema con $0 de costo mientras mantiene alta confiabilidad y escalabilidad para el volumen actual.** 🚀
