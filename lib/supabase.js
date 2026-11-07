import { MENU_ITEMS } from "./menu";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mtwavuisqocksxtasukf.supabase.co";
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_3xqLhRJaQQl6yThPHxbjAA_WZBB-W7O";

function headers(extra = {}) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

// Convierte una fila de public.menu_items al formato usado por los componentes
export function rowToMenuItem(r) {
  return {
    id: r.id,
    category: r.category,
    categoryLabel: r.category_label,
    name: r.name,
    badge: r.badge || undefined,
    icon: r.icon || undefined,
    description: r.description,
    basePrice: r.base_price,
    priceDisplay: r.price_display,
    variantsLabel: r.variants_label || undefined,
    variants: Array.isArray(r.variants) ? r.variants : [],
    secondaryLabel: r.secondary_label || undefined,
    secondaryKey: r.secondary_key || undefined,
    secondaryOptions: Array.isArray(r.secondary_options) ? r.secondary_options : undefined,
    allowCoffeeExtras: Boolean(r.allow_coffee_extras),
    allowedExtras: Array.isArray(r.allowed_extras) ? r.allowed_extras : undefined,
    isMatcha: Boolean(r.is_matcha),
    isCharolaTrigger: Boolean(r.is_charola_trigger),
    isAvailable: r.is_available !== false,
    sortOrder: r.sort_order || 0,
  };
}

export async function fetchStoreData() {
  try {
    const [menuRes, settingsRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/menu_items?select=*&order=sort_order.asc`, {
        headers: headers(),
        cache: "no-store",
      }),
      fetch(`${SUPABASE_URL}/rest/v1/store_settings?id=eq.1&select=*`, {
        headers: headers(),
        cache: "no-store",
      }),
    ]);

    const menuRows = menuRes.ok ? await menuRes.json() : null;
    const settingsRows = settingsRes.ok ? await settingsRes.json() : null;

    return {
      menuItems:
        Array.isArray(menuRows) && menuRows.length > 0
          ? menuRows.map(rowToMenuItem)
          : MENU_ITEMS.map((m) => ({ ...m, isAvailable: true })),
      settings:
        Array.isArray(settingsRows) && settingsRows[0]
          ? settingsRows[0]
          : {
              status_mode: "auto",
              delivery_fee: 0,
              delivery_note:
                "El costo de envío y la cobertura se confirman por WhatsApp según tu zona.",
            },
    };
  } catch (e) {
    return {
      menuItems: MENU_ITEMS.map((m) => ({ ...m, isAvailable: true })),
      settings: {
        status_mode: "auto",
        delivery_fee: 0,
        delivery_note:
          "El costo de envío y la cobertura se confirman por WhatsApp según tu zona.",
      },
    };
  }
}

export async function createOrderInDb({
  customerName,
  customerPhone,
  modality,
  address,
  paymentMethod,
  cashAmount,
  notes,
  cart,
  total,
}) {
  const payload = {
    customer_name: customerName.trim(),
    customer_phone: customerPhone.trim(),
    modality,
    address: address ? address.trim() : null,
    payment_method: paymentMethod,
    cash_amount: cashAmount ? cashAmount.trim() : null,
    notes: notes ? notes.trim() : null,
    items: cart.map((c) => ({
      itemId: c.itemId || null,
      name: c.name,
      details: c.details || "",
      unitPrice: Number(c.unitPrice) || 0,
      quantity: Number(c.quantity) || 1,
    })),
    total: Number(total) || 0,
    status: "recibido",
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: "POST",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("No se pudo registrar el pedido en la base de datos");
  }
  const rows = await res.json();
  return rows?.[0] || null;
}

export async function createReservationInDb({
  name,
  phone,
  date,
  time,
  guests,
  occasion,
  notes,
}) {
  const payload = {
    customer_name: name.trim(),
    customer_phone: phone.trim(),
    reservation_date: date,
    reservation_time: time,
    guests,
    occasion,
    notes: notes ? notes.trim() : null,
    status: "pendiente",
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
    method: "POST",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("No se pudo registrar la reservación en la base de datos");
  }
  const rows = await res.json();
  return rows?.[0] || null;
}

export async function fetchOrdersByPhone(phone) {
  const clean = phone.trim();
  if (!clean) return [];
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/orders?customer_phone=ilike.*${encodeURIComponent(
      clean
    )}*&select=*&order=created_at.desc&limit=20`,
    { headers: headers(), cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

// ================= FUNCIONES DEL PANEL ADMIN =================

export async function fetchAdminDashboard() {
  const [ordersRes, resvRes, menuRes, settingsRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc&limit=100`, {
      headers: headers(),
      cache: "no-store",
    }),
    fetch(
      `${SUPABASE_URL}/rest/v1/reservations?select=*&order=reservation_date.asc,created_at.desc&limit=100`,
      {
        headers: headers(),
        cache: "no-store",
      }
    ),
    fetch(`${SUPABASE_URL}/rest/v1/menu_items?select=*&order=sort_order.asc`, {
      headers: headers(),
      cache: "no-store",
    }),
    fetch(`${SUPABASE_URL}/rest/v1/store_settings?id=eq.1&select=*`, {
      headers: headers(),
      cache: "no-store",
    }),
  ]);

  const [orders, reservations, menuRows, settingsRows] = await Promise.all([
    ordersRes.ok ? ordersRes.json() : [],
    resvRes.ok ? resvRes.json() : [],
    menuRes.ok ? menuRes.json() : [],
    settingsRes.ok ? settingsRes.json() : [],
  ]);

  return {
    orders: Array.isArray(orders) ? orders : [],
    reservations: Array.isArray(reservations) ? reservations : [],
    menuItems: Array.isArray(menuRows) ? menuRows.map(rowToMenuItem) : [],
    settings:
      Array.isArray(settingsRows) && settingsRows[0]
        ? settingsRows[0]
        : {
            status_mode: "auto",
            delivery_fee: 0,
            delivery_note:
              "El costo de envío y la cobertura se confirman por WhatsApp según tu zona.",
          },
  };
}

export async function updateOrderStatusInDb(id, status) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error("Error al actualizar el pedido");
  const rows = await res.json();
  return rows?.[0];
}

export async function updateReservationStatusInDb(id, status) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/reservations?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: headers({ Prefer: "return=representation" }),
      body: JSON.stringify({ status }),
    }
  );
  if (!res.ok) throw new Error("Error al actualizar la reservación");
  const rows = await res.json();
  return rows?.[0];
}

export async function updateMenuItemInDb(id, patch) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/menu_items?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error("Error al actualizar el platillo");
  const rows = await res.json();
  return rows?.[0] ? rowToMenuItem(rows[0]) : null;
}

export async function updateStoreSettingsInDb(patch) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/store_settings?id=eq.1`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error("Error al guardar la configuración");
  const rows = await res.json();
  return rows?.[0];
}
