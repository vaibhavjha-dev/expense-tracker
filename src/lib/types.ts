export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    amount: number;
    description: string;
    category: string;
    date: string; // ISO string
    type: TransactionType;
}

export const CATEGORIES = {
    income: ['salary', 'freelance', 'investments', 'other'],
    expense: ['food', 'transport', 'housing', 'utilities', 'entertainment', 'health', 'shopping', 'travel', 'recreational', 'other'],
};
