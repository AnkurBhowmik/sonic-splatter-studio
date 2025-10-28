import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import heroImage from "@/assets/hero-background.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Find Your Dream Home Today
          </h1>
          <p className="text-xl text-white/90">
            Discover the perfect property from our extensive collection of homes, apartments, and commercial spaces
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Enter location, city, or neighborhood" 
                  className="pl-10 h-12 border-border"
                />
              </div>
              
              <Select defaultValue="buy">
                <SelectTrigger className="w-full md:w-[180px] h-12">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>

              <Button className="h-12 px-8 gap-2">
                <Search className="h-5 w-5" />
                Search
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-white pt-4">
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-white/80">Properties</div>
            </div>
            <div>
              <div className="text-3xl font-bold">5K+</div>
              <div className="text-white/80">Happy Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold">200+</div>
              <div className="text-white/80">Agents</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
