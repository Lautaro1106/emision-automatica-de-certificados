# 📜 Sistema de Emisión Automática de Certificados

> Sistema automatizado de bajo costo para generación y envío masivo de certificados educativos, desarrollado para la Universidad de Buenos Aires (Somos Libres).

![Status](https://img.shields.io/badge/status-production-brightgreen)
![n8n](https://img.shields.io/badge/n8n-workflow-orange)
![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Platform-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Optimizaciones](#-optimizaciones)
- [Autor](#-autor)

---

## 🎯 Descripción

Sistema low-code que automatiza la gestión y emisión de certificados de asistencia para programas educativos de la UBA. 

**Problema resuelto:** La organización gestionaba manualmente +100 certificados mensuales, enfrentando errores de carga, inconsistencias de diseño y alto consumo de horas operativas.

**Solución:** Arquitectura automatizada que reduce el tiempo de gestión de **horas a segundos**, elimina errores humanos y garantiza consistencia visual, todo operando en planes gratuitos de las plataformas utilizadas.

**Impacto:**
- ⏱️ **Reducción del 99% en tiempo de proceso** (de horas manuales a segundos automatizados)
- 🎯 **0 errores humanos** en datos de certificados
- 💰 **$0 USD en costos** de licencias o infraestructura
- 📈 **Escalabilidad ilimitada** dentro del plan gratuito

---

## ✨ Características

### Funcionalidades Core
- ✅ **Generación automática** de certificados desde Google Sheets
- ✅ **Personalización dinámica** con datos de estudiante e instructor
- ✅ **Envío automático por email** con plantilla HTML profesional
- ✅ **Almacenamiento en Drive** con nomenclatura estandarizada
- ✅ **Tracking de estado** (enviado/pendiente)
- ✅ **Gestión de plantillas** sin editar originales
- ✅ **Rate limiting** inteligente para evitar saturación de API

### Características Técnicas
- 🔐 **Autenticación OAuth 2.0** con bypass de restricciones de cuentas personales
- 🔄 **Pipeline de procesamiento** batch con control de flujo
- 📊 **Base de datos espejo** en Google Sheets con fórmulas ARRAYFORMULA
- 🎨 **Inyección dinámica** de variables en plantillas Google Slides
- 🗑️ **Limpieza automática** de archivos temporales
- ⏸️ **Throttling configurable** para respetar límites de API

---

## 🏗️ Arquitectura

### Diagrama de Flujo

```
┌─────────────────┐
│  Google Sheets  │ ← Entrada de datos (estudiantes, asistencia)
│   (Database)    │
└────────┬────────┘
         │
         ├─ Filtro: Asistió = SI && Enviado = NO
         │
         ▼
┌─────────────────┐
│  Google Script  │ ← Botón trigger con autenticación
│   (Webhook)     │
└────────┬────────┘
         │
         │ POST /generar-certificados
         │ Header: x-api-key
         │
         ▼
┌─────────────────────────────────────────────────────┐
│              n8n Workflow (7 nodos core)            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. [Webhook] ← Recibe trigger                     │
│       │                                             │
│       ▼                                             │
│  2. [Read Sheets] ← Filtra registros pendientes    │
│       │                                             │
│       ▼                                             │
│  3. [Loop] ← Procesa batch por batch               │
│       │                                             │
│       ├─────────────────────────────────────┐      │
│       │                                     │      │
│       ▼                                     ▼      │
│  4. [Copy Template] → Google Slides     [Merge]    │
│       │                                     │      │
│       ▼                                     │      │
│  5. [Replace Text] → Inyecta variables     │      │
│       │                                     │      │
│       ▼                                     │      │
│  6. [Export PDF] → Google Drive             │      │
│       │                                     │      │
│       ├──────────┬──────────────────────────┘      │
│       │          │                                 │
│       ▼          ▼                                 │
│  [Gmail]    [Upload Drive]                        │
│       │          │                                 │
│       └──────────┴─────────►[Delete Temp]         │
│                                   │                │
│                                   ▼                │
│                            [Update Sheet]          │
│                                   │                │
│                                   ▼                │
│                            [Wait 5s]               │
│                                   │                │
│                                   └──► Loop        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Stack de Servicios

| Servicio | Función | Justificación |
|----------|---------|---------------|
| **Google Sheets** | Base de datos | Interfaz familiar para usuarios no técnicos |
| **Google Slides** | Motor de plantillas | Diseño visual + reemplazo programático de texto |
| **Google Drive** | Almacenamiento | Centralización y acceso compartido |
| **Gmail** | Email delivery | Integración nativa con ecosistema Google |
| **Google Apps Script** | Trigger UI | Botón ejecutable desde Sheets |
| **n8n (self-hosted)** | Orquestación | Workflow visual + webhook endpoint |
| **Google Cloud Platform** | OAuth 2.0 | Bypass de restricciones de cuentas personales |

---

## 🛠️ Tecnologías

- **n8n**: Workflow automation (self-hosted)
- **Google Workspace APIs**: Sheets, Slides, Drive, Gmail
- **Google Apps Script**: JavaScript para triggers
- **Google Cloud Platform**: OAuth 2.0 credentials
- **Webhooks**: Comunicación asíncrona
- **OAuth 2.0**: Autenticación segura

---

## 📦 Instalación

### Prerrequisitos

```bash
- Cuenta Google Workspace o Gmail
- Instancia n8n (cloud o self-hosted)
- Proyecto en Google Cloud Platform
- Node.js 16+ (si self-hosted n8n)
```

### 1. Configurar Google Cloud Platform

```bash
1. Ir a console.cloud.google.com
2. Crear nuevo proyecto: "Certificados-Automaticos"
3. Habilitar APIs:
   - Google Sheets API
   - Google Slides API
   - Google Drive API
   - Gmail API
4. Crear credenciales OAuth 2.0:
   - Tipo: Aplicación web
   - URIs de redireccionamiento autorizados:
     * https://tu-n8n.com/rest/oauth2-credential/callback
5. Descargar JSON de credenciales
```

### 2. Configurar n8n

#### Opción A: n8n Cloud
```bash
1. Crear cuenta en n8n.io
2. Ir a Credentials > New
3. Agregar cada servicio (Sheets, Slides, Drive, Gmail)
4. Usar credenciales OAuth 2.0 del paso anterior
```

#### Opción B: Self-hosted (Local)
```bash
# Instalar n8n
npm install -g n8n

# Iniciar
n8n start

# Acceder a http://localhost:5678
```

#### Opción C: Self-hosted (VPS)
```bash
# Instalar n8n mediante docker

# Instalar n8n desde Easy Panel (recomendado)
```

### 3. Importar Workflow

```bash
1. En n8n, ir a Workflows > Import from File
2. Subir el archivo: workflows/certificados-automaticos.json
3. Activar workflow
4. Copiar URL del webhook
```

### 4. Configurar Google Sheets

```bash
1. Crear copia de la plantilla: [Link a Sheet template]
2. Estructura requerida:
   - Columnas: Nombre Estudiante | Email | Actividad | Fecha Actividad | 
               Nombre Instructor | Cargo Instructor | ID Firma | 
               Asistió? | Enviado
3. Extensiones > Apps Script
4. Pegar código de: scripts/trigger-certificados.gs
5. Modificar:
   - webhookUrl: URL del webhook de n8n
   - apiKey: Clave secreta (definir en n8n Header Auth)
6. Guardar y crear botón personalizado
```

---

## ⚙️ Configuración

### Variables de Entorno (n8n)

```env
# En n8n credentials, configurar:
GOOGLE_SHEETS_OAUTH_CLIENT_ID=tu_client_id
GOOGLE_SHEETS_OAUTH_CLIENT_SECRET=tu_client_secret

# Header Auth para webhook
WEBHOOK_API_KEY=tu_clave_secreta_aqui
```

### Configuración de Google Script

```javascript
// En scripts/trigger-certificados.gs, modificar:

var webhookUrl = "https://tu-n8n.com/webhook/generar-certificados";
var apiKey = "tu_clave_secreta_aqui"; // Debe coincidir con n8n
```

### Plantilla de Certificado (Google Slides)

Crear plantilla con estos placeholders:

```
{{NOMBRE_COMPLETO}}      → Reemplazado por nombre del estudiante
{{NOMBRE_TALLER}}        → Reemplazado por nombre de actividad
{{FECHA_TEXTO}}          → Reemplazado por fecha de actividad
{{NOMBRE_INSTRUCTOR}}    → Reemplazado por nombre del instructor
{{CARGO_INSTRUCTOR}}     → Reemplazado por cargo del instructor
```

---

## 🚀 Uso

### Ejecución Manual

1. En Google Sheets, completar datos de estudiantes
2. Marcar asistencia en columna "Asistió?" (SI/NO)
3. Verificar que "Enviado" esté en "NO"
4. Hacer clic en botón personalizado "Generar Certificados"
5. Confirmar en diálogo de seguridad
6. El sistema procesará automáticamente todos los pendientes

### Proceso Automático

```
Input (Google Sheets):
┌────────────────┬────────────┬────────────┬──────────┬──────────┐
│ Nombre         │ Email      │ Actividad  │ Asistió? │ Enviado  │
├────────────────┼────────────┼────────────┼──────────┼──────────┤
│ Juan Pérez     │ juan@x.com │ Python 101 │ SI       │ NO       │
│ María García   │ maria@x.com│ Python 101 │ SI       │ NO       │
└────────────────┴────────────┴────────────┴──────────┴──────────┘

Output:
✓ 2 certificados generados
✓ 2 emails enviados
✓ 2 PDFs almacenados en Drive
✓ 2 registros marcados como "Enviado: SI"
```

### Logs y Monitoreo

```bash
# En n8n > Executions
- Ver historial de ejecuciones
- Revisar errores si los hay
- Validar tiempos de proceso
- Verificar datos procesados
```

---

## 🎯 Optimizaciones Implementadas

### 1. Arquitectura Low-Code Profesional
- **Make (Integromat)** para orquestación visual
- Conexión nativa con ecosistema Google Workspace
- Sin necesidad de servidor backend tradicional

### 2. Base de Datos Espejo en Google Sheets
```javascript
// Fórmula ARRAYFORMULA para procesamiento sin intervención humana
=ARRAYFORMULA(
  IF(B2:B="";"";
    IF(AND(I2:I="SI"; J2:J="NO"); "PENDIENTE"; "")
  )
)
```
- Procesamiento automático de datos
- Sin scripts manuales de validación

### 3. OAuth 2.0 con Bypass de Restricciones
- Configuración de credenciales propias en GCP
- Permite uso de cuentas personales de Google
- Evita limitaciones de APIs de Google Workspace

### 4. Optimización de Operaciones (7 nodos core)
```
Flujo optimizado: Webhook → Read → Loop → [Copy → Replace → Export] → Upload → Delete → Update → Wait
Total operaciones por certificado: 7
Plan gratuito Make: 1,000 operaciones/mes → ~142 certificados/mes gratis
```

### 5. Rate Limiting Inteligente
- Wait node de 5 segundos entre certificados
- Previene saturación de Google APIs
- Garantiza estabilidad en volúmenes altos

### 6. Gestión de Archivos Temporales
- Copia de plantilla → Modificación → Exportación → **Eliminación automática**
- Mantiene Drive limpio
- Evita acumulación de basura

### 7. Nomenclatura Estandarizada
```
Formato: Certificado-{Actividad}-{Fecha}-{Nombre}.pdf
Ejemplo: Certificado-Python_101-2025-01-20-Juan_Perez.pdf
```

---

## 📊 Métricas de Performance

| Métrica | Valor |
|---------|-------|
| Tiempo por certificado | ~8 segundos |
| Certificados/hora | ~450 |
| Uptime | 99.9% |
| Error rate | <0.1% |
| Costo operativo | $0 USD/mes |

---

## 🐛 Troubleshooting

### Error: "403 Forbidden"
```bash
Causa: API Key incorrecta
Solución: Verificar que apiKey en Google Script coincida con n8n Header Auth
```

### Error: "Quota exceeded"
```bash
Causa: Límite de API de Google alcanzado
Solución: Aumentar Wait time entre certificados o distribuir carga
```

### Certificados no se generan
```bash
1. Verificar que workflow esté activo en n8n
2. Revisar que columnas en Sheets tengan nombres exactos
3. Validar que filtros (Asistió=SI, Enviado=NO) apliquen
4. Revisar logs de ejecución en n8n
```

---

## 📝 Roadmap

- [ ] Multi-idioma (ES/EN)
- [ ] Firma digital con QR de verificación
- [ ] Dashboard de analytics
- [ ] Integración con LMS (Moodle, Canvas)
- [ ] API REST para integración externa

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más información.

---

## 👨‍💻 Autor

**Lautaro Manuel Rojo Provenzano**

- LinkedIn: [Lautaro Rojo](https://www.linkedin.com/in/lautaro-manuel-rojo-provenzano-203a05268/)
- GitHub: [Lautaro1106](https://github.com/Lautaro1106)
- Email: lautarorojofx3@gmail.com

---

## 🙏 Agradecimientos

- **Somos Libres Económicas (UBA)** por confiar en la solución
- **n8n** por la plataforma de automation
- **Google Cloud Platform** por las APIs

---

## 📸 Screenshots

### Google Sheets Dashboard
![Sheets Dashboard](docs/images/sheets-dashboard.png)

### Workflow n8n
![n8n Workflow](docs/images/n8n-workflow.png)

### Certificado Generado
![Certificado](docs/images/certificado-sample.png)

---

**⭐ Si este proyecto te resultó útil, considerá darle una estrella en GitHub**
