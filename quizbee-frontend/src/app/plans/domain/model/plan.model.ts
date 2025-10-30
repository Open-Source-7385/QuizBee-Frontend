export interface Plan {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  popular: boolean;
}
