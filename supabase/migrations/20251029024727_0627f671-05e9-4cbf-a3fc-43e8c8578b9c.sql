-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true);

-- Create storage policies for property images
CREATE POLICY "Anyone can view property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own property images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-images' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their own property images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images' AND
  auth.uid() IS NOT NULL
);

-- Create favorites table
CREATE TABLE public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Enable RLS on favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for favorites
CREATE POLICY "Users can view their own favorites"
ON public.favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
ON public.favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
ON public.favorites FOR DELETE
USING (auth.uid() = user_id);