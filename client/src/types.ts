export interface Meal {
    id: number;
    name: string;
    category: string;
    price: number;
    user_id: number;
  }
  
  export interface Ingredient {
    id: number;
    name: string;
    price: number;
    quantity: number;
    store: string;
    user_id: number;
  }
  