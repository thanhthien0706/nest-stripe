export interface WithdrawModel {
  amount: number;
  currency: string;
  destination: string;
  source_type?: 'bank_account' | 'card' | 'fpx';
}
