// Utilidades compartidas (cliente y servidor)

export const CHILAPA_TIMEZONE = "America/Mexico_City";

// Fecha/hora actual en Chilapa (independiente de la zona horaria del visitante)
export function getChilapaNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CHILAPA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    year: parseInt(get("year"), 10),
    month: parseInt(get("month"), 10),
    day: parseInt(get("day"), 10),
    hour: parseInt(get("hour"), 10) % 24,
    minute: parseInt(get("minute"), 10),
    weekday: weekdayMap[get("weekday")],
  };
}

// Estado del local según el horario (Mar-Dom 5:30 PM a 10:00 PM). `force` = "abierto" | "cerrado" | null
export function computeStoreStatus(force = null) {
  if (force === "abierto") {
    return { isOpen: true, label: "Abierto ahora · Servicio hasta las 10:00 PM (Simulado)" };
  }
  if (force === "cerrado") {
    return { isOpen: false, label: "Cerrado en este momento · Puedes pre-ordenar o reservar mesa" };
  }
  const now = getChilapaNow();
  const minutes = now.hour * 60 + now.minute;
  const open = 17 * 60 + 30;
  const close = 22 * 60;
  if (now.weekday === 1) {
    return { isOpen: false, label: "Hoy Lunes cerrado · Abrimos mañana martes de 5:30 PM a 10:00 PM" };
  }
  if (minutes >= open && minutes < close) {
    return { isOpen: true, label: "¡Abierto ahora en Chilapa! · Cierra a las 10:00 PM" };
  }
  if (minutes < open) {
    return { isOpen: false, label: "Cerrado ahora · Hoy abrimos de 5:30 PM a 10:00 PM (Pre-ordena ya)" };
  }
  return { isOpen: false, label: "Cerrado por hoy · Te esperamos de Mar a Dom de 5:30 a 10:00 PM" };
}

// Normaliza texto para búsquedas: minúsculas y sin acentos ("Camarón" -> "camaron")
export function normalizeText(str) {
  return String(str).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Valida que un teléfono tenga 10 dígitos (acepta espacios, guiones y prefijo +52)
export function isValidPhone(str) {
  let digits = String(str).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("52")) digits = digits.slice(2);
  return digits.length === 10;
}

export function formatMoney(n) {
  return `$${n}`;
}

export function whatsappUrl(phone, text) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

// Portapapeles: API moderna con respaldo para navegadores antiguos
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    /* continúa con el respaldo */
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch (e) {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}
