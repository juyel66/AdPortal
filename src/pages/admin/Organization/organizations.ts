// types/organizations.ts

export interface Organization {
  snowflake_id: string;
  name: string | null;
  website: string | null;
  industry: string | null;
  company_size: string | null;
}

export interface OrganizationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Organization[];
}

export interface OrganizationsFilters {
  industry: string;
  companySize: string;
}

// Optional: Extended organization type with additional fields if needed
export interface ExtendedOrganization extends Organization {
  created_at?: string;
  updated_at?: string;
  status?: 'active' | 'inactive' | 'suspended';
  subscription_tier?: string;
  total_users?: number;
  total_campaigns?: number;
}

// Optional: For organization details page
export interface OrganizationDetails extends ExtendedOrganization {
  billing_email?: string;
  phone?: string;
  address?: string;
  tax_id?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  primary_contact_name?: string;
  primary_contact_email?: string;
  primary_contact_phone?: string;
}