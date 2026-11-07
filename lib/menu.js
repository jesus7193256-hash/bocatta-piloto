export const BOCATTA_WHATSAPP = "527561159334";

// Salsas oficiales para Alitas y Boneless
export const SAUCES_LIST = [
  "BBQ",
  "Mango habanero",
  "Tamarindo habanero",
  "Piña habanero",
  "Búfalo",
  "Honey mostaza"
];

// Extras oficiales para bebidas de cafetería / frappés / matcha
export const COFFEE_EXTRAS = [
  { id: "sin-extra", name: "Sin extra", price: 0 },
  { id: "cold-foam", name: "Cold foam", price: 5 },
  { id: "perlas", name: "Perlas explosivas", price: 10 },
  { id: "escarchado", name: "Escarchado", price: 10 }
];

// Lista de todos los rollos individuales para la Charola de 5 Rollos
export const ALL_ROLLS_FOR_PLATTER = [
  { name: "California especial (Normal)", price: 110 },
  { name: "California especial (Empanizado)", price: 120 },
  { name: "Avocado roll", price: 115 },
  { name: "Monkey roll", price: 120 },
  { name: "Inroll", price: 120 },
  { name: "Dragon roll", price: 120 },
  { name: "Kani roll", price: 125 },
  { name: "Sunset roll", price: 125 },
  { name: "Crispy roll (Empanizado)", price: 115 },
  { name: "Tropicoco roll (Empanizado)", price: 120 },
  { name: "Dorito roll (Empanizado)", price: 120 },
  { name: "Tampico roll (Empanizado)", price: 125 },
  { name: "Cheezy roll (Empanizado)", price: 130 },
  { name: "Spicy mexican roll (Empanizado)", price: 130 },
  { name: "Norteñito roll (Gratinado)", price: 130 },
  { name: "Norteñito roll (Sin gratinar)", price: 115 }
];

// Categorías del Menú Digital (Iconos vectoriales limpios, CERO emojis)
export const CATEGORIES = [
  { id: "todos", name: "Todos", icon: "fa-utensils" },
  { id: "entradas", name: "Entradas", icon: "fa-bowl-rice" },
  { id: "rollos-especiales", name: "Rollos Especiales", icon: "fa-circle-dot" },
  { id: "rollos-empanizados", name: "Rollos Empanizados", icon: "fa-fire-flame-curved" },
  { id: "fuera-del-roll", name: "Fuera del Roll", icon: "fa-burger" },
  { id: "infantil-postres", name: "Infantil y Postres", icon: "fa-cookie" },
  { id: "cafeteria-matcha", name: "Cafetería y Matcha", icon: "fa-mug-hot" },
  { id: "bar-cocteleria", name: "Bebidas con Alcohol", icon: "fa-wine-glass" }
];

// Base de datos completa del Menú de Bōcatta Food Spot (Sin ningún emoji)
export const MENU_ITEMS = [
  // ================= ENTRADAS =================
  {
    id: "yakimeshi",
    category: "entradas",
    categoryLabel: "Entradas",
    name: "Yakimeshi",
    badge: "Clásico Japonés",
    icon: "fa-bowl-rice",
    description: "Arroz frito estilo japonés salteado con verduras, res, pollo y camarón con toque de soya.",
    basePrice: 70,
    priceDisplay: "$70 - $110",
    variantsLabel: "Elige tu versión de Yakimeshi *",
    variants: [
      { name: "Verduras ($70)", price: 70 },
      { name: "Camarón ($95)", price: 95 },
      { name: "Arrachera ($100)", price: 100 },
      { name: "Mixto ($110)", price: 110 }
    ]
  },
  {
    id: "kushiages",
    category: "entradas",
    categoryLabel: "Entradas",
    name: "Kushiages (Orden 3 piezas)",
    icon: "fa-utensils",
    description: "Brochetas empanizadas y crujientes (Orden de 3 piezas).",
    basePrice: 95,
    priceDisplay: "$95 - $115",
    variantsLabel: "Elige el relleno de tus Kushiages *",
    variants: [
      { name: "Queso (3 piezas - $95)", price: 95 },
      { name: "Plátano + philadelphia (3 piezas - $95)", price: 95 },
      { name: "Camarón + philadelphia (3 piezas - $115)", price: 115 }
    ]
  },
  {
    id: "edamames",
    category: "entradas",
    categoryLabel: "Entradas",
    name: "Edamames",
    icon: "fa-seedling",
    description: "Vainas de soja al vapor o tempura, sazonadas y perfectas para botanear.",
    basePrice: 50,
    priceDisplay: "$50 - $65",
    variantsLabel: "Elige la preparación *",
    variants: [
      { name: "Al vapor ($50)", price: 50 },
      { name: "Tempura ($65)", price: 65 }
    ]
  },

  // ================= ROLLOS ESPECIALES =================
  {
    id: "california-especial",
    category: "rollos-especiales",
    categoryLabel: "Rollos Especiales",
    name: "California especial",
    icon: "fa-circle-dot",
    description: "Por fuera: ajonjolí / masago. Por dentro: pepino, aguacate, philadelphia, camarón o surimi.",
    basePrice: 110,
    priceDisplay: "$110 / $120",
    variantsLabel: "Elige la preparación del rollo *",
    variants: [
      { name: "Normal ($110)", price: 110 },
      { name: "Empanizado ($120)", price: 120 }
    ]
  },
  {
    id: "avocado-roll",
    category: "rollos-especiales",
    categoryLabel: "Rollos Especiales",
    name: "Avocado roll",
    icon: "fa-leaf",
    description: "Por fuera: aguacate, ajonjolí, salsa de anguila. Por dentro: camarón empanizado, philadelphia, pepino.",
    basePrice: 115,
    priceDisplay: "$115",
    variants: [{ name: "Orden completa ($115)", price: 115 }]
  },
  {
    id: "monkey-roll",
    category: "rollos-especiales",
    categoryLabel: "Rollos Especiales",
    name: "Monkey roll",
    badge: "Favorito",
    icon: "fa-star",
    description: "Por fuera: plátano frito, philadelphia, salsa de anguila. Por dentro: camarón empanizado, pepino, philadelphia.",
    basePrice: 120,
    priceDisplay: "$120",
    variants: [{ name: "Orden completa ($120)", price: 120 }]
  },
  {
    id: "inroll",
    category: "rollos-especiales",
    categoryLabel: "Rollos Especiales",
    name: "Inroll",
    icon: "fa-circle-dot",
    description: "Por fuera: láminas de pepino, tampico, aguacate, ajonjolí. Por dentro: salmón, philadelphia, aguacate.",
    basePrice: 120,
    priceDisplay: "$120",
    variants: [{ name: "Orden completa ($120)", price: 120 }]
  },
  {
    id: "dragon-roll",
    category: "rollos-especiales",
    categoryLabel: "Rollos Especiales",
    name: "Dragon roll",
    icon: "fa-fire",
    description: "Por fuera: salmón flameado, philadelphia, aguacate, chipotle. Por dentro: camarón empanizado, pepino.",
    basePrice: 120,
    priceDisplay: "$120",
    variants: [{ name: "Orden completa ($120)", price: 120 }]
  },
  {
    id: "kani-roll",
    category: "rollos-especiales",
    categoryLabel: "Rollos Especiales",
    name: "Kani roll",
    icon: "fa-circle-dot",
    description: "Por fuera: kanikama, aguacate, mayo chipotle, anguila. Por dentro: camarón empanizado, philadelphia, pepino.",
    basePrice: 125,
    priceDisplay: "$125",
    variants: [{ name: "Orden completa ($125)", price: 125 }]
  },
  {
    id: "sunset-roll",
    category: "rollos-especiales",
    categoryLabel: "Rollos Especiales",
    name: "Sunset roll",
    icon: "fa-sun",
    description: "Por fuera: mango, aguacate, ajonjolí. Por dentro: camarón empanizado, philadelphia, pepino.",
    basePrice: 125,
    priceDisplay: "$125",
    variants: [{ name: "Orden completa ($125)", price: 125 }]
  },

  // ================= ROLLOS EMPANIZADOS =================
  {
    id: "crispy-roll",
    category: "rollos-empanizados",
    categoryLabel: "Rollos Empanizados",
    name: "Crispy roll",
    icon: "fa-fire-flame-curved",
    description: "Por fuera: empanizado de panko, tampico, anguila. Por dentro: res, pollo, tocino, philadelphia, aguacate.",
    basePrice: 115,
    priceDisplay: "$115",
    variants: [{ name: "Orden completa ($115)", price: 115 }]
  },
  {
    id: "tropicoco-roll",
    category: "rollos-empanizados",
    categoryLabel: "Rollos Empanizados",
    name: "Tropicoco roll",
    icon: "fa-fire-flame-curved",
    description: "Por fuera: empanizado de coco, philadelphia, mango. Por dentro: camarón empanizado, philadelphia, aguacate.",
    basePrice: 120,
    priceDisplay: "$120",
    variants: [{ name: "Orden completa ($120)", price: 120 }]
  },
  {
    id: "dorito-roll",
    category: "rollos-empanizados",
    categoryLabel: "Rollos Empanizados",
    name: "Dorito roll",
    icon: "fa-fire-flame-curved",
    description: "Por fuera: empanizado de doritos, mayo chipotle. Por dentro: camarón, philadelphia, aguacate, pepino.",
    basePrice: 120,
    priceDisplay: "$120",
    variants: [{ name: "Orden completa ($120)", price: 120 }]
  },
  {
    id: "tampico-roll",
    category: "rollos-empanizados",
    categoryLabel: "Rollos Empanizados",
    name: "Tampico roll",
    icon: "fa-fire-flame-curved",
    description: "Por fuera: empanizado, topping de tampico, anguila. Por dentro: camarón, philadelphia, aguacate, pepino.",
    basePrice: 125,
    priceDisplay: "$125",
    variants: [{ name: "Orden completa ($125)", price: 125 }]
  },
  {
    id: "cheezy-roll",
    category: "rollos-empanizados",
    categoryLabel: "Rollos Empanizados",
    name: "Cheezy roll",
    icon: "fa-fire-flame-curved",
    description: "Por fuera: empanizado, gratinado de quesos con tocino y chiles toreados. Por dentro: res, tocino, philadelphia, aguacate.",
    basePrice: 130,
    priceDisplay: "$130",
    variants: [{ name: "Orden completa ($130)", price: 130 }]
  },
  {
    id: "spicy-mexican-roll",
    category: "rollos-empanizados",
    categoryLabel: "Rollos Empanizados",
    name: "Spicy mexican roll",
    badge: "Picante",
    icon: "fa-pepper-hot",
    description: "Por fuera: empanizado con chiles toreados, tocino, mayo chipotle. Por dentro: arrachera, philadelphia, aguacate, pepino.",
    basePrice: 130,
    priceDisplay: "$130",
    variants: [{ name: "Orden completa ($130)", price: 130 }]
  },
  {
    id: "nortenito-roll",
    category: "rollos-empanizados",
    categoryLabel: "Rollos Empanizados",
    name: "Norteñito roll gratinado",
    icon: "fa-fire-flame-curved",
    description: "Por fuera: empanizado, gratinado con arrachera, tocino y chiles. Disponible gratinado o sin gratinar.",
    basePrice: 115,
    priceDisplay: "$115 / $130",
    variantsLabel: "Elige tu versión del Norteñito *",
    variants: [
      { name: "Gratinado ($130)", price: 130 },
      { name: "Sin gratinar ($115)", price: 115 }
    ]
  },
  {
    id: "bocatta-ball",
    category: "rollos-empanizados",
    categoryLabel: "Especialidad de la Casa",
    name: "Bōcatta ball",
    badge: "Signature",
    icon: "fa-award",
    description: "Bola de arroz rellena de philadelphia, aguacate y pepino, empanizada con tampico y anguila. Proteína a elegir.",
    basePrice: 145,
    priceDisplay: "$145",
    variants: [{ name: "Bōcatta ball ($145)", price: 145 }],
    secondaryLabel: "Elige la proteína obligatoria de tu Bōcatta ball *",
    secondaryKey: "Proteína",
    secondaryOptions: ["Camarón empanizado", "Salmón", "Arrachera"]
  },
  {
    id: "promo-charola-card",
    category: "rollos-empanizados",
    categoryLabel: "Promoción Especial (-10%)",
    name: "Charola de 5 Rollos Surtidos",
    badge: "10% Descuento",
    icon: "fa-layer-group",
    isCharolaTrigger: true,
    description: "Elige 5 rollos cualesquiera de nuestro menú (Especiales o Empanizados) con 10% de descuento automático sobre el total. No aplica con otras promociones.",
    basePrice: 500,
    priceDisplay: "-10% Total",
    variants: []
  },

  // ================= FUERA DEL ROLL =================
  {
    id: "papas-entradas",
    category: "fuera-del-roll",
    categoryLabel: "Fuera del Roll",
    name: "Orden de Papas",
    icon: "fa-utensils",
    description: "Papas recién hechas y crujientes. Disponibles a la francesa, gajo o waffle.",
    basePrice: 50,
    priceDisplay: "$50 - $66",
    variantsLabel: "Elige el corte de tus papas *",
    variants: [
      { name: "Papas a la francesa ($50)", price: 50 },
      { name: "Papas gajo ($56)", price: 56 },
      { name: "Papas waffle ($66)", price: 66 }
    ]
  },
  {
    id: "hamburguesa-arrachera",
    category: "fuera-del-roll",
    categoryLabel: "Fuera del Roll",
    name: "Hamburguesa arrachera",
    badge: "Top Grill",
    icon: "fa-burger",
    description: "Jugosa hamburguesa de arrachera preparada al momento con ingredientes frescos.",
    basePrice: 130,
    priceDisplay: "$130",
    variants: [{ name: "Hamburguesa arrachera ($130)", price: 130 }]
  },
  {
    id: "cheese-sticks",
    category: "fuera-del-roll",
    categoryLabel: "Fuera del Roll",
    name: "Cheese sticks (Orden 4 piezas)",
    icon: "fa-utensils",
    description: "Orden de 4 piezas de dedos de queso empanizados y dorados.",
    basePrice: 90,
    priceDisplay: "$90",
    variants: [{ name: "Orden 4 piezas ($90)", price: 90 }]
  },
  {
    id: "alitas-6pzas",
    category: "fuera-del-roll",
    categoryLabel: "Fuera del Roll",
    name: "Alitas (Orden 6 piezas)",
    icon: "fa-drumstick-bite",
    description: "Orden de 6 piezas bañadas en tu salsa a elegir: BBQ, Mango habanero, Tamarindo habanero, Piña habanero, Búfalo o Honey mostaza.",
    basePrice: 150,
    priceDisplay: "$150",
    variants: [{ name: "Orden 6 piezas ($150)", price: 150 }],
    secondaryLabel: "Elige tu salsa obligatoria *",
    secondaryKey: "Salsa",
    secondaryOptions: SAUCES_LIST
  },
  {
    id: "boneless-300gr",
    category: "fuera-del-roll",
    categoryLabel: "Fuera del Roll",
    name: "Boneless (Orden 300gr)",
    badge: "Más Pedido",
    icon: "fa-fire",
    description: "Orden de 300 gramos de boneless crujientes bañados en tu salsa favorita.",
    basePrice: 120,
    priceDisplay: "$120",
    variants: [{ name: "Orden 300gr ($120)", price: 120 }],
    secondaryLabel: "Elige tu salsa obligatoria *",
    secondaryKey: "Salsa",
    secondaryOptions: SAUCES_LIST
  },

  // ================= MENÚ INFANTIL Y POSTRES =================
  {
    id: "dinonuggets",
    category: "infantil-postres",
    categoryLabel: "Menú Infantil",
    name: "Dinonuggets (Incluye papas)",
    icon: "fa-child-reaching",
    description: "Nuggets de pollo acompañados de orden de papas a la francesa.",
    basePrice: 58,
    priceDisplay: "$58",
    variants: [{ name: "Orden con papas ($58)", price: 58 }]
  },
  {
    id: "alitas-boneless-infantil",
    category: "infantil-postres",
    categoryLabel: "Menú Infantil",
    name: "Alitas ó Boneless Infantil",
    icon: "fa-child-reaching",
    description: "Naturales (sin picante) e incluyen orden de papas.",
    basePrice: 100,
    priceDisplay: "$100",
    variantsLabel: "Elige Alitas o Boneless naturales *",
    variants: [
      { name: "Boneless naturales + papas ($100)", price: 100 },
      { name: "Alitas naturales + papas ($100)", price: 100 }
    ]
  },
  {
    id: "galletas-gourmet",
    category: "infantil-postres",
    categoryLabel: "Postres · Maka Cookie",
    name: "Galletas gourmet",
    icon: "fa-cookie",
    description: "Galleta gourmet recién horneada. Pregunta por los sabores del día.",
    basePrice: 45,
    priceDisplay: "$45",
    variants: [{ name: "Galleta gourmet ($45)", price: 45 }]
  },
  {
    id: "brownies",
    category: "infantil-postres",
    categoryLabel: "Postres",
    name: "Brownies",
    icon: "fa-cake-candles",
    description: "Suave brownie de chocolate casero, solo o acompañado con bola de helado.",
    basePrice: 35,
    priceDisplay: "$35 / $45",
    variantsLabel: "Elige tu presentación *",
    variants: [
      { name: "Brownie tradicional ($35)", price: 35 },
      { name: "Brownie + helado ($45)", price: 45 }
    ]
  },
  {
    id: "roles-de-canela",
    category: "infantil-postres",
    categoryLabel: "Postres",
    name: "Roles de canela",
    icon: "fa-bread-slice",
    description: "Esponjosos roles de canela recién horneados en versión tradicional o sabores especiales.",
    basePrice: 40,
    priceDisplay: "$40 / $50",
    variantsLabel: "Elige tu Rol de Canela *",
    variants: [
      { name: "Tradicional ($40)", price: 40 },
      { name: "Sabores ($50)", price: 50 }
    ]
  },

  // ================= CAFETERÍA Y MATCHA =================
  {
    id: "ice-lattes",
    category: "cafeteria-matcha",
    categoryLabel: "Bebidas Frías · Café de Especialidad",
    name: "Ice Lattes",
    badge: "Café Especialidad",
    description: "Preparados con café de especialidad en las rocas. Puedes personalizar con Cold Foam o Perlas.",
    basePrice: 60,
    priceDisplay: "$60 - $80",
    allowCoffeeExtras: true,
    variantsLabel: "Elige el sabor de tu Ice Latte *",
    variants: [
      { name: "Clásico ($60)", price: 60 },
      { name: "Vainilla ($65)", price: 65 },
      { name: "Caramelo ($70)", price: 70 },
      { name: "Avellana ($70)", price: 70 },
      { name: "Chai vainilla ($70)", price: 70 },
      { name: "Brown sugar ($70)", price: 70 },
      { name: "Horchata latte ($75)", price: 75 },
      { name: "Taro sin café ($77)", price: 77 },
      { name: "Biscoff ($80)", price: 80 }
    ]
  },
  {
    id: "matcha-bar",
    category: "cafeteria-matcha",
    categoryLabel: "What's Matcha? · Barra Matcha",
    name: "Matcha Ice Lattes & Frappé",
    badge: "Grado Ceremonial",
    isMatcha: true,
    description: "Té verde japonés de grado ceremonial, más puro, suave, cremoso y delicado en sabor.",
    basePrice: 75,
    priceDisplay: "$75 - $80",
    allowCoffeeExtras: true,
    variantsLabel: "Elige tu bebida de Matcha *",
    variants: [
      { name: "Matcha mix Latte ($75)", price: 75 },
      { name: "Matcha ceremonial Latte ($80)", price: 80 },
      { name: "Matcha mango ($80)", price: 80 },
      { name: "Matcha fresa ($80)", price: 80 },
      { name: "Honey matcha ($80)", price: 80 },
      { name: "Frappe Matcha ($80)", price: 80 }
    ]
  },
  {
    id: "frappes-clasicos",
    category: "cafeteria-matcha",
    categoryLabel: "Bebidas Frías",
    name: "Frappés Clásicos",
    description: "Frappés cremosos coronados con crema batida.",
    basePrice: 78,
    priceDisplay: "$78",
    allowCoffeeExtras: true,
    variantsLabel: "Elige el sabor de tu Frappé ($78) *",
    variants: [
      { name: "Caramelo", price: 78 },
      { name: "Moka", price: 78 },
      { name: "Cookies and cream", price: 78 },
      { name: "Chocolate blanco", price: 78 },
      { name: "Taro", price: 78 },
      { name: "Nutella", price: 78 },
      { name: "Fresas con crema", price: 78 },
      { name: "Piña coco", price: 78 },
      { name: "Cereza", price: 78 }
    ]
  },
  {
    id: "frappes-top",
    category: "cafeteria-matcha",
    categoryLabel: "Bebidas Frías",
    name: "Frappés Top",
    badge: "Indulgente",
    description: "Nuestros frappés especiales con toppings premium.",
    basePrice: 88,
    priceDisplay: "$88",
    allowCoffeeExtras: true,
    variantsLabel: "Elige el sabor de tu Frappé Top ($88) *",
    variants: [
      { name: "Ferrero", price: 88 },
      { name: "Chocorrol", price: 88 },
      { name: "Snickers", price: 88 },
      { name: "Mazapán", price: 88 }
    ]
  },
  {
    id: "soda-italiana",
    category: "cafeteria-matcha",
    categoryLabel: "Bebidas Refrescantes",
    name: "Soda Italiana",
    description: "Bebida burbujeante y refrescante. Ideal con perlas explosivas.",
    basePrice: 50,
    priceDisplay: "$50",
    allowCoffeeExtras: true,
    variantsLabel: "Elige el sabor de tu Soda Italiana ($50) *",
    variants: [
      { name: "Mora azul", price: 50 },
      { name: "Manzana verde", price: 50 },
      { name: "Mango", price: 50 },
      { name: "Pink lemonade", price: 50 }
    ]
  },
  {
    id: "smoothies",
    category: "cafeteria-matcha",
    categoryLabel: "Bebidas Frías",
    name: "Smoothies Frutales",
    description: "Smoothies de fruta natural congelada.",
    basePrice: 68,
    priceDisplay: "$68",
    allowCoffeeExtras: true,
    variantsLabel: "Elige el sabor de tu Smoothie ($68) *",
    variants: [
      { name: "Frutos rojos", price: 68 },
      { name: "Mango", price: 68 },
      { name: "Maracuyá", price: 68 }
    ]
  },
  {
    id: "bebidas-calientes",
    category: "cafeteria-matcha",
    categoryLabel: "Bebidas Calientes · Café & Tisanas",
    name: "Barra de Café Caliente y Tisanas",
    description: "More espresso, less depresso. Café recién extraído y tisanas frutales.",
    basePrice: 30,
    priceDisplay: "$30 - $65",
    variantsLabel: "Elige tu bebida caliente *",
    variants: [
      { name: "Expresso ($30)", price: 30 },
      { name: "Americano ($45)", price: 45 },
      { name: "Capuchino Clásico ($60)", price: 60 },
      { name: "Tisanas frutales ($60)", price: 60 },
      { name: "Capuchino avellana ($65)", price: 65 },
      { name: "Capuchino vainilla ($65)", price: 65 },
      { name: "Chai vainilla caliente ($65)", price: 65 },
      { name: "Chocolate con leche ($65)", price: 65 }
    ]
  },
  {
    id: "otras-bebidas",
    category: "cafeteria-matcha",
    categoryLabel: "Otras Bebidas",
    name: "Aguas, Refrescos y Topo Chico",
    description: "Bebidas embotelladas bien frías.",
    basePrice: 15,
    priceDisplay: "$15 - $38",
    variantsLabel: "Selecciona tu bebida *",
    variants: [
      { name: "Agua embotellada ($15)", price: 15 },
      { name: "Jugo envasado ($22)", price: 22 },
      { name: "Refrescos de sabor ($36)", price: 36 },
      { name: "Topo Chico ($38)", price: 38 }
    ]
  },

  // ================= BAR Y COCTELERÍA =================
  {
    id: "cervezas",
    category: "bar-cocteleria",
    categoryLabel: "Bebidas con Alcohol",
    name: "Cervezas",
    description: "Cervezas bien frías. Opción de agregar vaso escarchado (+$10).",
    basePrice: 30,
    priceDisplay: "$30 - $42",
    allowCoffeeExtras: true,
    allowedExtras: ["escarchado"],
    variantsLabel: "Elige tu cerveza *",
    variants: [
      { name: "Corona ($30)", price: 30 },
      { name: "Victoria ($30)", price: 30 },
      { name: "XX Lager ($30)", price: 30 },
      { name: "Modelo especial ($42)", price: 42 }
    ]
  },
  {
    id: "mojitos",
    category: "bar-cocteleria",
    categoryLabel: "Coctelería Refrescante",
    name: "Mojitos Cubanos",
    badge: "Coctelería",
    description: "Preparados al momento con hierbabuena fresca, limón y ron.",
    basePrice: 88,
    priceDisplay: "$88",
    variantsLabel: "Elige el sabor de tu Mojito ($88) *",
    variants: [
      { name: "Mango", price: 88 },
      { name: "Tradicional", price: 88 },
      { name: "Frutos rojos", price: 88 }
    ]
  },
  {
    id: "cocteleria-autor",
    category: "bar-cocteleria",
    categoryLabel: "Spritz & Carajillo",
    name: "Carajillo & Spritz",
    description: "Tragos largos y digestivos ideales para acompañar tu cena.",
    basePrice: 98,
    priceDisplay: "$98 - $140",
    variantsLabel: "Elige tu coctel *",
    variants: [
      { name: "Carajillo ($98)", price: 98 },
      { name: "Aperol spritz ($130)", price: 130 },
      { name: "St germain spritz ($140)", price: 140 }
    ]
  },
  {
    id: "vinos",
    category: "bar-cocteleria",
    categoryLabel: "Vino Tinto y Rosado",
    name: "Selección de Vinos (Copa o Botella)",
    description: "Vinos tintos y rosados servidos por copa o botella.",
    basePrice: 65,
    priceDisplay: "$65 - $650",
    variantsLabel: "Elige tu etiqueta y presentación *",
    variants: [
      { name: "Tinto Riunite lambrusco - Copa ($75)", price: 75 },
      { name: "Tinto Riunite lambrusco - Botella ($330)", price: 330 },
      { name: "Tinto MATSU tempranillo - Copa ($75)", price: 75 },
      { name: "Tinto MATSU tempranillo - Botella ($650)", price: 650 },
      { name: "Rosado Blanc de zinfandel - Copa ($65)", price: 65 },
      { name: "Rosado Blanc de zinfandel - Botella ($345)", price: 345 }
    ]
  },
  {
    id: "destilados",
    category: "bar-cocteleria",
    categoryLabel: "Whisky y Tequila",
    name: "Destilados (Copa o Botella)",
    description: "Etiquetas de Whisky y Tequila por copeo o botella para tu mesa.",
    basePrice: 62,
    priceDisplay: "$62 - $1,298",
    variantsLabel: "Elige tu destilado *",
    variants: [
      { name: "Whisky Red Label - Copa ($62)", price: 62 },
      { name: "Whisky Red Label - Botella ($650)", price: 650 },
      { name: "Whisky Grand Old Parr - Copa ($110)", price: 110 },
      { name: "Whisky Grand Old Parr - Botella ($1,298)", price: 1298 },
      { name: "Whisky Buchanan's - Copa ($102)", price: 102 },
      { name: "Tequila José Cuervo Especial - Copa ($65)", price: 65 },
      { name: "Tequila José Cuervo Especial - Botella ($598)", price: 598 },
      { name: "Tequila Maestro Dobel Diamante - Copa ($75)", price: 75 },
      { name: "Tequila Maestro Dobel Diamante - Botella ($1,110)", price: 1110 }
    ]
  }
];
