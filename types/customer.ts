export type CustomerStatus = "Active" | "Inactive";

export const CUSTOMER_STATUSES: CustomerStatus[] = ["Active", "Inactive"];

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  lastContactDate: string;
  notes: string;
}

export type CustomerInput = Omit<Customer, "id">;

export type CustomerSortField = "name" | "email" | "lastContactDate";

export type SortDirection = "asc" | "desc";

export interface CustomerFilters {
    status: CustomerStatus[];
    companies: string[];
    dateFrom: string;
    dateTo: string;
    phone: string;
    email: string;
  }
  
  export const DEFAULT_FILTERS: CustomerFilters = {
    status: [],
    companies: [],
    dateFrom: "",
    dateTo: "",
    phone: "",
    email: "",
  };