import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square, MapPin, Heart, ArrowLeft } from "lucide-react";
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
  user_id: string;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProperty(data);

        // Check if favorited
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: favoriteData } = await supabase
            .from("favorites")
            .select("id")
            .eq("user_id", user.id)
            .eq("property_id", id)
            .maybeSingle();

          setIsFavorite(!!favoriteData);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Property not found");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  const handleFavoriteToggle = async () => {
    setIsTogglingFavorite(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to save favorites");
        navigate("/auth");
        return;
      }

      if (isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("property_id", id);

        if (error) throw error;
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, property_id: id });

        if (error) throw error;
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg text-muted-foreground">Property not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative h-[500px] rounded-xl overflow-hidden">
              <img
                src={property.image_url || "/placeholder.svg"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {property.featured && (
                  <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                )}
                <Badge variant="secondary">{property.type}</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{property.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{property.location}</span>
              </div>
              <p className="text-5xl font-bold text-primary">
                ${property.price.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 p-6 bg-secondary rounded-xl">
              <div className="text-center space-y-2">
                <Bed className="h-8 w-8 mx-auto text-primary" />
                <p className="text-2xl font-bold">{property.beds}</p>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
              </div>
              <div className="text-center space-y-2">
                <Bath className="h-8 w-8 mx-auto text-primary" />
                <p className="text-2xl font-bold">{property.baths}</p>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
              </div>
              <div className="text-center space-y-2">
                <Square className="h-8 w-8 mx-auto text-primary" />
                <p className="text-2xl font-bold">{property.sqft.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Square Feet</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                className="w-full gap-2" 
                size="lg"
                onClick={handleFavoriteToggle}
                disabled={isTogglingFavorite}
                variant={isFavorite ? "outline" : "default"}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                {isFavorite ? "Saved to Favorites" : "Save to Favorites"}
              </Button>

              <div className="p-6 bg-card border border-border rounded-xl space-y-4">
                <h3 className="text-xl font-semibold">Property Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  This stunning {property.type.toLowerCase()} offers {property.beds} spacious bedrooms and {property.baths} modern bathrooms 
                  across {property.sqft.toLocaleString()} square feet of luxury living space. Located in the desirable area of {property.location}, 
                  this property combines elegance with functionality, making it perfect for those seeking premium accommodation.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="font-semibold">{property.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold">For Sale</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;
