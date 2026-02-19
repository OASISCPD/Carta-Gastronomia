export interface MenuItem {
  carta: string;
  clasificacion: string;
  "nombre largo": string;
  monto: number;
  "monto individual": number | null;
  "apto vegano": boolean | null | string;
  "info producto": string | null;
  url_image?: string | null;
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedSize: "individual" | "complete";
}
