import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const Favorites = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to view favorites");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select(`
          property_id,
          properties (*)
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const propertiesData = data
        .map((fav: any) => fav.properties)
        .filter(Boolean);

      setFavorites(propertiesData);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground">
            My Favorite Properties
          </h1>
          <p className="text-lg text-muted-foreground">
            Properties you've saved for later
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Loading favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">No favorite properties yet</p>
            <p className="text-muted-foreground">Start exploring and save properties you love!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((property) => (
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
                isFavorite={true}
                onFavoriteChange={fetchFavorites}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
