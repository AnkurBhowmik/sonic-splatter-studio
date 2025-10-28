import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

const properties = [
  {
    id: 1,
    image: property1,
    title: "Modern Luxury Villa",
    location: "Beverly Hills, CA",
    price: "$2,850,000",
    beds: 5,
    baths: 4,
    sqft: 4500,
    type: "Villa",
    featured: true,
  },
  {
    id: 2,
    image: property2,
    title: "Downtown Apartment",
    location: "New York, NY",
    price: "$1,200,000",
    beds: 3,
    baths: 2,
    sqft: 1800,
    type: "Apartment",
    featured: true,
  },
  {
    id: 3,
    image: property3,
    title: "Mediterranean Estate",
    location: "Miami, FL",
    price: "$4,500,000",
    beds: 6,
    baths: 5,
    sqft: 6200,
    type: "Estate",
    featured: true,
  },
  {
    id: 4,
    image: property4,
    title: "Cozy Family Home",
    location: "Austin, TX",
    price: "$650,000",
    beds: 4,
    baths: 3,
    sqft: 2800,
    type: "House",
  },
  {
    id: 5,
    image: property5,
    title: "Luxury Penthouse",
    location: "Chicago, IL",
    price: "$3,200,000",
    beds: 4,
    baths: 3,
    sqft: 3500,
    type: "Penthouse",
  },
  {
    id: 6,
    image: property6,
    title: "Modern Townhouse",
    location: "Seattle, WA",
    price: "$890,000",
    beds: 3,
    baths: 2.5,
    sqft: 2200,
    type: "Townhouse",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      
      <main className="container mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground">
            Featured Properties
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our handpicked selection of premium properties available for sale
          </p>
        </div>

        <PropertyFilters />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </main>

      <footer className="bg-secondary mt-20 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 EstateHub. Find your dream home with us.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
