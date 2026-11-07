"use client";

import { useState, useMemo } from "react";
import { CATEGORIES } from "@/lib/menu";
import { normalizeText } from "@/lib/utils";
import { useApp } from "./AppProvider";

export function MenuSection() {
  const { menuItems, setActiveItem, setCharolaOpen, addToCart, showToast } = useApp();
  const [currentCategory, setCurrentCategory] = useState("todos");
  const [searchInput, setSearchInput] = useState("");

  const searchQuery = useMemo(() => normalizeText(searchInput.trim()), [searchInput]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCat = currentCategory === "todos" || item.category === currentCategory;
      const matchesSearch =
        !searchQuery ||
        normalizeText(item.name).includes(searchQuery) ||
        normalizeText(item.description).includes(searchQuery) ||
        normalizeText(item.categoryLabel).includes(searchQuery) ||
        (item.variants && item.variants.some((v) => normalizeText(v.name).includes(searchQuery)));
      return matchesCat && matchesSearch;
    });
  }, [menuItems, currentCategory, searchQuery]);

  const showsAlcohol = useMemo(
    () => filteredItems.some((item) => item.category === "bar-cocteleria"),
    [filteredItems]
  );

  const showCoffeeBanner = currentCategory === "cafeteria-matcha" || currentCategory === "todos";

  const handleQuickAdd = (item) => {
    if (item.isAvailable === false) {
      showToast("Este platillo está agotado temporalmente", true);
      return;
    }
    const hasMultipleChoices =
      item.variants.length > 1 ||
      (item.secondaryOptions && item.secondaryOptions.length > 0) ||
      item.allowCoffeeExtras;
    if (hasMultipleChoices) {
      setActiveItem(item);
      return;
    }
    const defaultVariant = item.variants[0] || { name: item.name, price: item.basePrice };
    addToCart(
      {
        itemId: item.id,
        name: item.name,
        details: "",
        unitPrice: defaultVariant.price,
        quantity: 1,
      },
      { merge: true }
    );
    showToast(`¡1x ${item.name} ($${defaultVariant.price}) agregado al pedido!`);
  };

  return (
    <main id="menu-section" className="max-w-6xl mx-auto px-4 py-10 flex-1 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-bocatta-red">
            Carta Oficial Interactiva
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-bocatta-wine">
            Nuestro Menú
          </h2>
        </div>

        <div className="relative w-full md:w-80">
          <i
            className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-bocatta-wine/50 text-sm"
            aria-hidden="true"
          ></i>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Buscar en el menú"
            placeholder="Buscar rollo, matcha, boneless, camarón..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border-2 border-bocatta-sand rounded-2xl text-sm text-bocatta-wine placeholder-bocatta-wine/40 focus:outline-none focus:border-bocatta-red shadow-sm transition"
          />
          {searchInput.length > 0 && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-bocatta-wine/50 hover:text-bocatta-red"
            >
              <i className="fa-solid fa-circle-xmark" aria-hidden="true"></i>
            </button>
          )}
        </div>
      </div>

      <div className="sticky top-[68px] z-20 bg-bocatta-cream/95 backdrop-blur-sm py-3 -mx-4 px-4 mb-6 border-b border-bocatta-sand">
        <div
          role="tablist"
          aria-label="Categorías del menú"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === currentCategory;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setCurrentCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-bocatta-red text-white shadow-md scale-[1.02]"
                    : "bg-white text-bocatta-wine hover:bg-bocatta-sand/60 border border-bocatta-sand"
                }`}
              >
                <i className={`fa-solid ${cat.icon}`} aria-hidden="true"></i>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showCoffeeBanner && (
        <div className="mb-6 bg-bocatta-wine text-bocatta-cream rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md border border-bocatta-red/40">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl bg-bocatta-red/20 border border-bocatta-red flex items-center justify-center text-2xl shrink-0"
              aria-hidden="true"
            >
              🍵
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-bocatta-sand">
                What&apos;s Matcha? · Té Verde Japonés Grado Ceremonial
              </span>
              <h3 className="font-serif font-bold text-lg">
                Dale un toque diferente a tu bebida fría o frappé
              </h3>
              <p className="text-xs text-bocatta-sand/90">
                Al elegir tu bebida puedes agregar: <strong>Cold foam (+$5)</strong>,{" "}
                <strong>Perlas explosivas (+$10)</strong> o <strong>Escarchado (+$10)</strong>.
              </p>
            </div>
          </div>
          <span className="text-xs bg-bocatta-red text-white px-3 py-1.5 rounded-full font-semibold shrink-0">
            More Espresso, Less Depresso
          </span>
        </div>
      )}

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            if (item.isCharolaTrigger) {
              return (
                <article
                  key={item.id}
                  className="bg-bocatta-wine text-bocatta-cream rounded-2xl p-5 shadow-md hover:shadow-xl border-2 border-bocatta-red transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-bocatta-sand">
                        {item.categoryLabel}
                      </span>
                      <span className="bg-bocatta-red text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-2 pb-2">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-bocatta-cream leading-snug">
                        {item.name}
                      </h3>
                      <span className="flex-1 border-b-2 border-dotted border-bocatta-sand/40 mx-1"></span>
                      <span className="font-serif text-lg font-extrabold text-bocatta-sand shrink-0">
                        {item.priceDisplay}
                      </span>
                    </div>

                    <p className="text-xs text-bocatta-sand/90 leading-relaxed mt-1 mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-medium text-bocatta-sand/80">
                      Elige tus 5 rollos favoritos
                    </span>
                    <button
                      type="button"
                      onClick={() => setCharolaOpen(true)}
                      className="bg-bocatta-red hover:bg-bocatta-redDark text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition shrink-0 cursor-pointer active:scale-95"
                    >
                      Armar Charola (-10%)
                    </button>
                  </div>
                </article>
              );
            }

            const hasMultipleChoices =
              item.variants.length > 1 ||
              (item.secondaryOptions && item.secondaryOptions.length > 0) ||
              item.allowCoffeeExtras;
            const isMatchaCard = item.isMatcha === true;
            const isOut = item.isAvailable === false;

            return (
              <article
                key={item.id}
                className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl border-2 ${
                  isOut
                    ? "border-bocatta-sand/60 opacity-65"
                    : isMatchaCard
                    ? "border-bocatta-matcha/50 hover:border-bocatta-matcha"
                    : "border-bocatta-sand/90 hover:border-bocatta-red"
                } transition flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-[0.15em] ${
                        isMatchaCard ? "text-bocatta-matcha" : "text-bocatta-red"
                      }`}
                    >
                      {item.categoryLabel}
                    </span>
                    {isOut ? (
                      <span className="shrink-0 bg-stone-500 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        Agotado
                      </span>
                    ) : (
                      item.badge && (
                        <span
                          className={`shrink-0 ${
                            isMatchaCard
                              ? "bg-bocatta-matcha text-white"
                              : "bg-bocatta-wine text-bocatta-cream"
                          } text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full`}
                        >
                          {item.badge}
                        </span>
                      )
                    )}
                  </div>

                  <div className="flex items-baseline justify-between gap-2 pb-2">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-bocatta-wine leading-snug">
                      {item.name}
                    </h3>
                    <span
                      className={`flex-1 border-b-2 border-dotted ${
                        isMatchaCard ? "border-bocatta-matcha/40" : "border-bocatta-red/40"
                      } mx-1`}
                    ></span>
                    <span
                      className={`font-serif text-lg font-extrabold ${
                        isMatchaCard ? "text-bocatta-matcha" : "text-bocatta-red"
                      } shrink-0`}
                    >
                      {item.priceDisplay}
                    </span>
                  </div>

                  <p className="text-xs text-bocatta-wine/80 leading-relaxed mt-1 mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-bocatta-sand/70 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-bocatta-wine/60 truncate">
                    {isOut
                      ? "No disponible por ahora"
                      : item.variants.length > 1
                      ? `${item.variants.length} opciones a elegir`
                      : item.secondaryOptions
                      ? "Elige salsa / proteína"
                      : item.allowCoffeeExtras
                      ? "Personalizable"
                      : "Listo para ordenar"}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isOut ? (
                      <span className="text-xs font-bold text-stone-500 px-3 py-1.5 bg-stone-100 rounded-xl">
                        Agotado
                      </span>
                    ) : hasMultipleChoices ? (
                      <button
                        type="button"
                        onClick={() => setActiveItem(item)}
                        className={`${
                          isMatchaCard
                            ? "bg-bocatta-matcha hover:bg-bocatta-wine"
                            : "bg-bocatta-red hover:bg-bocatta-redDark"
                        } text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition cursor-pointer active:scale-95`}
                      >
                        Personalizar
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveItem(item)}
                          title="Agregar nota de cocina o cambiar cantidad"
                          className="bg-bocatta-cream hover:bg-bocatta-sand text-bocatta-wine border border-bocatta-sand text-[11px] font-semibold px-2.5 py-2 rounded-xl transition cursor-pointer active:scale-95"
                        >
                          Notas
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item)}
                          className="bg-bocatta-red hover:bg-bocatta-redDark text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition cursor-pointer active:scale-95"
                        >
                          + Agregar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-14 bg-bocatta-creamLight rounded-3xl border-2 border-dashed border-bocatta-sand my-4">
          <div className="text-4xl mb-3 text-bocatta-red/70">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          </div>
          <h3 className="font-serif text-xl font-bold text-bocatta-wine mb-1">
            No encontramos platillos con esa búsqueda
          </h3>
          <p className="text-sm text-bocatta-wine/70 mb-4">
            Intenta buscar otro ingrediente como &quot;camarón&quot;, &quot;mango&quot;, &quot;matcha&quot; o &quot;alitas&quot;.
          </p>
          <button
            type="button"
            onClick={() => setSearchInput("")}
            className="bg-bocatta-red text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-bocatta-redDark transition cursor-pointer"
          >
            Ver todo el menú
          </button>
        </div>
      )}

      {showsAlcohol && (
        <p className="mt-6 text-center text-[11px] font-semibold uppercase tracking-wider text-bocatta-wine/70">
          <i className="fa-solid fa-circle-exclamation text-bocatta-red mr-1" aria-hidden="true"></i>
          Prohibida la venta de bebidas alcohólicas a menores de edad · Evita el exceso
        </p>
      )}
    </main>
  );
}
