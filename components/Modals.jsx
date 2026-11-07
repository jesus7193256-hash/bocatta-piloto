"use client";

import { useEffect, useMemo, useState } from "react";
import { ALL_ROLLS_FOR_PLATTER, BOCATTA_WHATSAPP, COFFEE_EXTRAS } from "@/lib/menu";
import { copyToClipboard, isValidPhone, whatsappUrl } from "@/lib/utils";
import { buildOrderText, cartTotal, MODALITIES } from "@/lib/whatsapp";
import { DELIVERY_NOTE, useApp } from "./AppProvider";

export function ItemModal() {
  const { activeItem, setActiveItem, addToCart, showToast } = useApp();
  const [variantIdx, setVariantIdx] = useState(0);
  const [secondary, setSecondary] = useState("");
  const [extras, setExtras] = useState([]);
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!activeItem) return;
    setVariantIdx(0);
    setSecondary(activeItem.secondaryOptions ? activeItem.secondaryOptions[0] : "");
    setExtras([]);
    setNote("");
    setQty(1);
  }, [activeItem]);

  if (!activeItem) return null;

  const chosenVariant = activeItem.variants[variantIdx] || activeItem.variants[0];
  const extrasSum = extras.reduce((acc, e) => acc + e.price, 0);
  const unitPrice = (chosenVariant ? chosenVariant.price : activeItem.basePrice) + extrasSum;
  const finalPrice = unitPrice * qty;

  const availableExtras = activeItem.allowedExtras
    ? COFFEE_EXTRAS.filter((ex) => ex.id === "sin-extra" || activeItem.allowedExtras.includes(ex.id))
    : COFFEE_EXTRAS;

  const toggleExtra = (extraId) => {
    if (extraId === "sin-extra") {
      setExtras([]);
      return;
    }
    setExtras((prev) => {
      const exists = prev.find((e) => e.id === extraId);
      if (exists) return prev.filter((e) => e.id !== extraId);
      const found = COFFEE_EXTRAS.find((e) => e.id === extraId);
      return found ? [...prev, found] : prev;
    });
  };

  const handleConfirm = () => {
    const detailsParts = [];
    if (activeItem.variants.length > 1 && chosenVariant) {
      detailsParts.push(chosenVariant.name.replace(/\s*\(\$[0-9,]+\)/, ""));
    }
    if (secondary) {
      detailsParts.push(`${activeItem.secondaryKey || "Opción"}: ${secondary}`);
    }
    if (extras.length > 0) {
      detailsParts.push(`Extras: ${extras.map((e) => e.name).join(", ")}`);
    }
    if (note.trim()) {
      detailsParts.push(`Nota: ${note.trim()}`);
    }

    addToCart({
      itemId: activeItem.id,
      name: activeItem.name,
      details: detailsParts.join(" | "),
      unitPrice,
      quantity: qty,
    });

    const addedName = activeItem.name;
    const addedQty = qty;
    setActiveItem(null);
    showToast(`¡${addedQty}x ${addedName} agregado a tu pedido!`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-item-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveItem(null);
      }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="bg-bocatta-cream w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border-2 border-bocatta-sand overflow-hidden max-h-[90vh] flex flex-col animate-fadeIn">
        {/* Encabezado */}
        <div className="bg-bocatta-wine text-bocatta-cream p-5 flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-bocatta-red bg-bocatta-cream px-2.5 py-0.5 rounded-full">
              {activeItem.categoryLabel}
            </span>
            <h3 id="modal-item-title" className="font-serif text-2xl font-bold mt-1.5">
              {activeItem.name}
            </h3>
            <p className="text-xs text-bocatta-sand/90 mt-1 leading-relaxed">
              {activeItem.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveItem(null)}
            aria-label="Cerrar ventana"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 cursor-pointer"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>

        {/* Opciones */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-bocatta-wine">
              {activeItem.variantsLabel || "Presentación"}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {activeItem.variants.map((v, idx) => {
                const isSelected = idx === variantIdx;
                return (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => setVariantIdx(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 text-left cursor-pointer transition ${
                      isSelected
                        ? "border-bocatta-red bg-bocatta-red/10 font-bold"
                        : "border-bocatta-sand bg-white hover:border-bocatta-wine/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-bocatta-red bg-bocatta-red" : "border-bocatta-wine/40"
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                      </span>
                      <span className="text-xs text-bocatta-wine">{v.name}</span>
                    </div>
                    <span className="text-xs font-serif font-bold text-bocatta-red">${v.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {activeItem.secondaryOptions && activeItem.secondaryOptions.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-bocatta-wine">
                {activeItem.secondaryLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {activeItem.secondaryOptions.map((opt) => {
                  const isSelected = opt === secondary;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSecondary(opt)}
                      className={`p-2.5 rounded-xl border-2 text-xs text-left cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? "border-bocatta-red bg-bocatta-red text-white font-bold shadow-sm"
                          : "border-bocatta-sand bg-white text-bocatta-wine hover:border-bocatta-wine/40"
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <i className="fa-solid fa-check text-[10px]" aria-hidden="true"></i>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeItem.allowCoffeeExtras && (
            <div className="space-y-2 pt-2 border-t border-bocatta-sand">
              <label className="block text-xs font-bold uppercase tracking-wider text-bocatta-wine">
                Dale un toque diferente a tu bebida (Opcional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {availableExtras.map((ex) => {
                  const isChecked =
                    (ex.id === "sin-extra" && extras.length === 0) ||
                    extras.some((e) => e.id === ex.id);
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => toggleExtra(ex.id)}
                      className={`p-2.5 rounded-xl border-2 text-xs transition flex flex-col items-start justify-between cursor-pointer ${
                        isChecked
                          ? "border-bocatta-wine bg-bocatta-wine text-white font-bold shadow-sm"
                          : "border-bocatta-sand bg-white text-bocatta-wine hover:border-bocatta-wine/40"
                      }`}
                    >
                      <span>{ex.name}</span>
                      <span className="text-[11px] opacity-80">
                        {ex.price === 0 ? "$0" : `+$${ex.price}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-bocatta-sand">
            <label htmlFor="modal-item-note" className="block text-xs font-bold uppercase tracking-wider text-bocatta-wine mb-1">
              Nota de cocina (Opcional)
            </label>
            <input
              type="text"
              id="modal-item-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej. Sin pepino, salsa aparte, poca azúcar..."
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-bocatta-sand text-xs text-bocatta-wine focus:outline-none focus:border-bocatta-red"
            />
          </div>
        </div>

        {/* Pie */}
        <div className="p-4 bg-white border-t border-bocatta-sand flex items-center justify-between gap-4">
          <div className="flex items-center border-2 border-bocatta-sand rounded-xl bg-bocatta-cream">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Reducir cantidad"
              className="w-10 h-10 text-bocatta-wine hover:text-bocatta-red font-bold text-lg cursor-pointer"
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-sm text-bocatta-wine">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              aria-label="Aumentar cantidad"
              className="w-10 h-10 text-bocatta-wine hover:text-bocatta-red font-bold text-lg cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-bocatta-red hover:bg-bocatta-redDark text-white font-bold py-3 px-5 rounded-xl shadow-md transition flex items-center justify-between text-sm cursor-pointer"
          >
            <span>Agregar al Pedido</span>
            <span className="font-serif text-base">${finalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function CharolaModal() {
  const { charolaOpen, setCharolaOpen, addToCart, setCartOpen, showToast } = useApp();
  const [selected, setSelected] = useState([2, 3, 5, 8, 13]);

  useEffect(() => {
    if (charolaOpen) setSelected([2, 3, 5, 8, 13]);
  }, [charolaOpen]);

  if (!charolaOpen) return null;

  const sum = selected.reduce((acc, idx) => acc + (ALL_ROLLS_FOR_PLATTER[idx]?.price || 0), 0);
  const discount = Math.round(sum * 0.1);
  const finalTotal = sum - discount;

  const handleAdd = () => {
    const chosenNames = selected.map((idx) => ALL_ROLLS_FOR_PLATTER[idx].name);
    addToCart({
      itemId: "charola-5-rollos",
      name: "Charola de 5 Rollos Surtidos (-10% Desc.)",
      details: `Rollos: ${chosenNames.join(", ")} (Normal $${sum}, Ahorro -$${discount})`,
      unitPrice: finalTotal,
      quantity: 1,
    });
    setCharolaOpen(false);
    setCartOpen(true);
    showToast("¡Charola de 5 Rollos con 10% de descuento agregada!");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="charola-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) setCharolaOpen(false);
      }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="bg-bocatta-cream w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl border-2 border-bocatta-red overflow-hidden max-h-[92vh] flex flex-col animate-fadeIn">
        <div className="bg-bocatta-red text-white p-5 flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-bocatta-wine text-bocatta-sand px-2.5 py-0.5 rounded-full">
              PROMO ESPECIAL BŌCATTA (-10% DIRECTO)
            </span>
            <h3 id="charola-modal-title" className="font-serif text-2xl font-bold mt-1">
              Arma tu Charola de 5 Rollos
            </h3>
            <p className="text-xs text-white/90 mt-0.5">
              Selecciona tus 5 rollos surtidos. El sistema suma el precio exacto de cada rollo y aplica automáticamente el{" "}
              <strong>10% de descuento</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCharolaOpen(false)}
            aria-label="Cerrar ventana"
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center shrink-0 cursor-pointer"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {[0, 1, 2, 3, 4].map((slot) => (
            <div
              key={slot}
              className="bg-white p-3.5 rounded-2xl border border-bocatta-sand flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <label
                htmlFor={`charola-roll-${slot + 1}`}
                className="text-xs font-bold text-bocatta-wine flex items-center gap-2"
              >
                <span className="w-6 h-6 rounded-full bg-bocatta-red text-white flex items-center justify-center text-xs">
                  {slot + 1}
                </span>
                Rollo #{slot + 1}:
              </label>
              <select
                id={`charola-roll-${slot + 1}`}
                value={selected[slot]}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setSelected((prev) => prev.map((v, i) => (i === slot ? val : v)));
                }}
                className="flex-1 sm:max-w-xs px-3 py-2 rounded-xl bg-bocatta-cream border border-bocatta-sand text-xs font-semibold text-bocatta-wine focus:outline-none focus:border-bocatta-red"
              >
                {ALL_ROLLS_FOR_PLATTER.map((r, rIdx) => (
                  <option key={r.name} value={rIdx}>
                    {r.name} — ${r.price}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-bocatta-sand space-y-3">
          <div className="flex items-center justify-between text-xs text-bocatta-wine/80">
            <span>
              Suma normal de los 5 rollos: <strong className="line-through">${sum}</strong>
            </span>
            <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Ahorras 10%: -<span>${discount}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="w-full bg-bocatta-wine hover:bg-bocatta-wineDark text-white font-bold py-3.5 px-5 rounded-xl shadow-lg transition flex items-center justify-between text-sm cursor-pointer"
          >
            <span>
              <i className="fa-solid fa-plus-circle text-bocatta-red mr-1.5" aria-hidden="true"></i>
              Agregar Charola de 5 Rollos al Pedido
            </span>
            <span className="font-serif text-lg text-bocatta-sand">${finalTotal}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    changeQty,
    modality,
    setModality,
    form,
    updateForm,
    store,
    showToast,
  } = useApp();

  const totalCost = useMemo(() => cartTotal(cart), [cart]);
  const previewText = useMemo(
    () => buildOrderText({ cart, modality, form, storeIsOpen: store.isOpen }),
    [cart, modality, form, store.isOpen]
  );

  if (!cartOpen) return null;

  const handleSend = () => {
    if (!form.name.trim()) {
      document.getElementById("order-name")?.focus();
      showToast("Por favor escribe tu nombre para el pedido", true);
      return;
    }
    if (!isValidPhone(form.phone)) {
      document.getElementById("order-phone")?.focus();
      showToast("Escribe un teléfono válido de 10 dígitos para contactarte", true);
      return;
    }
    if (modality === MODALITIES.delivery && !form.address.trim()) {
      document.getElementById("order-address")?.focus();
      showToast("Por favor escribe tu dirección de entrega en Chilapa", true);
      return;
    }
    window.open(whatsappUrl(BOCATTA_WHATSAPP, previewText), "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    await copyToClipboard(previewText);
    showToast("Ticket de pedido copiado al portapapeles");
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title" className="fixed inset-0 z-50">
      <div onClick={() => setCartOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-bocatta-cream shadow-2xl border-l-2 border-bocatta-sand flex flex-col">
        {/* Encabezado */}
        <div className="bg-bocatta-wine text-bocatta-cream p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <i className="fa-solid fa-bag-shopping text-bocatta-red text-xl" aria-hidden="true"></i>
            <div>
              <h3 id="cart-drawer-title" className="font-serif text-xl font-bold leading-none">
                Tu Pedido en Bōcatta
              </h3>
              <p className="text-[11px] text-bocatta-sand mt-1">
                Generador de comanda rápida para WhatsApp
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Cerrar carrito"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>

        {/* Cuerpo */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div
                className="w-16 h-16 rounded-full bg-bocatta-sand/50 text-bocatta-wine mx-auto flex items-center justify-center text-2xl"
                aria-hidden="true"
              >
                🍱
              </div>
              <h4 className="font-serif text-lg font-bold text-bocatta-wine">Tu carrito está vacío</h4>
              <p className="text-xs text-bocatta-wine/70 max-w-xs mx-auto">
                Agrega tus rollos, entradas, boneless o bebidas desde el menú digital para generar tu pedido.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="bg-white p-3.5 rounded-2xl border border-bocatta-sand flex items-start justify-between gap-3 shadow-sm"
                  >
                    <div className="space-y-0.5 flex-1">
                      <h5 className="font-bold text-xs text-bocatta-wine">{item.name}</h5>
                      {item.details && (
                        <p className="text-[11px] text-bocatta-wine/70 leading-snug">{item.details}</p>
                      )}
                      <span className="text-xs font-serif font-bold text-bocatta-red block pt-1">
                        ${item.unitPrice * item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center border border-bocatta-sand rounded-xl bg-bocatta-cream">
                      <button
                        type="button"
                        onClick={() => changeQty(item.cartId, -1)}
                        aria-label={`Quitar ${item.name}`}
                        className="w-7 h-7 text-bocatta-wine hover:text-bocatta-red font-bold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-bocatta-wine">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeQty(item.cartId, 1)}
                        aria-label={`Agregar ${item.name}`}
                        className="w-7 h-7 text-bocatta-wine hover:text-bocatta-red font-bold text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t-2 border-dashed border-bocatta-sand">
                <h4 className="font-serif text-base font-bold text-bocatta-wine flex items-center gap-2">
                  <i className="fa-solid fa-motorcycle text-bocatta-red" aria-hidden="true"></i> Datos de Entrega y Pago
                </h4>

                {!store.isOpen && (
                  <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-xl p-3 text-[11px] leading-relaxed flex items-start gap-2">
                    <i className="fa-regular fa-clock mt-0.5" aria-hidden="true"></i>
                    <span>
                      Estamos cerrados en este momento (horario: Martes a Domingo, 5:30 PM a 10:00 PM). Puedes dejar tu pedido listo y te lo confirmamos por WhatsApp cuando abramos.
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-1.5 bg-bocatta-sand/50 p-1 rounded-xl text-xs font-bold">
                  {[
                    { key: MODALITIES.delivery, label: "Domicilio" },
                    { key: MODALITIES.pickup, label: "Recoger" },
                    { key: MODALITIES.dinein, label: "En Local" },
                  ].map((m) => {
                    const active = modality === m.key;
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setModality(m.key)}
                        className={`py-2 px-2 rounded-lg transition cursor-pointer ${
                          active
                            ? "bg-bocatta-red text-white shadow"
                            : "text-bocatta-wine hover:bg-white/50"
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor="order-name" className="block text-[11px] font-bold uppercase text-bocatta-wine mb-1">
                        Tu Nombre *
                      </label>
                      <input
                        type="text"
                        id="order-name"
                        value={form.name}
                        onChange={(e) => updateForm("name", e.target.value)}
                        placeholder="Ej. Carlos Hernández"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-bocatta-sand text-xs focus:outline-none focus:border-bocatta-red"
                      />
                    </div>
                    <div>
                      <label htmlFor="order-phone" className="block text-[11px] font-bold uppercase text-bocatta-wine mb-1">
                        Teléfono de Contacto *
                      </label>
                      <input
                        type="tel"
                        id="order-phone"
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        placeholder="Ej. 756 100 0000"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-bocatta-sand text-xs focus:outline-none focus:border-bocatta-red"
                      />
                    </div>
                  </div>

                  {modality === MODALITIES.delivery && (
                    <div>
                      <label htmlFor="order-address" className="block text-[11px] font-bold uppercase text-bocatta-wine mb-1">
                        Dirección completa y Referencias (Chilapa) *
                      </label>
                      <textarea
                        id="order-address"
                        rows={2}
                        value={form.address}
                        onChange={(e) => updateForm("address", e.target.value)}
                        placeholder="Calle, número, barrio/colonia y referencias de fachada..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-bocatta-sand text-xs focus:outline-none focus:border-bocatta-red"
                      ></textarea>
                      <p className="text-[11px] text-bocatta-wine/70 mt-1.5 flex items-start gap-1.5">
                        <i className="fa-solid fa-motorcycle text-bocatta-red mt-0.5" aria-hidden="true"></i>
                        <span>{DELIVERY_NOTE}</span>
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor="order-payment" className="block text-[11px] font-bold uppercase text-bocatta-wine mb-1">
                        Método de Pago
                      </label>
                      <select
                        id="order-payment"
                        value={form.payment}
                        onChange={(e) => updateForm("payment", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-bocatta-sand text-xs focus:outline-none focus:border-bocatta-red"
                      >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia">Transferencia</option>
                      </select>
                    </div>
                    {form.payment === "Efectivo" && (
                      <div>
                        <label htmlFor="order-cash-amount" className="block text-[11px] font-bold uppercase text-bocatta-wine mb-1">
                          ¿Con cuánto pagas?
                        </label>
                        <input
                          type="text"
                          id="order-cash-amount"
                          value={form.cash}
                          onChange={(e) => updateForm("cash", e.target.value)}
                          placeholder="Ej. Billete de $500 / Exacto"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-bocatta-sand text-xs focus:outline-none focus:border-bocatta-red"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="order-general-notes" className="block text-[11px] font-bold uppercase text-bocatta-wine mb-1">
                      Notas Generales de Cocina (Opcional)
                    </label>
                    <input
                      type="text"
                      id="order-general-notes"
                      value={form.notes}
                      onChange={(e) => updateForm("notes", e.target.value)}
                      placeholder="Ej. Incluir palillos para 3 personas, salsa soya extra..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-bocatta-sand text-xs focus:outline-none focus:border-bocatta-red"
                    />
                  </div>
                </div>

                {/* Vista previa del ticket */}
                <div className="bg-white p-3.5 rounded-2xl border border-bocatta-sand space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-bocatta-red">
                      Ticket listo para WhatsApp:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="text-[11px] text-bocatta-wine hover:text-bocatta-red font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <i className="fa-regular fa-copy" aria-hidden="true"></i> Copiar
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-[11px] text-bocatta-wine/90 bg-bocatta-creamLight p-2.5 rounded-xl border border-bocatta-sand/60 max-h-40 overflow-y-auto leading-relaxed">
                    {previewText}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pie del carrito */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-bocatta-sand space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-bocatta-wine/70">
                Total Estimado del Pedido:
              </span>
              <span className="font-serif text-2xl font-extrabold text-bocatta-red">${totalCost}</span>
            </div>

            <button
              type="button"
              onClick={handleSend}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <i className="fa-brands fa-whatsapp text-lg" aria-hidden="true"></i>
              Enviar Pedido a Bōcatta (756 115 9334)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
