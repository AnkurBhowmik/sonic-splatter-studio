import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, Search } from "lucide-react";

export interface FilterState {
  type: string;
  beds: string;
  priceRange: string;
  searchQuery: string;
}

interface PropertyFiltersLogicProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const PropertyFiltersLogic = ({ filters, onFilterChange }: PropertyFiltersLogicProps) => {
  return (
    <div className="space-y-4 p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by title or location..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
          className="flex-1"
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        <Select 
          value={filters.type} 
          onValueChange={(value) => onFilterChange({ ...filters, type: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="House">House</SelectItem>
            <SelectItem value="Apartment">Apartment</SelectItem>
            <SelectItem value="Villa">Villa</SelectItem>
            <SelectItem value="Penthouse">Penthouse</SelectItem>
            <SelectItem value="Townhouse">Townhouse</SelectItem>
            <SelectItem value="Estate">Estate</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.beds} 
          onValueChange={(value) => onFilterChange({ ...filters, beds: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Bedrooms</SelectItem>
            <SelectItem value="1">1+ Bedroom</SelectItem>
            <SelectItem value="2">2+ Bedrooms</SelectItem>
            <SelectItem value="3">3+ Bedrooms</SelectItem>
            <SelectItem value="4">4+ Bedrooms</SelectItem>
            <SelectItem value="5">5+ Bedrooms</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.priceRange} 
          onValueChange={(value) => onFilterChange({ ...filters, priceRange: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any-price">Any Price</SelectItem>
            <SelectItem value="0-500000">Under $500k</SelectItem>
            <SelectItem value="500000-1000000">$500k - $1M</SelectItem>
            <SelectItem value="1000000-2000000">$1M - $2M</SelectItem>
            <SelectItem value="2000000-5000000">$2M - $5M</SelectItem>
            <SelectItem value="5000000-999999999">$5M+</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          className="gap-2 ml-auto"
          onClick={() => onFilterChange({ type: "all", beds: "any", priceRange: "any-price", searchQuery: "" })}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default PropertyFiltersLogic;
