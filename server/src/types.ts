export interface User {
  id?: number;
  email: string;
  password?: string;
  token?: string;
}

export interface Ingredient {
  id: number;
    name: string;
    price: number;
    quantity: number;
    store: string;
    user_id: number;
}

export interface Meal {
    id: number;
    name: string;
    category: string;
    price: number;
    user_id: number;
    ingredients: Ingredient[];
}

export interface DailyPlan {
    id: number;
    date: string;
    user_id: number;
    meals: Meal[];
    ingredients: Ingredient[];
}

export interface WeeklyPlan {
    id: number;
    start_date: string;
    end_date: string;
    user_id: number;
}
