"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TopModeSwitchBar } from "@/components/Chrome";
import { CATEGORIES } from "@/lib/menu";
import {
  createOrderInDb,
  fetchAdminDashboard,
  updateMenuItemInDb,
  updateOrderStatusInDb,
  updateReservationStatusInDb,
  updateStoreSettingsInDb,
} from "@/lib/supabase";
import { normalizeText, whatsappUrl } from "@/lib/utils";

const ORDER_STATUSES = [
  { id: "recibido", label: "Recibido", badge: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "preparando", label: "Preparando", badge: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "listo", label: "Listo", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "entregado", label: "Entregado", badge: "bg-stone-200 text-stone-700 border-stone-300" },
  { id: "cancelado", label: "Cancelado", badge: "bg-red-100 text-red-800 border-red-300" },
];

const RESV_STATUSES = [
  { id: "pendiente", label: "Pendiente", badge: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "confirmada", label: "Confirmada", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "completada", label: "Completada", badge: "bg-stone-200 text-stone-700 border-stone-300" },
  { id: "cancelada", label: "Cancelada", badge: "bg-red-100 text-red-800 border-red-300" },
];

function cleanPhoneForWa(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 10) return `52${digits}`;
  return digits || "527561159334";
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState("orders");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [settings, setSettings] = useState({
    status_mode: "auto",
    delivery_fee: 0,
    delivery_note: "El costo de envío y la cobertura se confirman por WhatsApp según tu zona.",
  });

  // Filtros
  const [orderFilter, setOrderFilter] = useState("activos");
  const [menuCatFilter, setMenuCatFilter] = useState("todos");
  const [menuSearch, setMenuSearch] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminDashboard();
      setOrders(data.orders);
      setReservations(data.reservations);
      setMenuItems(data.menuItems);
      setSettings(data.settings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
    const id = setInterval(loadAll, 20000);
    return () => clearInterval(id);
  }, [loadAll]);

  // Métricas rápidas
  const metrics = useMemo(() => {
    const activeOrders = orders.filter((o) =>
      ["recibido", "preparando", "listo"].includes(o.status)
    ).length;
    const revenue = orders
      .filter((o) => o.status !== "cancelado")
      .reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const pendingRes = reservations.filter((r) => r.status === "pendiente").length;
    const availableCount = menuItems.filter((m) => m.isAvailable !== false).length;
    return { activeOrders, revenue, pendingRes, availableCount, totalMenu: menuItems.length };
  }, [orders, reservations, menuItems]);

  const filteredOrders = useMemo(() => {
    if (orderFilter === "todos") return orders;
    if (orderFilter === "activos") {
      return orders.filter((o) => ["recibido", "preparando", "listo"].includes(o.status));
    }
    return orders.filter((o) => o.status === orderFilter);
  }, [orders, orderFilter]);

  const filteredMenu = useMemo(() => {
    const q = normalizeText(menuSearch.trim());
    return menuItems.filter((item) => {
      const matchCat = menuCatFilter === "todos" || item.category === menuCatFilter;
      const matchQ =
        !q ||
        normalizeText(item.name).includes(q) ||
        normalizeText(item.description).includes(q) ||
        normalizeText(item.categoryLabel).includes(q);
      return matchCat && matchQ;
    });
  }, [menuItems, menuCatFilter, menuSearch]);

  // Acciones de Pedidos
  const handleOrderStatus = async (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    try {
      await updateOrderStatusInDb(orderId, nextStatus);
      notify(`Comanda actualizada a: ${nextStatus.toUpperCase()}`);
    } catch (e) {
      notify("Error al actualizar el estado en la base de datos");
    }
  };

  const handleSimulateOrder = async () => {
    const demoSamples = [
      {
        customerName: "Fernanda Tapia (Demo)",
        customerPhone: "756 140 9921",
        modality: "Pedido a Domicilio",
        address: "Calle Morelos #48, Centro, Chilapa",
        paymentMethod: "Efectivo",
        cashAmount: "Billete de $500",
        notes: "Sin pepino en el rollo por favor",
        cart: [
          { name: "Dragon roll", details: "", unitPrice: 120, quantity: 1 },
          { name: "Alitas (Orden 6 piezas)", details: "Salsa: BBQ", unitPrice: 150, quantity: 1 },
          { name: "Soda Italiana", details: "Mora azul | Extras: Perlas explosivas", unitPrice: 60, quantity: 1 },
        ],
        total: 330,
      },
      {
        customerName: "Diego Salgado (Demo)",
        customerPhone: "756 111 7280",
        modality: "Pasar a Recoger (Pick-up)",
        address: null,
        paymentMethod: "Transferencia",
        cashAmount: null,
        notes: "Paso en 15 minutos",
        cart: [
          { name: "Spicy mexican roll", details: "", unitPrice: 130, quantity: 2 },
          { name: "Ice Lattes", details: "Biscoff", unitPrice: 80, quantity: 1 },
        ],
        total: 340,
      },
    ];
    const sample = demoSamples[Math.floor(Math.random() * demoSamples.length)];
    try {
      const created = await createOrderInDb(sample);
      if (created) {
        setOrders((prev) => [created, ...prev]);
        notify(`¡Nueva comanda #${created.folio} recibida en tiempo real!`);
      }
    } catch (e) {
      notify("No se pudo crear la comanda de prueba");
    }
  };

  // Acciones de Reservaciones
  const handleResvStatus = async (resId, nextStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status: nextStatus } : r))
    );
    try {
      await updateReservationStatusInDb(resId, nextStatus);
      notify(`Reservación marcada como: ${nextStatus.toUpperCase()}`);
    } catch (e) {
      notify("Error al actualizar la reservación");
    }
  };

  // Acciones de Menú
  const handleToggleAvailable = async (item) => {
    const nextVal = !item.isAvailable;
    setMenuItems((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, isAvailable: nextVal } : m))
    );
    try {
      await updateMenuItemInDb(item.id, { is_available: nextVal });
      notify(
        `${item.name}: ${nextVal ? "Disponible en el menú" : "Marcado como AGOTADO"}`
      );
    } catch (e) {
      notify("Error al cambiar disponibilidad");
    }
  };

  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    const patch = {
      name: editingItem.name.trim(),
      description: editingItem.description.trim(),
      badge: editingItem.badge ? editingItem.badge.trim() : null,
      base_price: Number(editingItem.basePrice) || 0,
      price_display: editingItem.priceDisplay.trim(),
      variants: editingItem.variants,
      is_available: editingItem.isAvailable !== false,
    };

    try {
      const updated = await updateMenuItemInDb(editingItem.id, patch);
      if (updated) {
        setMenuItems((prev) =>
          prev.map((m) => (m.id === updated.id ? updated : m))
        );
      }
      setEditingItem(null);
      notify("¡Platillo y precios actualizados en vivo!");
    } catch (err) {
      notify("Error al guardar cambios del platillo");
    }
  };

  // Acciones de Configuración del Local
  const handleSaveSettings = async (patch) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    try {
      await updateStoreSettingsInDb({
        status_mode: next.status_mode,
        delivery_fee: Number(next.delivery_fee) || 0,
        delivery_note: next.delivery_note,
      });
      notify("¡Configuración de la tienda actualizada en vivo!");
    } catch (err) {
      notify("Error al guardar configuración");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bocatta-cream text-bocatta-wine">
      <TopModeSwitchBar mode="admin" />

      {/* Encabezado del Admin */}
      <header className="bg-bocatta-wine text-bocatta-cream border-b-4 border-bocatta-red shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-bocatta-red text-white flex items-center justify-center font-serif font-extrabold text-2xl shadow">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-bocatta-red text-white px-2.5 py-0.5 rounded-full">
                  PANEL ADMINISTRATIVO
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Supabase en vivo
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold mt-0.5">
                Bōcatta · Centro de Control
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadAll}
              className="bg-white/10 hover:bg-white/20 text-bocatta-cream text-xs font-bold px-3.5 py-2.5 rounded-xl border border-white/15 transition flex items-center gap-1.5 cursor-pointer"
            >
              <i className={`fa-solid fa-rotate ${loading ? "animate-spin" : ""}`} aria-hidden="true"></i>
              Actualizar
            </button>
            <Link
              href="/"
              className="bg-bocatta-cream text-bocatta-wine hover:bg-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-bocatta-red" aria-hidden="true"></i>
              Ver Menú de Clientes
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Tarjetas de métricas */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border-2 border-bocatta-sand shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-bocatta-wine/60">
              <span>Comandas Activas</span>
              <i className="fa-solid fa-fire-burner text-bocatta-red text-base" aria-hidden="true"></i>
            </div>
            <div className="font-serif text-3xl font-extrabold text-bocatta-wine mt-1">
              {metrics.activeOrders}
            </div>
            <p className="text-[11px] text-bocatta-wine/60 mt-0.5">
              En cocina o listas para entregar
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-bocatta-sand shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-bocatta-wine/60">
              <span>Ventas Registradas</span>
              <i className="fa-solid fa-sack-dollar text-emerald-600 text-base" aria-hidden="true"></i>
            </div>
            <div className="font-serif text-3xl font-extrabold text-emerald-700 mt-1">
              ${metrics.revenue}
            </div>
            <p className="text-[11px] text-bocatta-wine/60 mt-0.5">
              Total acumulado de pedidos ({orders.length})
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-bocatta-sand shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-bocatta-wine/60">
              <span>Reservas Pendientes</span>
              <i className="fa-regular fa-calendar-check text-bocatta-red text-base" aria-hidden="true"></i>
            </div>
            <div className="font-serif text-3xl font-extrabold text-bocatta-wine mt-1">
              {metrics.pendingRes}
            </div>
            <p className="text-[11px] text-bocatta-wine/60 mt-0.5">
              De {reservations.length} solicitudes totales
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-bocatta-sand shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-bocatta-wine/60">
              <span>Platillos Activos</span>
              <i className="fa-solid fa-utensils text-bocatta-red text-base" aria-hidden="true"></i>
            </div>
            <div className="font-serif text-3xl font-extrabold text-bocatta-wine mt-1">
              {metrics.availableCount} <span className="text-base font-normal text-bocatta-wine/50">/ {metrics.totalMenu}</span>
            </div>
            <p className="text-[11px] text-bocatta-wine/60 mt-0.5">
              Disponibles en el menú digital
            </p>
          </div>
        </section>

        {/* Navegación de pestañas del Admin */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bocatta-sand pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "orders", label: "Comandas / Pedidos", icon: "fa-receipt", count: metrics.activeOrders },
              { id: "menu", label: "Editar Menú y Precios", icon: "fa-utensils", count: metrics.totalMenu },
              { id: "reservations", label: "Reservaciones", icon: "fa-calendar-check", count: reservations.length },
              { id: "settings", label: "Horario y Envío", icon: "fa-sliders" },
            ].map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                    active
                      ? "bg-bocatta-red text-white shadow-md"
                      : "bg-white text-bocatta-wine hover:bg-bocatta-sand/60 border border-bocatta-sand"
                  }`}
                >
                  <i className={`fa-solid ${t.icon}`} aria-hidden="true"></i>
                  <span>{t.label}</span>
                  {t.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 text-[11px] rounded-full font-extrabold ${
                        active ? "bg-bocatta-wine text-white" : "bg-bocatta-sand text-bocatta-wine"
                      }`}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {tab === "orders" && (
            <button
              type="button"
              onClick={handleSimulateOrder}
              className="bg-bocatta-wine hover:bg-bocatta-wineDark text-bocatta-cream text-xs font-bold px-4 py-2.5 rounded-full shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-bolt text-bocatta-red" aria-hidden="true"></i>
              Simular Pedido Entrante
            </button>
          )}
        </div>

        {/* ================= PESTAÑA 1: PEDIDOS ================= */}
        {tab === "orders" && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "activos", label: "Activos en cocina" },
                { id: "recibido", label: "Recibidos" },
                { id: "preparando", label: "En preparación" },
                { id: "listo", label: "Listos" },
                { id: "entregado", label: "Entregados" },
                { id: "todos", label: "Todos" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setOrderFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    orderFilter === f.id
                      ? "bg-bocatta-wine text-white"
                      : "bg-white border border-bocatta-sand text-bocatta-wine hover:bg-bocatta-sand/50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-bocatta-sand p-12 text-center space-y-3">
                <i className="fa-solid fa-kitchen-set text-3xl text-bocatta-red/70" aria-hidden="true"></i>
                <h3 className="font-serif text-xl font-bold">No hay comandas en este filtro</h3>
                <p className="text-xs text-bocatta-wine/70 max-w-md mx-auto">
                  Haz un pedido desde la vista de usuario o presiona &quot;Simular Pedido Entrante&quot; para probar el flujo en tiempo real.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrders.map((o) => {
                  const st =
                    ORDER_STATUSES.find((s) => s.id === o.status) || ORDER_STATUSES[0];
                  const waReadyMsg = `*¡Hola ${o.customer_name}!* Te escribimos de *Bōcatta Food Spot* 🍣.\nTu comanda *#${o.folio}* (${o.modality}) ya está *${st.label.toUpperCase()}*. ¡Gracias por tu preferencia!`;

                  return (
                    <article
                      key={o.id}
                      className="bg-white rounded-2xl p-5 border-2 border-bocatta-sand shadow-sm flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-serif text-lg font-extrabold text-bocatta-red">
                              Comanda #{o.folio}
                            </span>
                            <h3 className="font-bold text-sm text-bocatta-wine">
                              {o.customer_name} ·{" "}
                              <span className="font-normal text-bocatta-wine/80">
                                {o.customer_phone}
                              </span>
                            </h3>
                            <p className="text-[11px] font-semibold text-bocatta-wine/70 mt-0.5">
                              {o.modality} · Pago: {o.payment_method}
                              {o.cash_amount ? ` (${o.cash_amount})` : ""}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full border ${st.badge}`}
                          >
                            {st.label}
                          </span>
                        </div>

                        {o.address && (
                          <div className="bg-bocatta-cream p-2.5 rounded-xl text-xs text-bocatta-wine flex items-start gap-2">
                            <i
                              className="fa-solid fa-location-dot text-bocatta-red mt-0.5"
                              aria-hidden="true"
                            ></i>
                            <span>{o.address}</span>
                          </div>
                        )}

                        <ul className="space-y-1.5 border-y border-bocatta-sand py-2.5 text-xs">
                          {(o.items || []).map((it, idx) => (
                            <li key={idx} className="flex items-start justify-between gap-2">
                              <div>
                                <strong>
                                  {it.quantity}x {it.name}
                                </strong>
                                {it.details && (
                                  <span className="block text-[11px] text-bocatta-wine/70">
                                    ↳ {it.details}
                                  </span>
                                )}
                              </div>
                              <span className="font-serif font-bold text-bocatta-wine shrink-0">
                                ${it.unitPrice * it.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {o.notes && (
                          <p className="text-xs bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2 rounded-xl">
                            <strong>Nota de cocina:</strong> {o.notes}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2.5 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase text-bocatta-wine/60">
                            Total de la comanda:
                          </span>
                          <span className="font-serif text-xl font-extrabold text-bocatta-red">
                            ${o.total} MXN
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {ORDER_STATUSES.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleOrderStatus(o.id, s.id)}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                                o.status === s.id
                                  ? "bg-bocatta-wine text-white shadow"
                                  : "bg-bocatta-cream hover:bg-bocatta-sand text-bocatta-wine"
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}

                          <a
                            href={whatsappUrl(cleanPhoneForWa(o.customer_phone), waReadyMsg)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                          >
                            <i className="fa-brands fa-whatsapp" aria-hidden="true"></i> Avisar al cliente
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ================= PESTAÑA 2: EDITOR DE MENÚ Y PRECIOS ================= */}
        {tab === "menu" && (
          <section className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-bocatta-sand flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setMenuCatFilter(c.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      menuCatFilter === c.id
                        ? "bg-bocatta-red text-white"
                        : "bg-bocatta-cream text-bocatta-wine hover:bg-bocatta-sand"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="relative md:w-72">
                <i
                  className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-bocatta-wine/50 text-xs"
                  aria-hidden="true"
                ></i>
                <input
                  type="search"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Buscar platillo a editar..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-bocatta-cream border border-bocatta-sand text-xs focus:outline-none focus:border-bocatta-red"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-4 border-2 transition flex flex-col justify-between gap-3 ${
                    item.isAvailable === false
                      ? "border-stone-300 opacity-75"
                      : "border-bocatta-sand"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-bocatta-red">
                        {item.categoryLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleAvailable(item)}
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full cursor-pointer transition ${
                          item.isAvailable !== false
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                        }`}
                      >
                        {item.isAvailable !== false ? "● Disponible" : "○ Agotado"}
                      </button>
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif font-bold text-base text-bocatta-wine">
                        {item.name}
                      </h3>
                      <span className="font-serif font-extrabold text-sm text-bocatta-red shrink-0">
                        {item.priceDisplay}
                      </span>
                    </div>
                    <p className="text-xs text-bocatta-wine/70 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-bocatta-sand/70 flex items-center justify-between">
                    <span className="text-[11px] text-bocatta-wine/60">
                      Base: ${item.basePrice} · {item.variants?.length || 0} var.
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingItem(JSON.parse(JSON.stringify(item)))
                      }
                      className="bg-bocatta-wine hover:bg-bocatta-wineDark text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-pen-to-square" aria-hidden="true"></i>
                      Editar Precio / Datos
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= PESTAÑA 3: RESERVACIONES ================= */}
        {tab === "reservations" && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reservations.map((r) => {
              const st =
                RESV_STATUSES.find((s) => s.id === r.status) || RESV_STATUSES[0];
              const confirmMsg = `*¡Hola ${r.customer_name}!* Te saludamos de *Bōcatta Food Spot* 🥂.\nConfirmamos tu reservación *#R-${r.folio}* para *${r.guests}* el día *${r.reservation_date}* a las *${r.reservation_time}* (${r.occasion}). ¡Te esperamos en Av. Insurgentes 400A!`;

              return (
                <article
                  key={r.id}
                  className="bg-white rounded-2xl p-5 border-2 border-bocatta-sand shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-serif text-lg font-extrabold text-bocatta-red">
                          Reserva #R-{r.folio}
                        </span>
                        <h3 className="font-bold text-sm text-bocatta-wine">
                          {r.customer_name} · {r.customer_phone}
                        </h3>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${st.badge}`}
                      >
                        {st.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-bocatta-cream p-3 rounded-xl text-xs">
                      <div>
                        <span className="block text-[10px] uppercase text-bocatta-wine/60 font-bold">
                          Fecha
                        </span>
                        <strong>{r.reservation_date}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-bocatta-wine/60 font-bold">
                          Hora
                        </span>
                        <strong>{r.reservation_time}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-bocatta-wine/60 font-bold">
                          Mesa
                        </span>
                        <strong>{r.guests}</strong>
                      </div>
                    </div>

                    <p className="text-xs text-bocatta-wine">
                      <strong>Ocasión:</strong> {r.occasion}
                    </p>
                    {r.notes && (
                      <p className="text-xs bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2 rounded-xl">
                        <strong>Notas:</strong> {r.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-bocatta-sand">
                    {RESV_STATUSES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleResvStatus(r.id, s.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                          r.status === s.id
                            ? "bg-bocatta-wine text-white shadow"
                            : "bg-bocatta-cream hover:bg-bocatta-sand text-bocatta-wine"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}

                    <a
                      href={whatsappUrl(cleanPhoneForWa(r.customer_phone), confirmMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                    >
                      <i className="fa-brands fa-whatsapp" aria-hidden="true"></i> Confirmar por WA
                    </a>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* ================= PESTAÑA 4: HORARIO Y ENVÍO ================= */}
        {tab === "settings" && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-bocatta-sand max-w-2xl space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-bocatta-wine">
                Estado del Local y Envío a Domicilio
              </h2>
              <p className="text-xs text-bocatta-wine/70 mt-1">
                Cualquier cambio aquí se refleja inmediatamente en la pantalla de todos los clientes.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-bocatta-wine">
                Estado de Apertura del Restaurante
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: "auto",
                    title: "Automático (Hora Chilapa)",
                    desc: "Mar-Dom 5:30 PM a 10:00 PM",
                  },
                  {
                    id: "open",
                    title: "Forzar Abierto Ahora",
                    desc: "Muestra 'Abierto ahora' a todos",
                  },
                  {
                    id: "closed",
                    title: "Forzar Cerrado",
                    desc: "Activa aviso de pre-orden",
                  },
                ].map((opt) => {
                  const active = settings.status_mode === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSaveSettings({ status_mode: opt.id })}
                      className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer ${
                        active
                          ? "border-bocatta-red bg-bocatta-red/10"
                          : "border-bocatta-sand hover:border-bocatta-wine/40"
                      }`}
                    >
                      <div className="font-bold text-xs text-bocatta-wine">{opt.title}</div>
                      <div className="text-[11px] text-bocatta-wine/70 mt-0.5">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-bocatta-sand">
              <div>
                <label
                  htmlFor="admin-delivery-fee"
                  className="block text-xs font-bold uppercase tracking-wider text-bocatta-wine mb-1"
                >
                  Costo de Envío Fijo ($ MXN)
                </label>
                <input
                  id="admin-delivery-fee"
                  type="number"
                  min={0}
                  value={settings.delivery_fee}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, delivery_fee: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bocatta-cream border border-bocatta-sand text-sm font-bold"
                />
                <p className="text-[11px] text-bocatta-wine/60 mt-1">
                  Pon 0 si se confirma por zona en WhatsApp.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="admin-delivery-note"
                  className="block text-xs font-bold uppercase tracking-wider text-bocatta-wine mb-1"
                >
                  Nota de Envío y Cobertura (visible en el carrito)
                </label>
                <input
                  id="admin-delivery-note"
                  type="text"
                  value={settings.delivery_note}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, delivery_note: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bocatta-cream border border-bocatta-sand text-xs"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSaveSettings({})}
              className="bg-bocatta-red hover:bg-bocatta-redDark text-white font-bold px-6 py-3 rounded-xl shadow transition text-sm cursor-pointer"
            >
              Guardar Configuración de Tienda
            </button>
          </section>
        )}
      </main>

      {/* MODAL PARA EDITAR PLATILLO Y PRECIOS */}
      {editingItem && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingItem(null);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <form
            onSubmit={handleSaveMenuItem}
            className="bg-bocatta-cream w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border-2 border-bocatta-sand overflow-hidden max-h-[90vh] flex flex-col animate-fadeIn"
          >
            <div className="bg-bocatta-wine text-bocatta-cream p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-bocatta-red text-white px-2.5 py-0.5 rounded-full">
                  EDITOR DE CARTA EN VIVO
                </span>
                <h3 className="font-serif text-xl font-bold mt-1">{editingItem.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-bocatta-wine mb-1">
                    Nombre del Platillo
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem((it) => ({ ...it, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-bocatta-sand"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-bocatta-wine mb-1">
                    Insignia / Etiqueta (Opcional)
                  </label>
                  <input
                    type="text"
                    value={editingItem.badge || ""}
                    onChange={(e) =>
                      setEditingItem((it) => ({ ...it, badge: e.target.value }))
                    }
                    placeholder="Ej. Favorito, Picante, Top Grill"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-bocatta-sand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-bocatta-wine mb-1">
                    Precio Base ($ MXN)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingItem.basePrice}
                    onChange={(e) =>
                      setEditingItem((it) => ({
                        ...it,
                        basePrice: Number(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-bocatta-sand font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-bocatta-wine mb-1">
                    Texto de Precio en Tarjeta
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.priceDisplay}
                    onChange={(e) =>
                      setEditingItem((it) => ({ ...it, priceDisplay: e.target.value }))
                    }
                    placeholder="Ej. $120 o $70 - $110"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-bocatta-sand font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-bocatta-wine mb-1">
                  Descripción / Ingredientes
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem((it) => ({ ...it, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-bocatta-sand"
                ></textarea>
              </div>

              {Array.isArray(editingItem.variants) && editingItem.variants.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-bocatta-sand">
                  <label className="block font-bold uppercase text-bocatta-wine">
                    Variantes y Precios Individuales
                  </label>
                  {editingItem.variants.map((v, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingItem((it) => ({
                            ...it,
                            variants: it.variants.map((vv, i) =>
                              i === idx ? { ...vv, name: val } : vv
                            ),
                          }));
                        }}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-bocatta-sand"
                      />
                      <div className="flex items-center gap-1">
                        <span className="font-bold">$</span>
                        <input
                          type="number"
                          min={0}
                          value={v.price}
                          onChange={(e) => {
                            const price = Number(e.target.value) || 0;
                            setEditingItem((it) => ({
                              ...it,
                              variants: it.variants.map((vv, i) =>
                                i === idx ? { ...vv, price } : vv
                              ),
                            }));
                          }}
                          className="w-20 px-2.5 py-1.5 rounded-xl bg-white border border-bocatta-sand font-bold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-bocatta-sand flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2.5 rounded-xl bg-bocatta-cream text-bocatta-wine font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-bocatta-red hover:bg-bocatta-redDark text-white font-bold text-xs shadow cursor-pointer"
              >
                Guardar Cambios en Supabase
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 bg-bocatta-wine text-bocatta-cream px-4 py-3 rounded-2xl shadow-2xl border-2 border-bocatta-red flex items-center gap-2.5 text-xs font-bold"
        >
          <i className="fa-solid fa-circle-check text-emerald-400 text-base" aria-hidden="true"></i>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
