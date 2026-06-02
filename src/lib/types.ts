/** Plain types safe to pass from Server to Client Components */

export type CategoryDTO = {
  id: string;
  name: string;
  color: string;
};

export type ExpenseDTO = {
  id: string;
  amount: number;
  date: string;
  comment: string;
  categoryId: string;
  category: CategoryDTO;
};
