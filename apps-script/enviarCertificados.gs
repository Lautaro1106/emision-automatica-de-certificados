function enviarCertificados() {
  var ui = SpreadsheetApp.getUi();
  var sheet = SpreadsheetApp.getActiveSpreadsheet(); 

  // 1. CONFIGURACIÓN
  // Poné tu URL de producción
  var webhookUrl = ""; 

  // Poné la MISMA contraseña que escribiste en el campo "Value" en n8n
  var apiKey = ""; 
  // 2. PREGUNTA DE SEGURIDAD
  var confirmacion = ui.alert(
    'Generar Certificados',
    '¿Estás seguro que querés generar y enviar los certificados?',
    ui.ButtonSet.YES_NO
  );
  if (confirmacion == ui.Button.YES) {
    sheet.toast("Conectando con el servidor...", "Iniciando", 5);
    try {
      var payload = {
        "iniciadoPor": Session.getActiveUser().getEmail(),
        "fecha": new Date()
      };
      var options = {
        "method": "post",
        "headers": {
          // Esto tiene que coincidir con el "Header Name" de n8n
          "x-api-key": apiKey  
        },
        "contentType": "application/json",
        "payload": JSON.stringify(payload),
        "muteHttpExceptions": true
      };
      var response = UrlFetchApp.fetch(webhookUrl, options);
      var responseCode = response.getResponseCode();
      if (responseCode == 200) {
        ui.alert("✅ Éxito", "La orden fue enviada. El sistema procesará los certificados en segundo plano.", ui.ButtonSet.OK);
      } else if (responseCode == 403) {
        ui.alert("⛔ Error de Permiso", "Contraseña incorrecta. Revisá la configuración.", ui.ButtonSet.OK);
      } else {
        ui.alert("⚠️ Error", "El servidor respondió con error: " + responseCode, ui.ButtonSet.OK);
      }
    } catch (e) {
      ui.alert("❌ Error de Conexión", "No se pudo conectar: " + e.toString(), ui.ButtonSet.OK);
    }
  }
}
