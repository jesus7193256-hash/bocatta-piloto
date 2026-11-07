"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { computeStoreStatus } from "@/lib/utils";
import { MODALITIES } from "@/lib/whatsapp";

const AppContext = createContext(null);

const STORAGE_KEY = "bocatta_pedido_v1";
const STORAGE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // El pedido guardado caduca a las 24 h

// Cuando se defina el costo de envío, escribirlo aquí. Ej: "Envío $25 dentro del centro de Chilapa."
export const DELIVERY_NOTE = "El costo de envío y la cobertura se confirman por WhatsApp según tu zona.";

const EMPTY_FORM = { name: "", phone: "", address: "", payment: "Efectivo", cash: "", notes: "" };

function newCartId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [modality, setModality] = useState(MODALITIES.delivery);
  const [form, setForm] = useState(EMPTY_FORM);
  const [hydrated, setHydrated] = useState(false);

  const [store, setStore] = useState({ isOpen: true, label: "Verificando horario..." });
  const [cartOpen, setCartOpen] = useState(false);
  const [charolaOpen, setCharolaOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null); // platillo abierto en el modal
  const [toast, setToast] = useState(null);
  const [bounce, setBounce] = useState(0);
  const toastTimer = useRef(null);

  // Estado del local (hora de Chilapa). ?estado=abierto|cerrado fuerza el estado para pruebas.
  useEffect(() => {
    const force = new URLSearchParams(window.location.search).get("estado");
    const update = () => setStore(computeStoreStatus(force));
    update();
    const id = setInterval(update, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // Cargar pedido guardado
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (!data || Date.now() - data.savedAt > STORAGE_MAX_AGE_MS) {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          if (Array.isArray(data.cart)) {
            // Validar cada partida para no confiar en datos manipulados
            setCart(
              data.cart
                .filter(
                  (c) =>
                    c &&
                    typeof c.cartId === "string" &&
                    typeof c.name === "string" &&
                    Number.isFinite(c.unitPrice) &&
                    c.unitPrice >= 0 &&
                    Number.isInteger(c.quantity) &&
                    c.quantity > 0 &&
                    c.quantity <= 99
                )
                .map((c) => ({ ...c, details: typeof c.details === "string" ? c.details : "" }))
            );
          }
          if (data.form && typeof data.form === "object") {
            const f = { ...EMPTY_FORM };
            Object.keys(EMPTY_FORM).forEach((k) => {
              if (typeof data.form[k] === "string") f[k] = data.form[k];
            });
            setForm(f);
          }
          if (Object.values(MODALITIES).includes(data.modality)) setModality(data.modality);
        }
      }
    } catch (e) {
      /* datos corruptos o localStorage no disponible: se ignoran */
    }
    setHydrated(true);
  }, []);

  // Guardar pedido
  useEffect(() => {
    if (!hydrated) return;
    try {
      const hasForm = Object.entries(form).some(([k, v]) => k !== "payment" && v.trim());
      if (cart.length === 0 && !hasForm) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), cart, modality, form }));
      }
    } catch (e) {
      /* se ignora */
    }
  }, [cart, modality, form, hydrated]);

  // Bloquear el scroll de la página cuando hay una ventana abierta
  useEffect(() => {
    const anyOpen = cartOpen || charolaOpen || !!activeItem;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, charolaOpen, activeItem]);

  // Cerrar ventanas con Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setActiveItem(null);
      setCharolaOpen(false);
      setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const showToast = useCallback((message, isWarning = false) => {
    setToast({ message, isWarning });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const addToCart = useCallback((entry, { merge = false } = {}) => {
    setCart((prev) => {
      if (merge) {
        const existing = prev.find((c) => c.itemId === entry.itemId && !c.details);
        if (existing) {
          return prev.map((c) => (c === existing ? { ...c, quantity: Math.min(99, c.quantity + entry.quantity) } : c));
        }
      }
      return [...prev, { ...entry, cartId: newCartId() }];
    });
    setBounce((b) => b + 1);
  }, []);

  const changeQty = useCallback((cartId, delta) => {
    setCart((prev) =>
      prev
        .map((c) => (c.cartId === cartId ? { ...c, quantity: Math.min(99, c.quantity + delta) } : c))
        .filter((c) => c.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setForm((f) => ({ ...f, cash: "", notes: "" }));
  }, []);

  const updateForm = useCallback((field, value) => setForm((f) => ({ ...f, [field]: value })), []);

  const value = useMemo(
    () => ({
      cart,
      modality,
      setModality,
      form,
      updateForm,
      store,
      cartOpen,
      setCartOpen,
      charolaOpen,
      setCharolaOpen,
      activeItem,
      setActiveItem,
      toast,
      showToast,
      bounce,
      addToCart,
      changeQty,
      clearCart,
    }),
    [cart, modality, form, updateForm, store, cartOpen, charolaOpen, activeItem, toast, showToast, bounce, addToCart, changeQty, clearCart]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
