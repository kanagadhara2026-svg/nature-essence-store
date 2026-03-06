import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import BrandValues from "@/components/BrandValues";
import CustomerTestimonials from "@/components/CustomerTestimonials";
import FaqSection from "@/components/FaqSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import SeoJsonLd from "@/components/SeoJsonLd";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoJsonLd />
      <Header />
      <main>
        <FeaturedProducts />
        <HeroSection />
        <Categories />
        <BrandValues />
        <CustomerTestimonials />
        <FaqSection />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
