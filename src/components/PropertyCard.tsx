import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Bed, Bath, Maximize } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  featured?: boolean;
  isFavorite?: boolean;
  onFavoriteChange?: () => void;
}

const PropertyCard = ({ 
  id,
  image, 
  title, 
  location, 
  price, 
  beds, 
  baths, 
  sqft, 
  type,
  featured = false,
  isFavorite = false,
  onFavoriteChange
}: PropertyCardProps) => {
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const navigate = useNavigate();

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
        toast.success("Removed from favorites");
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, property_id: id });

        if (error) throw error;
        toast.success("Added to favorites");
      }

      onFavoriteChange?.();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/property/${id}`);
  };

  return (
    <Card 
      className="group overflow-hidden border-border hover:shadow-[var(--card-hover-shadow)] transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {featured && (
          <Badge className="absolute top-4 left-4 bg-accent">
            Featured
          </Badge>
        )}
        <Button 
          size="icon" 
          variant="secondary"
          className="absolute top-4 right-4 rounded-full bg-white/90 hover:bg-white"
          onClick={handleFavoriteToggle}
          disabled={isTogglingFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
        </Button>
        <Badge className="absolute bottom-4 left-4 bg-primary">
          {type}
        </Badge>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <div className="text-2xl font-bold text-accent mb-2">{price}</div>
          <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm">{location}</p>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Bed className="h-4 w-4" />
            <span className="text-sm font-medium">{beds} Beds</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Bath className="h-4 w-4" />
            <span className="text-sm font-medium">{baths} Baths</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Maximize className="h-4 w-4" />
            <span className="text-sm font-medium">{sqft} sqft</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
