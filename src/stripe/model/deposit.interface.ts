export interface Deposit {
  amount: number;
  currency: string;
  customer: string;
  source: string;
  description?: string;
}
