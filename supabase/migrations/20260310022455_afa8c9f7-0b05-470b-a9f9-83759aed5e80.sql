
CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Anyone can view reviews" ON public.product_reviews
  FOR SELECT TO public USING (true);

-- Anyone can insert reviews (guest or authenticated)
CREATE POLICY "Anyone can insert reviews" ON public.product_reviews
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admins can delete reviews
CREATE POLICY "Admins can delete reviews" ON public.product_reviews
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
