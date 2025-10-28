import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">EstateHub</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
            Buy
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
            Rent
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
            Sell
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost">Sign In</Button>
          <Button>List Property</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
