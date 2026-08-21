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
      resume_members: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
        };
        Insert: {
          email: string;
          name: string;
        };
        Update: {
          email?: string;
          name?: string;
        };
        Relationships: [];
      };
      audit_requests: {
        Row: {
          id: string;
          name: string;
          email: string;
          website_url: string;
          audit_types: string[];
          category: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          website_url: string;
          audit_types: string[];
          category?: string | null;
        };
        Update: {
          name?: string;
          email?: string;
          website_url?: string;
          audit_types?: string[];
          category?: string | null;
        };
        Relationships: [];
      };
      invest_applications: {
        Row: {
          id: string;
          name: string;
          email: string;
          company: string | null;
          stage: string | null;
          invest_type: string | null;
          pitch: string;
          funding: string | null;
          url: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          company?: string | null;
          stage?: string | null;
          invest_type?: string | null;
          pitch: string;
          funding?: string | null;
          url?: string | null;
        };
        Update: {
          name?: string;
          email?: string;
          company?: string | null;
          stage?: string | null;
          invest_type?: string | null;
          pitch?: string;
          funding?: string | null;
          url?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          type: "download" | "unlock";
          price_points: number;
          file_path: string | null;
          unlock_key: string | null;
          category: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          slug: string;
          name: string;
          description: string;
          type: "download" | "unlock";
          price_points: number;
          file_path?: string | null;
          unlock_key?: string | null;
          category?: string | null;
          active?: boolean;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string;
          type?: "download" | "unlock";
          price_points?: number;
          file_path?: string | null;
          unlock_key?: string | null;
          category?: string | null;
          active?: boolean;
        };
        Relationships: [];
      };
      purchases: {
        Row: {
          id: string;
          email: string;
          product_id: string;
          price_paid_points: number;
          created_at: string;
        };
        Insert: {
          email: string;
          product_id: string;
          price_paid_points: number;
        };
        Update: {
          email?: string;
          product_id?: string;
          price_paid_points?: number;
        };
        Relationships: [];
      };
      rate_limits: {
        Row: {
          key: string;
          count: number;
          window_start: string;
        };
        Insert: {
          key: string;
          count?: number;
          window_start?: string;
        };
        Update: {
          key?: string;
          count?: number;
          window_start?: string;
        };
        Relationships: [];
      };
      points_balances: {
        Row: {
          email: string;
          balance: number;
          updated_at: string;
        };
        Insert: {
          email: string;
          balance?: number;
        };
        Update: {
          email?: string;
          balance?: number;
        };
        Relationships: [];
      };
      points_transactions: {
        Row: {
          id: string;
          email: string;
          delta: number;
          reason: string;
          created_at: string;
        };
        Insert: {
          email: string;
          delta: number;
          reason: string;
        };
        Update: {
          email?: string;
          delta?: number;
          reason?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          email: string;
          status: string;
          plan: string;
          paystack_customer_code: string | null;
          paystack_subscription_code: string | null;
          current_period_end: string | null;
          created_at: string;
        };
        Insert: {
          email: string;
          status: string;
          plan: string;
          paystack_customer_code?: string | null;
          paystack_subscription_code?: string | null;
          current_period_end?: string | null;
        };
        Update: {
          email?: string;
          status?: string;
          plan?: string;
          paystack_customer_code?: string | null;
          paystack_subscription_code?: string | null;
          current_period_end?: string | null;
        };
        Relationships: [];
      };
      tool_leads: {
        Row: {
          id: string;
          tool: string;
          email: string | null;
          source: string;
          selections: Record<string, unknown>;
          result: Record<string, unknown>;
          subscribed: boolean;
          created_at: string;
        };
        Insert: {
          tool: string;
          email?: string | null;
          source: string;
          selections: Record<string, unknown>;
          result: Record<string, unknown>;
          subscribed: boolean;
        };
        Update: {
          tool?: string;
          email?: string | null;
          source?: string;
          selections?: Record<string, unknown>;
          result?: Record<string, unknown>;
          subscribed?: boolean;
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
