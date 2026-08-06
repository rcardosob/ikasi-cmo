/**
 * Cliente de notificaciones Pushover.
 * Envía alertas de fallo en la generación de copies (Nivel 2 fallback usado / doble fallo).
 */

export interface PushoverAlertOptions {
  title: string;
  message: string;
  /** 0 = normal, 1 = high, 2 = emergency */
  priority?: 0 | 1 | 2;
}

/**
 * Envía una alerta a Pushover. No lanza excepciones hacia el caller:
 * ante cualquier fallo del envío se loguea y se continua, para no interrumpir la respuesta.
 */
export async function sendPushoverAlert({
  title,
  message,
  priority = 1,
}: PushoverAlertOptions): Promise<boolean> {
  const appToken = process.env.PUSHOVER_API_KEY;
  const userKey = process.env.PUSHOVER_USER_KEY;

  if (!appToken || !userKey) {
    console.warn('[Pushover] Credenciales no configuradas (PUSHOVER_API_KEY / PUSHOVER_USER_KEY). Alerta omitida.');
    return false;
  }

  try {
    const body = new URLSearchParams({
      token: appToken,
      user: userKey,
      title: title.slice(0, 250),
      message: message.slice(0, 1024),
      priority: String(priority),
      sound: 'siren',
    });

    const res = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!res.ok) {
      const text = await res.text();
      console.warn(`[Pushover] HTTP ${res.status}: ${text.slice(0, 300)}`);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[Pushover] Error de red al enviar alerta:', err);
    return false;
  }
}
