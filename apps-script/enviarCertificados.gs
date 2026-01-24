/**
 * Sistema de Generación Automática de Certificados
 * 
 * Este script permite activar el workflow de n8n desde un botón
 * en Google Sheets para generar y enviar certificados automáticamente.
 * 
 * @author Lautaro Manuel Rojo Provenzano
 * @version 1.0
 */

/**
 * Crea un menú personalizado al abrir el Google Sheet
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🎓 Certificados')
      .addItem('Generar y Enviar', 'enviarCertificados')
      .addToUi();
}

/**
 * Función principal que envía la orden de generación de certificados
 * al servidor n8n vía webhook
 */
function enviarCertificados() {
  var ui = SpreadsheetApp.getUi();
  var sheet = SpreadsheetApp.getActiveSpreadsheet(); 
  
  // ============================================
  // CONFIGURACIÓN - Editá estos valores
  // ============================================
  
  // URL de tu webhook de n8n
  // Ejemplo: "https://tu-instancia-n8n.com/webhook/generar-certificados"
  var webhookUrl = "YOUR_N8N_WEBHOOK_URL"; 
  
  // API Key - debe coincidir con la configurada en n8n (Header Auth)
  var apiKey = "YOUR_API_KEY_HERE"; 
  
  // ============================================
  // FIN DE CONFIGURACIÓN
  // ============================================
  
  // Confirmación de seguridad
  var confirmacion = ui.alert(
    'Generar Certificados',
    '¿Estás seguro que querés generar y enviar los certificados?\n\n' +
    'Se procesarán todos los registros marcados con:\n' +
    '• Asistió? = SI\n' +
    '• Enviado = NO',
    ui.ButtonSet.YES_NO
  );
  
  if (confirmacion == ui.Button.YES) {
    // Mensaje de inicio
    sheet.toast("Conectando con el servidor...", "⏳ Iniciando", 5);
    
    try {
      // Preparar payload con información del usuario que ejecuta
      var payload = {
        "iniciadoPor": Session.getActiveUser().getEmail(),
        "fecha": new Date().toISOString(),
        "source": "Google Apps Script"
      };
      
      // Configurar request HTTP
      var options = {
        "method": "post",
        "headers": {
          // Este header name debe coincidir con el configurado en n8n
          "x-api-key": apiKey,
          "Content-Type": "application/json"
        },
        "contentType": "application/json",
        "payload": JSON.stringify(payload),
        "muteHttpExceptions": true
      };
      
      // Realizar request al webhook
      var response = UrlFetchApp.fetch(webhookUrl, options);
      var responseCode = response.getResponseCode();
      var responseBody = response.getContentText();
      
      // Manejar respuesta según código HTTP
      if (responseCode == 200) {
        ui.alert(
          "✅ Éxito", 
          "La orden fue enviada correctamente.\n\n" +
          "El sistema procesará los certificados en segundo plano.\n" +
          "Recibirás una notificación cuando termine.", 
          ui.ButtonSet.OK
        );
        Logger.log("✅ Certificados enviados exitosamente");
        
      } else if (responseCode == 403) {
        ui.alert(
          "⛔ Error de Permiso", 
          "La contraseña (API Key) es incorrecta.\n\n" +
          "Revisá la configuración en el script.", 
          ui.ButtonSet.OK
        );
        Logger.log("❌ Error 403: API Key incorrecta");
        
      } else if (responseCode == 404) {
        ui.alert(
          "⚠️ Error de URL", 
          "No se encontró el webhook.\n\n" +
          "Verificá que la URL sea correcta:\n" + webhookUrl, 
          ui.ButtonSet.OK
        );
        Logger.log("❌ Error 404: Webhook no encontrado");
        
      } else {
        ui.alert(
          "⚠️ Error del Servidor", 
          "El servidor respondió con error: " + responseCode + "\n\n" +
          "Respuesta: " + responseBody, 
          ui.ButtonSet.OK
        );
        Logger.log("❌ Error " + responseCode + ": " + responseBody);
      }
      
    } catch (e) {
      // Manejar errores de conexión o ejecución
      ui.alert(
        "❌ Error de Conexión", 
        "No se pudo conectar con el servidor.\n\n" +
        "Detalle del error:\n" + e.toString() + "\n\n" +
        "Verificá:\n" +
        "• La URL del webhook\n" +
        "• Tu conexión a internet\n" +
        "• Que el servidor n8n esté funcionando", 
        ui.ButtonSet.OK
      );
      Logger.log("❌ Error de conexión: " + e.toString());
    }
    
  } else {
    // Usuario canceló la operación
    sheet.toast("Operación cancelada", "❌ Cancelado", 3);
    Logger.log("ℹ️ Operación cancelada por el usuario");
  }
}

/**
 * Función de test para verificar la configuración
 * Ejecutar manualmente desde el editor de Apps Script
 */
function testConexion() {
  var webhookUrl = "YOUR_N8N_WEBHOOK_URL";
  var apiKey = "YOUR_API_KEY_HERE";
  
  Logger.log("🧪 Testeando conexión...");
  Logger.log("URL: " + webhookUrl);
  
  try {
    var payload = {
      "test": true,
      "timestamp": new Date().toISOString()
    };
    
    var options = {
      "method": "post",
      "headers": {
        "x-api-key": apiKey,
        "Content-Type": "application/json"
      },
      "contentType": "application/json",
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(webhookUrl, options);
    var responseCode = response.getResponseCode();
    
    if (responseCode == 200) {
      Logger.log("✅ Test exitoso! Código: " + responseCode);
      return true;
    } else {
      Logger.log("❌ Test falló. Código: " + responseCode);
      Logger.log("Respuesta: " + response.getContentText());
      return false;
    }
    
  } catch (e) {
    Logger.log("❌ Error en test: " + e.toString());
    return false;
  }
}
