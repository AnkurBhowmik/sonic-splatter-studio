import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  image_url: string | null;
  featured: boolean;
}

const Index = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);
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

        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No properties available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                image={property.image_url || "/placeholder.svg"}
                title={property.title}
                location={property.location}
                price={`$${property.price.toLocaleString()}`}
                beds={property.beds}
                baths={property.baths}
                sqft={property.sqft}
                type={property.type}
                featured={property.featured}
              />
            ))}
          </div>
        )}
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
