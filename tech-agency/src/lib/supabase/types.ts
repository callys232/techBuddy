export interface Database {
  public: {
    Tables: {
      quote_requests: {
        Row: {
          id: string;
          name: string;
          email: string;
          whatsapp: string;
          company: string | null;
          pain_points: string[];
          template_id: string | null;
          budget_range: number;
          timeline: string;
          features: string[];
          contact_method: string;
          source: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["quote_requests"]["Row"], "id" | "created_at">;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          department: string;
          message: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contact_messages"]["Row"], "id" | "created_at">;
      };
      newsletter_subs: {
        Row: {
          id: string;
          email: string;
          tags: string[];
          status: "active" | "unsubscribed";
          subscribed_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["newsletter_subs"]["Row"], "id" | "subscribed_at">;
      };
      bookings: {
        Row: {
          id: string;
          name: string;
          email: string;
          booking_datetime: string;
          service_type: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "id" | "created_at">;
      };
    };
  };
}
