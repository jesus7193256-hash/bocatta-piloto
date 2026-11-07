import { AppProvider } from "@/components/AppProvider";
import { Header, Hero, FloatingCartBar, Toast, Footer } from "@/components/Chrome";
import { MenuSection } from "@/components/MenuSection";
import { ReservationSection } from "@/components/ReservationSection";
import { ItemModal, CharolaModal, CartDrawer, MyOrdersModal } from "@/components/Modals";

export default function HomePage() {
  return (
    <AppProvider>
      <Header />
      <Hero />
      <MenuSection />
      <ReservationSection />
      <Footer />
      <FloatingCartBar />
      <ItemModal />
      <CharolaModal />
      <CartDrawer />
      <MyOrdersModal />
      <Toast />
    </AppProvider>
  );
}
