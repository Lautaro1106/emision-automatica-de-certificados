# Apps Script - Botón de Generación

## Instalación

1. Abrir Google Sheet
2. Ir a **Extensiones → Apps Script**
3. Copiar el contenido de `enviarCertificados.gs`
4. Modificar variables:
   - `webhookUrl`
   - `apiKey`
5. Guardar como "Generar Certificados"

## Crear Menú Personalizado

Agregar este código para crear un menú:
```javascript
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🎓 Certificados')
      .addItem('Generar y Enviar', 'enviarCertificados')
      .addToUi();
}
```

## Testing

Ejecutar desde el editor de Apps Script:
1. Seleccionar función `enviarCertificados`
2. Click en ▶️ Run
3. Autorizar permisos necesarios
4. Verificar en consola

## Permisos Requeridos

- Acceso a Google Sheets (lectura)
- Acceso a hacer requests HTTP externos
