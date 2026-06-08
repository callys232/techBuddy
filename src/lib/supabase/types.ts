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
        Insert: {
          name: string;
          email: string;
          whatsapp: string;
          company?: string | null;
          pain_points: string[];
          template_id?: string | null;
          budget_range: number;
          timeline: string;
          features: string[];
          contact_method: string;
          source?: string | null;
        };
        Update: {
          name?: string;
          email?: string;
          whatsapp?: string;
          company?: string | null;
          pain_points?: string[];
          template_id?: string | null;
          budget_range?: number;
          timeline?: string;
          features?: string[];
          contact_method?: string;
          source?: string | null;
        };
        Relationships: [];
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
        Insert: {
          name: string;
          email: string;
          department: string;
          message: string;
        };
        Update: {
          name?: string;
          email?: string;
          department?: string;
          message?: string;
        };
        Relationships: [];
      };
      newsletter_subs: {
        Row: {
          id: string;
          email: string;
          tags: string[];
          status: string;
          subscribed_at: string;
        };
        Insert: {
          email: string;
          tags: string[];
          status: string;
        };
        Update: {
          email?: string;
          tags?: string[];
          status?: string;
        };
        Relationships: [];
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
        Insert: {
          name: string;
          email: string;
          booking_datetime: string;
          service_type?: string | null;
          notes?: string | null;
        };
        Update: {
          name?: string;
          email?: string;
          booking_datetime?: string;
          service_type?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
