"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "./AppProvider";
import { cartTotal } from "@/lib/whatsapp";

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function TopModeSwitchBar({ mode = "client" }) {
  return (
    <div className="bg-bocatta-wineDark text-bocatta-cream text-xs py-2 px-4 border-b border-bocatta-wine/60">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-bocatta-red text-white">
            <i className="fa-solid fa-database mr-1" aria-hidden="true"></i> CONECTADO EN VIVO
          </span>
          <span className="opacity-90 hidden sm:inline">
            Sistema Bōcatta Food Spot · Base de datos en la nube (Supabase + Vercel)
          </span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto bg-bocatta-wine p-1 rounded-full border border-bocatta-sand/20">
          <Link
            href="/"
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 ${
              mode === "client"
                ? "bg-bocatta-red text-white shadow"
                : "text-bocatta-sand hover:text-white"
            }`}
          >
            <i className="fa-solid fa-utensils" aria-hidden="true"></i>
            Modo Usuario
          </Link>
          <Link
            href="/admin"
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 ${
              mode === "admin"
                ? "bg-bocatta-red text-white shadow"
                : "text-bocatta-sand hover:text-white"
            }`}
          >
            <i className="fa-solid fa-sliders" aria-hidden="true"></i>
            Modo Admin
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { cart, setCartOpen, setCharolaOpen, setMyOrdersOpen, bounce } = useApp();
  const [animate, setAnimate] = useState(false);
  const count = cart.reduce((a, c) => a + c.quantity, 0);
  const total = cartTotal(cart);

  useEffect(() => {
    if (!bounce) return;
    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 400);
    return () => clearTimeout(t);
  }, [bounce]);

  return (
    <>
      <TopModeSwitchBar mode="client" />
      <header className="sticky top-0 z-30 bg-bocatta-cream/95 backdrop-blur-md border-b border-bocatta-sand shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-3 group" aria-label="Bōcatta Food Spot, inicio">
            <div className="w-11 h-11 rounded-full bg-bocatta-wine text-bocatta-cream flex flex-col items-center justify-center border-2 border-bocatta-red shadow-sm group-hover:scale-105 transition">
              <span className="font-serif font-extrabold text-lg leading-none text-bocatta-red">B</span>
              <span className="text-[8px] tracking-widest uppercase text-bocatta-sand mt-0.5">20.26</span>
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-bocatta-red leading-none block">
                Bōcatta
              </span>
              <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-bocatta-wine block mt-0.5">
                FOOD SPOT · CHILAPA
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-bocatta-wine" aria-label="Principal">
            <a href="#menu-section" className="hover:text-bocatta-red transition flex items-center gap-1.5">
              <i className="fa-solid fa-utensils text-bocatta-red text-xs" aria-hidden="true"></i> Menú Digital
            </a>
            <button
              type="button"
              onClick={() => setCharolaOpen(true)}
              className="hover:text-bocatta-red transition flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-layer-group text-bocatta-red text-xs" aria-hidden="true"></i> Charola 5 Rollos (-10%)
            </button>
            <a href="#reservas-section" className="hover:text-bocatta-red transition flex items-center gap-1.5">
              <i className="fa-regular fa-calendar-check text-bocatta-red text-xs" aria-hidden="true"></i> Reservaciones
            </a>
            <button
              type="button"
              onClick={() => setMyOrdersOpen(true)}
              className="hover:text-bocatta-red transition flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-receipt text-bocatta-red text-xs" aria-hidden="true"></i> Mis Pedidos
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMyOrdersOpen(true)}
              title="Ver estado de mis pedidos"
              className="md:hidden inline-flex items-center gap-1.5 bg-white border border-bocatta-sand text-bocatta-wine px-3 py-2.5 rounded-full text-xs font-semibold shadow-sm cursor-pointer"
            >
              <i className="fa-solid fa-receipt text-bocatta-red" aria-hidden="true"></i>
              <span>Estado</span>
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Abrir pedido: ${count} artículos, $${total}`}
              className={`relative inline-flex items-center gap-2.5 bg-bocatta-wine hover:bg-bocatta-wineDark text-bocatta-cream px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-md transition cursor-pointer ${
                animate ? "animate-cart-bounce" : ""
              }`}
            >
              <i className="fa-solid fa-bag-shopping text-bocatta-red" aria-hidden="true"></i>
              <span>Pedido</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-bocatta-red text-white font-bold">
                {count}
              </span>
              <span className="hidden sm:inline font-serif text-bocatta-sand border-l border-bocatta-sand/30 pl-2">
                ${total}
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export function Hero() {
  const { store, setCharolaOpen } = useApp();
  return (
    <section className="relative bg-bocatta-red text-bocatta-cream overflow-hidden border-b-4 border-bocatta-wine">
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-bocatta-wine/20 pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-bocatta-wine/15 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div
              role="status"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bocatta-wine/90 text-bocatta-cream text-xs sm:text-sm font-medium shadow-sm border border-white/15"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  store.isOpen ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
                aria-hidden="true"
              ></span>
              <span>{store.label}</span>
            </div>

            <div className="space-y-2">
              <p className="uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold text-bocatta-sand">
                ESTD. 20.26 · CHILAPA DE ÁLVAREZ, GRO.
              </p>
              <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight leading-none text-bocatta-cream">
                Sushi, Alitas, Café de Especialidad &amp; Drinks
              </h1>
            </div>

            <p className="text-bocatta-cream/90 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explora nuestro menú interactivo sin hacer zoom en imágenes. Personaliza tus rollos, elige las salsas de tus boneless o agenda tu mesa y envía tu pedido listo en segundos por WhatsApp.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                type="button"
                onClick={() => scrollToSection("menu-section")}
                className="inline-flex items-center gap-2 bg-bocatta-cream text-bocatta-wine hover:bg-white font-bold px-5 py-3.5 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 text-sm cursor-pointer"
              >
                <i className="fa-solid fa-book-open text-bocatta-red" aria-hidden="true"></i> Ordenar Ahora
              </button>
              <button
                type="button"
                onClick={() => setCharolaOpen(true)}
                className="inline-flex items-center gap-2 bg-bocatta-wineDark hover:bg-black text-bocatta-cream font-bold px-5 py-3.5 rounded-2xl shadow-lg border border-bocatta-sand/30 transition text-sm cursor-pointer"
              >
                <i className="fa-solid fa-layer-group text-bocatta-red" aria-hidden="true"></i> Armar Charola (-10%)
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("reservas-section")}
                className="inline-flex items-center gap-2 bg-bocatta-wine hover:bg-bocatta-wineDark text-bocatta-cream font-semibold px-5 py-3.5 rounded-2xl shadow-md border border-bocatta-cream/20 transition text-sm cursor-pointer"
              >
                <i className="fa-regular fa-calendar-check" aria-hidden="true"></i> Reservar Mesa
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-bocatta-cream/90">
              <span className="flex items-center gap-1.5">
                <i className="fa-regular fa-clock text-bocatta-sand" aria-hidden="true"></i> Mar - Dom: 5:30 PM a 10:00 PM
              </span>
              <span className="hidden sm:inline" aria-hidden="true">
                •
              </span>
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-motorcycle text-bocatta-sand" aria-hidden="true"></i> Servicio a domicilio y Pick-up
              </span>
              <span className="hidden sm:inline" aria-hidden="true">
                •
              </span>
              <span className="flex items-center gap-1.5">
                <i className="fa-brands fa-whatsapp text-bocatta-sand" aria-hidden="true"></i> 756 115 9334
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-bocatta-wine rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-bocatta-sand/20 relative">
              <div
                className="-top-5 -right-3 sm:-right-5 absolute w-24 h-24 rounded-full bg-bocatta-cream text-bocatta-red flex flex-col items-center justify-center rotate-12 shadow-xl border-4 border-dashed border-bocatta-red"
                aria-hidden="true"
              >
                <span className="text-[8px] font-bold tracking-widest text-bocatta-wine">ESTD.20.26</span>
                <span className="font-serif font-extrabold text-3xl leading-none">B</span>
                <span className="text-[8px] font-bold tracking-widest text-bocatta-wine">FOOD SPOT</span>
              </div>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-bocatta-red/30 border border-bocatta-red text-bocatta-sand text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  🔥 Promoción Especial para Compartir
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-bocatta-cream leading-tight">
                  Charola de 5 Rollos Surtidos
                </h2>
                <p className="text-xs sm:text-sm text-bocatta-sand/90 leading-relaxed">
                  Elige tus 5 rollos favoritos de nuestra barra (Especiales o Empanizados) y obtén automáticamente un{" "}
                  <strong>10% de descuento sobre el total</strong> de tu charola.
                </p>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {[
                    { icon: "fa-star", name: "Monkey Roll", sub: "Plátano & Anguila" },
                    { icon: "fa-leaf", name: "Avocado Roll", sub: "Camarón Emp." },
                    { icon: "fa-pepper-hot", name: "Spicy Mexican", sub: "Arrachera & Tocino" },
                  ].map((r) => (
                    <div
                      key={r.name}
                      className="bg-bocatta-wineDark/80 p-3 rounded-2xl border border-white/10 text-center"
                    >
                      <div className="text-xl mb-1.5 text-bocatta-red">
                        <i className={`fa-solid ${r.icon}`} aria-hidden="true"></i>
                      </div>
                      <div className="text-xs font-bold text-bocatta-cream">{r.name}</div>
                      <div className="text-[10px] text-bocatta-sand">{r.sub}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setCharolaOpen(true)}
                  className="w-full bg-bocatta-red hover:bg-bocatta-redDark text-white font-bold py-3 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Armar mi Charola de 5 Rollos (-10%)
                </button>
                <p className="text-[11px] text-center text-bocatta-sand/70 italic">
                  *10% de descuento directo sobre el total de los 5 rollos (no aplica con otras promociones).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FloatingCartBar() {
  const { cart, setCartOpen } = useApp();
  if (cart.length === 0) return null;
  const count = cart.reduce((a, c) => a + c.quantity, 0);
  return (
    <div className="fixed bottom-4 inset-x-4 z-30 max-w-lg mx-auto">
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="w-full bg-bocatta-wine hover:bg-bocatta-wineDark text-bocatta-cream p-4 rounded-2xl shadow-2xl border-2 border-bocatta-red flex items-center justify-between transition transform active:scale-95 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-bocatta-red text-white font-extrabold flex items-center justify-center text-sm">
            {count}
          </div>
          <div className="text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-bocatta-sand">
              Ver mi pedido listo
            </div>
            <div className="text-[11px] opacity-80">
              Haz clic para revisar y enviar por WhatsApp
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-serif font-extrabold text-lg text-white">${cartTotal(cart)}</span>
          <i
            className="fa-solid fa-chevron-right text-bocatta-red bg-bocatta-cream w-7 h-7 rounded-full flex items-center justify-center text-xs"
            aria-hidden="true"
          ></i>
        </div>
      </button>
    </div>
  );
}

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-16 right-4 z-[60] max-w-sm bg-bocatta-wine text-bocatta-cream px-4 py-3 rounded-2xl shadow-2xl border-2 border-bocatta-red flex items-center gap-3"
    >
      <i
        className={
          toast.isWarning
            ? "fa-solid fa-triangle-exclamation text-amber-400 text-lg"
            : "fa-solid fa-circle-check text-emerald-400 text-lg"
        }
        aria-hidden="true"
      ></i>
      <span className="text-xs font-semibold">{toast.message}</span>
    </div>
  );
}

export function Footer() {
  return (
    <footer id="ubicacion-section" className="bg-bocatta-wineDark text-bocatta-cream pt-12 pb-24 md:pb-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-bocatta-red flex items-center justify-center font-serif font-bold text-xl text-white">
                B
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-bocatta-cream leading-none">Bōcatta</h3>
                <p className="text-[10px] tracking-[0.25em] uppercase text-bocatta-sand mt-0.5">
                  FOOD SPOT · ESTD. 20.26
                </p>
              </div>
            </div>
            <p className="text-xs text-bocatta-sand/80 leading-relaxed">
              El punto de encuentro en Chilapa para amantes del sushi, boneless, café de especialidad, matcha ceremonial y coctelería de autor.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/bocatta.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-bocatta-red px-3 py-1.5 rounded-full text-xs transition"
              >
                <i className="fa-brands fa-instagram" aria-hidden="true"></i> @bocatta.ch
              </a>
              <a
                href="https://wa.me/527561159334"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600 px-3 py-1.5 rounded-full text-xs transition"
              >
                <i className="fa-brands fa-whatsapp" aria-hidden="true"></i> 756 115 9334
              </a>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <h4 className="font-serif text-base font-bold text-bocatta-red uppercase tracking-wider">
              Ubicación y Horario
            </h4>
            <p className="flex items-start gap-2 text-bocatta-sand">
              <i className="fa-solid fa-location-dot text-bocatta-red mt-1" aria-hidden="true"></i>
              <span>
                <strong>Av. Insurgentes 400A</strong>, Esquina con Av. Revolución, Col. Centro, Chilapa de Álvarez, Guerrero.
              </span>
            </p>
            <p className="flex items-start gap-2 text-bocatta-sand">
              <i className="fa-regular fa-clock text-bocatta-red mt-1" aria-hidden="true"></i>
              <span>
                <strong>Martes a Domingo:</strong> 5:30 PM a 10:00 PM
                <br />
                <span className="opacity-70">Lunes: Cerrado por descanso</span>
              </span>
            </p>
            <p className="flex items-start gap-2 text-bocatta-sand">
              <i className="fa-solid fa-phone text-bocatta-red mt-1" aria-hidden="true"></i>
              <span>
                Pedidos y Reservaciones: <strong>756 115 9334</strong>
              </span>
            </p>
          </div>

          <div className="bg-bocatta-wine p-4 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-bocatta-sand font-semibold">
                Referencia Rápida
              </span>
              <h5 className="font-bold text-sm text-white mt-0.5">Centro de Chilapa, Gro.</h5>
              <p className="text-xs text-bocatta-sand/80 mt-1">
                Esquina Av. Insurgentes 400A con Av. Revolución.
              </p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Av.+Insurgentes+400A+Chilapa+Guerrero"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-bocatta-cream text-bocatta-wine hover:bg-white font-bold py-2.5 px-4 rounded-xl text-xs text-center transition flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-map-location-dot text-bocatta-red" aria-hidden="true"></i> Abrir en Google Maps
            </a>
          </div>
        </div>

        <div className="pt-6 space-y-4 text-xs text-bocatta-sand/60">
          <p className="text-center text-[11px] font-semibold text-bocatta-sand/80 uppercase tracking-wider">
            Prohibida la venta de bebidas alcohólicas a menores de edad · Evita el exceso
          </p>

          <details className="bg-white/5 rounded-xl border border-white/10 px-4 py-3 group">
            <summary className="cursor-pointer font-semibold text-bocatta-sand/80 hover:text-bocatta-cream list-none flex items-center justify-between">
              <span>
                <i className="fa-solid fa-shield-halved mr-1.5" aria-hidden="true"></i> Aviso de Privacidad
              </span>
              <i
                className="fa-solid fa-chevron-down text-[10px] transition group-open:rotate-180"
                aria-hidden="true"
              ></i>
            </summary>
            <div className="pt-3 space-y-2 leading-relaxed text-bocatta-sand/70">
              <p>
                <strong>Bōcatta Food Spot</strong>, con domicilio en Av. Insurgentes 400A, Col. Centro, Chilapa de Álvarez, Guerrero, es responsable del uso de tus datos personales.
              </p>
              <p>
                <strong>Datos que solicitamos:</strong> nombre, teléfono y, en pedidos a domicilio, dirección de entrega.
              </p>
              <p>
                <strong>Finalidad:</strong> preparar, dar seguimiento y entregar tu pedido o confirmar tu reservación. No vendemos ni compartimos tus datos con terceros.
              </p>
              <p>
                <strong>Almacenamiento:</strong> los datos de tu pedido o reservación se registran en nuestra base de datos de comandas y se envían a nuestro WhatsApp oficial cuando confirmas tu solicitud.
              </p>
              <p>
                <strong>Derechos ARCO:</strong> puedes solicitar el acceso, rectificación, cancelación u oposición al uso de tus datos escribiendo al WhatsApp 756 115 9334.
              </p>
            </div>
          </details>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 Bōcatta Food Spot. Todos los derechos reservados.</p>
            <Link href="/admin" className="hover:text-bocatta-cream underline">
              Acceso Panel Administrativo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
