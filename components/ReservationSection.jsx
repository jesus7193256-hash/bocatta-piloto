"use client";

import { useEffect, useMemo, useState } from "react";
import { BOCATTA_WHATSAPP } from "@/lib/menu";
import { createReservationInDb } from "@/lib/supabase";
import { copyToClipboard, getChilapaNow, isValidPhone, whatsappUrl } from "@/lib/utils";
import { buildReservationText } from "@/lib/whatsapp";
import { useApp } from "./AppProvider";

function computeDefaultDate() {
  const today = getChilapaNow();
  const d = new Date(today.year, today.month - 1, today.day);
  d.setDate(d.getDate() + 1);
  if (d.getDay() === 1) d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function ReservationSection() {
  const { showToast } = useApp();
  const [minDate, setMinDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [res, setRes] = useState({
    name: "",
    phone: "",
    date: "",
    time: "7:30 PM",
    guests: "4 personas",
    occasion: "Cena casual",
    notes: "",
  });

  useEffect(() => {
    const def = computeDefaultDate();
    setMinDate(def);
    setRes((r) => ({ ...r, date: def }));
  }, []);

  const isMonday = useMemo(() => {
    if (!res.date) return false;
    const [y, m, d] = res.date.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.getDay() === 1;
  }, [res.date]);

  const previewText = useMemo(() => buildReservationText(res), [res]);

  const update = (field, value) => setRes((r) => ({ ...r, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isMonday) {
      showToast("Recuerda que los lunes Bōcatta permanece cerrado. Elige de Martes a Domingo.", true);
      return;
    }
    if (!isValidPhone(res.phone)) {
      showToast("Escribe un teléfono válido de 10 dígitos para confirmar tu reservación", true);
      return;
    }

    setSubmitting(true);
    let finalMsg = previewText;
    try {
      const saved = await createReservationInDb(res);
      if (saved?.folio) {
        finalMsg = `*Folio de Reservación: #R-${saved.folio}*\n` + previewText;
        showToast(`¡Reservación #R-${saved.folio} registrada en el sistema!`);
      }
    } catch (err) {
      /* si falla la red, igual abre WhatsApp */
    } finally {
      setSubmitting(false);
    }

    window.open(whatsappUrl(BOCATTA_WHATSAPP, finalMsg), "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    await copyToClipboard(previewText);
    showToast("Solicitud de reservación copiada al portapapeles");
  };

  return (
    <section id="reservas-section" className="bg-bocatta-wine text-bocatta-cream py-12 border-t-4 border-bocatta-red">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-5">
            <span className="inline-block bg-bocatta-red text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Reservaciones Sin Espera
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold leading-tight">
              Reserva tu Mesa o Celebra en Bōcatta
            </h2>
            <p className="text-bocatta-sand text-sm leading-relaxed">
              Asegura tu lugar de <strong>Martes a Domingo (5:30 PM a 10:00 PM)</strong>. Ya sea para cenar con amigos, festejar un cumpleaños o vivir nuestras tardes de pintura.
            </p>

            <div className="space-y-3 pt-2">
              <div className="bg-bocatta-wineDark/90 p-4 rounded-2xl border border-white/10 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-bocatta-red/20 border border-bocatta-red text-bocatta-sand flex items-center justify-center text-lg shrink-0">
                  <i className="fa-solid fa-palette" aria-hidden="true"></i>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-bocatta-cream">Día Creativo / Paintings</h3>
                  <p className="text-xs text-bocatta-sand/80 mt-0.5">
                    Reserva tu experiencia de pintura acompañada de tus rollos y bebidas favoritas. Ideal para parejas o grupos de amigos.
                  </p>
                </div>
              </div>

              <div className="bg-bocatta-wineDark/90 p-4 rounded-2xl border border-white/10 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-bocatta-red/20 border border-bocatta-red text-bocatta-sand flex items-center justify-center text-lg shrink-0">
                  <i className="fa-solid fa-cake-candles" aria-hidden="true"></i>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-bocatta-cream">Cumpleaños &amp; Festejos</h3>
                  <p className="text-xs text-bocatta-sand/80 mt-0.5">
                    Preparamos tu mesa para tu celebración. Indícanos cuántas personas asisten y si deseas agregar postre.
                  </p>
                </div>
              </div>

              <div className="bg-bocatta-wineDark/90 p-4 rounded-2xl border border-white/10 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-bocatta-red/20 border border-bocatta-red text-bocatta-sand flex items-center justify-center text-lg shrink-0">
                  <i className="fa-solid fa-champagne-glasses" aria-hidden="true"></i>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-bocatta-cream">Cita Especial / Ustedes 2.0</h3>
                  <p className="text-xs text-bocatta-sand/80 mt-0.5">
                    Mesa especial para dos acompañada de nuestra selección de vinos, coctelería o café de especialidad.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-bocatta-creamLight text-bocatta-wine rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-bocatta-sand">
            <div className="flex items-center justify-between border-b border-bocatta-sand pb-4 mb-5">
              <div>
                <h3 className="font-serif text-2xl font-bold text-bocatta-wine">Solicitud de Reservación</h3>
                <p className="text-xs text-bocatta-wine/70">
                  Se registra automáticamente en el Panel Admin y se confirma por WhatsApp
                </p>
              </div>
              <i className="fa-brands fa-whatsapp text-3xl text-emerald-600" aria-hidden="true"></i>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="res-name" className="block text-xs font-bold uppercase tracking-wider text-bocatta-wine mb-1">
                    Tu Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="res-name"
                    required
                    value={res.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Ej. Valeria Morales"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-bocatta-sand text-sm focus:outline-none focus:border-bocatta-red"
                  />
                </div>
                <div>
                  <label htmlFor="res-phone" className="block text-xs font-bold uppercase tracking-wider text-bocatta-wine mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="res-phone"
                    required
                    value={res.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="Ej. 756 100 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-bocatta-sand text-sm focus:outline-none focus:border-bocatta-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="res-date" className="block text-xs font-bold uppercase tracking-wider text-bocatta-wine mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    id="res-date"
                    required
                    min={minDate}
                    value={res.date}
                    onChange={(e) => update("date", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-bocatta-sand text-sm focus:outline-none focus:border-bocatta-red"
                  />
                  {isMonday && (
                    <p className="text-[11px] text-bocatta-red font-semibold mt-1">
                      Los lunes permanecemos cerrados.
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="res-time" className="block text-xs font-bold uppercase tracking-wider text-bocatta-wine mb-1">
                    Hora (5:30 - 9:30 PM) *
                  </label>
                  <select
                    id="res-time"
                    required
                    value={res.time}
                    onChange={(e) => update("time", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-bocatta-sand text-sm focus:outline-none focus:border-bocatta-red"
                  >
                    <option value="5:30 PM">5:30 PM (Apertura)</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="6:30 PM">6:30 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="7:30 PM">7:30 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="8:30 PM">8:30 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                    <option value="9:30 PM">9:30 PM (Última reserva)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="res-guests" className="block text-xs font-bold uppercase tracking-wider text-bocatta-wine mb-1">
                    N° de Personas *
                  </label>
                  <select
                    id="res-guests"
                    required
                    value={res.guests}
                    onChange={(e) => update("guests", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-bocatta-sand text-sm focus:outline-none focus:border-bocatta-red"
                  >
                    <option value="2 personas">2 personas (Pareja)</option>
                    <option value="3 personas">3 personas</option>
                    <option value="4 personas">4 personas</option>
                    <option value="5 personas">5 personas</option>
                    <option value="6 personas">6 personas</option>
                    <option value="7 a 10 personas (Grupo)">7 a 10 personas (Grupo)</option>
                    <option value="Más de 10 personas (Evento)">Más de 10 personas (Evento)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="res-occasion" className="block text-xs font-bold uppercase tracking-wider text-bocatta-wine mb-1">
                    Ocasión / Experiencia
                  </label>
                  <select
                    id="res-occasion"
                    value={res.occasion}
                    onChange={(e) => update("occasion", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-bocatta-sand text-sm focus:outline-none focus:border-bocatta-red"
                  >
                    <option value="Cena casual">Cena casual</option>
                    <option value="Cumpleaños">Cumpleaños</option>
                    <option value="Día Creativo / Paintings">Día Creativo / Paintings</option>
                    <option value="Cita Especial (Ustedes 2.0)">Cita Especial (Ustedes 2.0 🥂)</option>
                    <option value="Reunión grupal">Reunión grupal</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="res-notes" className="block text-xs font-bold uppercase tracking-wider text-bocatta-wine mb-1">
                    Notas o Petición Especial
                  </label>
                  <input
                    type="text"
                    id="res-notes"
                    value={res.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    placeholder="Ej. Mesa cerca de terraza, postre de cumple..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-bocatta-sand text-sm focus:outline-none focus:border-bocatta-red"
                  />
                </div>
              </div>

              <div className="bg-bocatta-cream p-3.5 rounded-2xl border border-bocatta-sand text-xs space-y-1">
                <div className="flex items-center justify-between text-bocatta-wine/70 font-semibold">
                  <span>Vista previa del mensaje a enviar:</span>
                  <span className="text-[11px] text-emerald-700">
                    <i className="fa-solid fa-check-double" aria-hidden="true"></i> Formato limpio
                  </span>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-bocatta-wine leading-relaxed text-xs pt-1">
                  {previewText}
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-bocatta-red hover:bg-bocatta-redDark disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <i className="fa-brands fa-whatsapp text-lg" aria-hidden="true"></i>
                  {submitting ? "Registrando reservación..." : "Confirmar Reservación por WhatsApp"}
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="bg-bocatta-sand/60 hover:bg-bocatta-sand text-bocatta-wine font-semibold py-3.5 px-4 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <i className="fa-regular fa-copy" aria-hidden="true"></i> Copiar Texto
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
