# 🔧 Configuración de Google Cloud Platform

Guía detallada para configurar correctamente las APIs de Google necesarias para el sistema.

---

## 📋 Resumen

Este sistema utiliza las siguientes APIs de Google:
- **Google Sheets API** - Leer y actualizar datos
- **Google Slides API** - Generar certificados personalizados
- **Google Drive API** - Almacenar PDFs y duplicar plantillas
- **Gmail API** - Enviar emails con certificados adjuntos

---

## 🎯 Prerequisitos

- Cuenta de Google (Gmail o Workspace)
- Acceso a [Google Cloud Console](https://console.cloud.google.com)
- Navegador web moderno

---

## 🚀 Configuración Paso a Paso

### PASO 1: Crear Proyecto en Google Cloud

#### 1.1 Acceder a GCP

1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Iniciar sesión con tu cuenta de Google

#### 1.2 Crear Nuevo Proyecto

1. Click en selector de proyectos (arriba a la izquierda, al lado del logo de Google Cloud)
2. En el popup, click en **"NUEVO PROYECTO"**
3. Configurar proyecto:
   ```
   Nombre del proyecto: Certificados-Automaticos
   Organización: Sin organización (o tu organización si tenés)
   Ubicación: Sin organización (o tu organización)
   ```
4. Click en **"CREAR"**
5. Esperar 10-30 segundos a que se cree
6. Verificar que el proyecto esté seleccionado (debe aparecer el nombre en la barra superior)

---

### PASO 2: Habilitar APIs

#### 2.1 Acceder a la Biblioteca de APIs

1. En el menú lateral (☰), ir a:
   ```
   APIs y servicios → Biblioteca
   ```
2. Se abre la biblioteca con miles de APIs disponibles

#### 2.2 Habilitar Google Sheets API

1. En el buscador, escribir: `Google Sheets API`
2. Click en **"Google Sheets API"** (el primero que aparece)
3. Click en el botón azul **"HABILITAR"**
4. Esperar confirmación (barra azul que dice "Habilitando...")
5. Se abrirá la página de la API (ya habilitada)

#### 2.3 Habilitar Google Slides API

1. Volver a **Biblioteca** (flecha atrás o menú lateral)
2. Buscar: `Google Slides API`
3. Click en **"Google Slides API"**
4. Click en **"HABILITAR"**
5. Esperar confirmación

#### 2.4 Habilitar Google Drive API

1. Volver a **Biblioteca**
2. Buscar: `Google Drive API`
3. Click en **"Google Drive API"**
4. Click en **"HABILITAR"**
5. Esperar confirmación

#### 2.5 Habilitar Gmail API

1. Volver a **Biblioteca**
2. Buscar: `Gmail API`
3. Click en **"Gmail API"**
4. Click en **"HABILITAR"**
5. Esperar confirmación

---

### PASO 3: Configurar Pantalla de Consentimiento OAuth

Antes de crear credenciales, debemos configurar la pantalla de consentimiento.

#### 3.1 Acceder a Configuración

1. Menú lateral: **APIs y servicios → Pantalla de consentimiento de OAuth**
2. Se mostrará página de configuración

#### 3.2 Seleccionar Tipo de Usuario

- **Externo**: Permite que cualquier usuario de Google use la app
- **Interno**: Solo usuarios de tu organización (requiere Google Workspace)

Para este proyecto: Seleccionar **"Externo"**

Click en **"CREAR"**

#### 3.3 Información de la Aplicación (Paso 1)

Completar formulario:

```
Nombre de la aplicación: Sistema de Certificados Automáticos
Email de asistencia del usuario: tu-email@gmail.com
Logo de la aplicación: (opcional)

Información de contacto del desarrollador:
  Direcciones de correo electrónico: tu-email@gmail.com
```

Click en **"GUARDAR Y CONTINUAR"**

#### 3.4 Ámbitos (Paso 2)

1. Click en **"AGREGAR O QUITAR ÁMBITOS"**
2. En el campo de búsqueda, buscar y seleccionar cada uno de estos ámbitos:

```
✅ https://www.googleapis.com/auth/spreadsheets
   Descripción: Ver y administrar hojas de cálculo

✅ https://www.googleapis.com/auth/drive
   Descripción: Ver y administrar archivos de Google Drive

✅ https://www.googleapis.com/auth/presentations
   Descripción: Ver y administrar presentaciones de Google

✅ https://www.googleapis.com/auth/gmail.send
   Descripción: Enviar correos electrónicos
```

3. Verificar que los 4 ámbitos estén seleccionados
4. Click en **"ACTUALIZAR"**
5. Click en **"GUARDAR Y CONTINUAR"**

#### 3.5 Usuarios de Prueba (Paso 3)

Si seleccionaste "Externo", necesitás agregar usuarios de prueba mientras la app está en desarrollo:

1. Click en **"+ ADD USERS"**
2. Agregar emails de usuarios que puedan probar:
   ```
   tu-email@gmail.com
   usuario-test@gmail.com
   ```
3. Click en **"AGREGAR"**
4. Click en **"GUARDAR Y CONTINUAR"**

#### 3.6 Resumen (Paso 4)

1. Revisar toda la configuración
2. Click en **"VOLVER AL PANEL"**

**Nota:** La app quedará en modo "Testing". Para producción, eventualmente deberás enviarla a verificación de Google.

---

### PASO 4: Crear Credenciales OAuth 2.0

#### 4.1 Acceder a Credenciales

1. Menú lateral: **APIs y servicios → Credenciales**
2. Click en **"+ CREAR CREDENCIALES"**
3. Seleccionar: **"ID de cliente de OAuth 2.0"**

#### 4.2 Configurar Aplicación

```
Tipo de aplicación: Aplicación web

Nombre: n8n Integration

URIs de redirección autorizados:
  https://tu-instancia-n8n.com/rest/oauth2-credential/callback
```

**IMPORTANTE:** Reemplazar `tu-instancia-n8n.com` con tu dominio real de n8n

Ejemplos válidos:
- `https://n8n.ejemplo.com/rest/oauth2-credential/callback`
- `https://mi-n8n.herokuapp.com/rest/oauth2-credential/callback`
- `http://localhost:5678/rest/oauth2-credential/callback` (solo para desarrollo local)

#### 4.3 Crear y Guardar Credenciales

1. Click en **"CREAR"**
2. Aparecerá popup con:
   ```
   ID de cliente: XXXXXXXXXXXXX.apps.googleusercontent.com
   Secreto de cliente: YYYYYYYYYYYYYYY
   ```
3. **MUY IMPORTANTE:** Copiar ambos valores a un lugar seguro
4. Puede ser en un archivo de texto temporal:
   ```
   Client ID: 123456789-abcdefg.apps.googleusercontent.com
   Client Secret: GOCSPX-abc123def456
   ```

**⚠️ ADVERTENCIA:** El secreto se muestra solo UNA VEZ. Si lo perdés, tenés que crear credenciales nuevas.

5. Click en **"ACEPTAR"**

---

### PASO 5: Verificar Configuración

#### 5.1 Verificar APIs Habilitadas

1. Ir a: **APIs y servicios → Panel de control**
2. Debe mostrar las 4 APIs habilitadas:
   - ✅ Google Sheets API
   - ✅ Google Slides API
   - ✅ Google Drive API
   - ✅ Gmail API

#### 5.2 Verificar Credenciales

1. Ir a: **APIs y servicios → Credenciales**
2. En la sección "IDs de cliente de OAuth 2.0" debe aparecer:
   ```
   Nombre: n8n Integration
   Tipo: Aplicación web
   Creación: [Fecha de hoy]
   ```

---

## 📊 Cuotas y Límites

### Límites de APIs (Free Tier)

| API | Límite por Día | Límite por 100 Segundos |
|-----|----------------|-------------------------|
| Google Sheets API | 500 requests | 100 requests |
| Google Slides API | Unlimited* | 300 requests |
| Google Drive API | 1,000,000,000 bytes | 10,000 requests |
| Gmail API | 1,000,000,000 bytes | 250 requests/user |

**Optimización del sistema:**
- El sistema usa ~7 requests por certificado
- Con espera de 5 segundos, procesa ~720 certificados/hora
- Muy por debajo de los límites gratuitos

### Monitorear Uso

1. **APIs y servicios → Panel de control**
2. Seleccionar API específica
3. Ver gráficos de uso

---

## 🔒 Seguridad

### Buenas Prácticas

✅ **HACER:**
- Rotar credenciales cada 6-12 meses
- Limitar ámbitos solo a los necesarios
- Usar cuentas de servicio en producción
- Habilitar logging y monitoreo

❌ **NO HACER:**
- Compartir Client Secret públicamente
- Commitear secretos en Git
- Usar la misma credencial en múltiples apps
- Dejar credenciales sin usar habilitadas

### Revocar Credenciales Comprometidas

Si un secreto se filtra:

1. **APIs y servicios → Credenciales**
2. Buscar la credencial comprometida
3. Click en el ícono de **eliminar (🗑️)**
4. Crear credenciales nuevas
5. Actualizar en n8n con las nuevas

---

## 🚨 Problemas Comunes

### Error: "Access blocked: This app's request is invalid"

**Causa:** Ámbitos no configurados

**Solución:**
1. Volver a **Pantalla de consentimiento de OAuth**
2. Editar → Ámbitos
3. Verificar que estén los 4 ámbitos listados arriba
4. Guardar

---

### Error: "Redirect URI mismatch"

**Causa:** URI de redirección no coincide

**Solución:**
1. Copiar EXACTAMENTE la URL que te da n8n
2. Ir a **Credenciales → [Tu credencial] → Editar**
3. Agregar/corregir URI
4. Guardar

---

### Error: "API not enabled"

**Causa:** API no habilitada o proyecto incorrecto

**Solución:**
1. Verificar que estés en el proyecto correcto (selector superior)
2. Ir a **Biblioteca**
3. Buscar y habilitar la API faltante

---

### Límite de cuota excedido

**Síntoma:** Error "Quota exceeded"

**Solución:**
1. Esperar 24 horas (cuota se resetea diariamente)
2. Optimizar cantidad de requests
3. Aumentar espera entre certificados
4. Si es recurrente: solicitar aumento de cuota en GCP

---

## 🎓 Recursos Adicionales

### Documentación Oficial

- [Google Cloud Console](https://console.cloud.google.com)
- [Google Workspace APIs](https://developers.google.com/workspace)
- [OAuth 2.0 para Apps Web](https://developers.google.com/identity/protocols/oauth2/web-server)

### Tutoriales

- [Cómo usar OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Guía de n8n para Google OAuth](https://docs.n8n.io/integrations/builtin/credentials/google/)

---

## ✅ Checklist de Configuración Completa

- [ ] Proyecto creado en GCP
- [ ] 4 APIs habilitadas (Sheets, Slides, Drive, Gmail)
- [ ] Pantalla de consentimiento configurada
- [ ] 4 ámbitos agregados
- [ ] Usuarios de prueba agregados (si aplica)
- [ ] Credenciales OAuth 2.0 creadas
- [ ] Client ID copiado y guardado
- [ ] Client Secret copiado y guardado
- [ ] URI de redirección configurado

---

Una vez completado este checklist, estás listo para configurar las credenciales en n8n siguiendo la guía de `INSTALACION.md`.

**🎉 ¡APIs configuradas correctamente!**
