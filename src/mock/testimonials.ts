export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  rating: number;
  avatar: string;
  /** True for every entry right now — these are illustrative of the kind of
   *  feedback we're built to earn, not quotes from a real completed engagement. */
  illustrative: boolean;
}

/** Empty until there's a real client quote to put here — fabricated named
 *  people with invented companies and quotes, even labeled "illustrative",
 *  read too much like genuine reviews to keep shipping. TestimonialsSection
 *  renders nothing while this is empty. */
export const TESTIMONIALS: Testimonial[] = [];
