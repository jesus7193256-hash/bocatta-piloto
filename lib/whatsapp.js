// Construcción de los mensajes de WhatsApp (pedido y reservación)

export const MODALITIES = {
  delivery: "Pedido a Domicilio",
  pickup: "Pasar a Recoger (Pick-up)",
  dinein: "Consumo en el Local (Pre-orden)",
};

export function cartTotal(cart) {
  return cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
}

export function buildOrderText({ cart, modality, form, storeIsOpen }) {
  const name = form.name.trim() || "[Tu Nombre]";
  const phone = form.phone.trim() || "[Teléfono]";
  const address = form.address.trim() || "[Dirección en Chilapa]";
  const cash = form.cash.trim();
  const notes = form.notes.trim();

  const lines = [
    "*¡Hola Bōcatta Food Spot!* Quiero realizar un pedido:",
    ...(storeIsOpen ? [] : ["_(Pedido enviado fuera de horario: por favor confírmenlo cuando abran)_"]),
    "",
    `*Modalidad:* ${modality}`,
    `*Cliente:* ${name}`,
    `*Contacto:* ${phone}`,
    "────────────────────",
    "*DETALLE DEL PEDIDO:*",
  ];

  cart.forEach((item) => {
    lines.push(`• *${item.quantity}x ${item.name}* — $${item.unitPrice * item.quantity}`);
    if (item.details) lines.push(`   ↳ _${item.details}_`);
  });

  lines.push("────────────────────");
  lines.push(`*TOTAL A PAGAR: $${cartTotal(cart)} MXN*`);
  lines.push(`*Método de pago:* ${form.payment}${form.payment === "Efectivo" && cash ? ` (Paga con: ${cash})` : ""}`);

  if (modality === MODALITIES.delivery) {
    lines.push(`*Dirección de entrega:* ${address}`);
    lines.push("*Envío:* por confirmar según mi zona");
  } else if (modality === MODALITIES.pickup) {
    lines.push("*Recoger en:* Av. Insurgentes 400A, Centro, Chilapa.");
  } else {
    lines.push("*Para consumo en el local.*");
  }

  if (notes) lines.push(`*Notas de cocina:* ${notes}`);
  return lines.join("\n");
}

export function buildReservationText(r) {
  const lines = [
    "*¡Hola Bōcatta Food Spot!* Solicito una reservación de mesa:",
    "",
    `*Nombre:* ${r.name.trim() || "[Tu Nombre]"}`,
    `*Teléfono:* ${r.phone.trim() || "[Tu Teléfono]"}`,
    `*Fecha:* ${r.date || "[Fecha]"}`,
    `*Hora:* ${r.time}`,
    `*Personas:* ${r.guests}`,
    `*Ocasión:* ${r.occasion}`,
  ];
  if (r.notes.trim()) lines.push(`*Notas especiales:* ${r.notes.trim()}`);
  lines.push("");
  lines.push("_Av. Insurgentes 400A, Centro, Chilapa, Gro._");
  return lines.join("\n");
}
