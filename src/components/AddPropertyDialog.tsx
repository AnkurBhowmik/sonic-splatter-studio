import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";

const propertySchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
  location: z.string().trim().min(3, "Location must be at least 3 characters").max(200),
  price: z.number().positive("Price must be positive").max(999999999.99),
  beds: z.number().int().positive().max(50),
  baths: z.number().positive().max(50),
  sqft: z.number().int().positive().max(999999),
  type: z.string().min(1, "Please select a property type"),
  imageUrl: z.string().url("Invalid URL").max(2000).optional().or(z.literal("")),
});

interface AddPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddPropertyDialog = ({ open, onOpenChange, onSuccess }: AddPropertyDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    beds: "",
    baths: "",
    sqft: "",
    type: "",
    imageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validated = propertySchema.parse({
        title: formData.title,
        location: formData.location,
        price: parseFloat(formData.price),
        beds: parseInt(formData.beds),
        baths: parseFloat(formData.baths),
        sqft: parseInt(formData.sqft),
        type: formData.type,
        imageUrl: formData.imageUrl,
      });

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to add properties");
        return;
      }

      const { error } = await supabase.from("properties").insert({
        user_id: user.id,
        title: validated.title,
        location: validated.location,
        price: validated.price,
        beds: validated.beds,
        baths: validated.baths,
        sqft: validated.sqft,
        type: validated.type,
        image_url: validated.imageUrl || null,
      });

      if (error) throw error;

      toast.success("Property added successfully!");
      setFormData({
        title: "",
        location: "",
        price: "",
        beds: "",
        baths: "",
        sqft: "",
        type: "",
        imageUrl: "",
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to add property");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Modern Luxury Villa"
                required
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Beverly Hills, CA"
                required
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2850000"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Property Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Penthouse">Penthouse</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                  <SelectItem value="Estate">Estate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="beds">Bedrooms *</Label>
              <Input
                id="beds"
                type="number"
                value={formData.beds}
                onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                placeholder="4"
                required
                min="1"
                max="50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="baths">Bathrooms *</Label>
              <Input
                id="baths"
                type="number"
                value={formData.baths}
                onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                placeholder="3"
                required
                min="1"
                max="50"
                step="0.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sqft">Square Feet *</Label>
              <Input
                id="sqft"
                type="number"
                value={formData.sqft}
                onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                placeholder="4500"
                required
                min="1"
                max="999999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                maxLength={2000}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyDialog;
