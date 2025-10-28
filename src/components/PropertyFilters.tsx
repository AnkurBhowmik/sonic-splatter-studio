import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

const PropertyFilters = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-6 bg-card border border-border rounded-xl">
      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Property Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="house">House</SelectItem>
          <SelectItem value="apartment">Apartment</SelectItem>
          <SelectItem value="villa">Villa</SelectItem>
          <SelectItem value="penthouse">Penthouse</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="any">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Bedrooms" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any Bedrooms</SelectItem>
          <SelectItem value="1">1+ Bedroom</SelectItem>
          <SelectItem value="2">2+ Bedrooms</SelectItem>
          <SelectItem value="3">3+ Bedrooms</SelectItem>
          <SelectItem value="4">4+ Bedrooms</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="any-price">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Price Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any-price">Any Price</SelectItem>
          <SelectItem value="0-500k">Under $500k</SelectItem>
          <SelectItem value="500k-1m">$500k - $1M</SelectItem>
          <SelectItem value="1m-2m">$1M - $2M</SelectItem>
          <SelectItem value="2m+">$2M+</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" className="gap-2 ml-auto">
        <SlidersHorizontal className="h-4 w-4" />
        More Filters
      </Button>
    </div>
  );
};

export default PropertyFilters;
