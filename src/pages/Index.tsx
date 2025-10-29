import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import PropertyFiltersLogic, { FilterState } from "@/components/PropertyFiltersLogic";
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
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    beds: "any",
    priceRange: "any-price",
    searchQuery: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProperties(data || []);

        // Fetch favorites
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: favData } = await supabase
            .from("favorites")
            .select("property_id")
            .eq("user_id", user.id);

          if (favData) {
            setFavorites(new Set(favData.map(f => f.property_id)));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...properties];

    // Filter by type
    if (filters.type !== "all") {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    // Filter by bedrooms
    if (filters.beds !== "any") {
      const minBeds = parseInt(filters.beds);
      filtered = filtered.filter(p => p.beds >= minBeds);
    }

    // Filter by price range
    if (filters.priceRange !== "any-price") {
      const [min, max] = filters.priceRange.split("-").map(p => parseInt(p));
      filtered = filtered.filter(p => {
        if (max) {
          return p.price >= min && p.price <= max;
        }
        return p.price >= min;
      });
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.location.toLowerCase().includes(query)
      );
    }

    setFilteredProperties(filtered);
  }, [properties, filters]);

  const handleFavoriteChange = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: favData } = await supabase
        .from("favorites")
        .select("property_id")
        .eq("user_id", user.id);

      if (favData) {
        setFavorites(new Set(favData.map(f => f.property_id)));
      }
    }
  };
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

        <PropertyFiltersLogic filters={filters} onFilterChange={setFilters} />

        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              {properties.length === 0 ? "No properties available yet" : "No properties match your filters"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                image={property.image_url || "/placeholder.svg"}
                title={property.title}
                location={property.location}
                price={`$${property.price.toLocaleString()}`}
                beds={property.beds}
                baths={property.baths}
                sqft={property.sqft}
                type={property.type}
                featured={property.featured}
                isFavorite={favorites.has(property.id)}
                onFavoriteChange={handleFavoriteChange}
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
