import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const metadata = {
  title: "Bōcatta Food Spot | Menú Digital y Reservaciones - Chilapa, Gro.",
  description:
    "Menú digital de Bōcatta Food Spot en Chilapa, Guerrero: sushi, alitas, boneless, café de especialidad, matcha y coctelería. Pide a domicilio o para recoger y reserva tu mesa por WhatsApp.",
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Bōcatta Food Spot",
    title: "Bōcatta Food Spot · Sushi, Alitas y Café de Especialidad en Chilapa",
    description:
      "Mira el menú, arma tu charola de 5 rollos con 10% de descuento, pide por WhatsApp o reserva tu mesa. Mar a Dom, 5:30 a 10:00 PM.",
  },
  twitter: {
    card: "summary",
    title: "Bōcatta Food Spot · Chilapa, Gro.",
    description: "Sushi, alitas, café de especialidad y coctelería. Pide por WhatsApp o reserva tu mesa.",
  },
};

export const viewport = {
  themeColor: "#C83E31",
  width: "device-width",
  initialScale: 1,
};

const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Bōcatta Food Spot",
  description: "Sushi, alitas, boneless, café de especialidad, matcha y coctelería en Chilapa de Álvarez, Guerrero.",
  servesCuisine: ["Sushi", "Japonesa", "Alitas", "Café de especialidad"],
  telephone: "+527561159334",
  priceRange: "$$",
  acceptsReservations: true,
  sameAs: ["https://www.instagram.com/bocatta.ch"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Insurgentes 400A, Col. Centro",
    addressLocality: "Chilapa de Álvarez",
    addressRegion: "Guerrero",
    addressCountry: "MX",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "17:30",
      closes: "22:00",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans selection:bg-bocatta-red selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
