export interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
}

export const PRODUCT_LIST: Product[] = [
  { id: 1, nombre: 'Zapatillas Running', precio: 89.99, imagen: '👟' },
  { id: 2, nombre: 'Mochila Impermeable', precio: 45.50, imagen: '🎒' },
  { id: 3, nombre: 'Gorra Deportiva', precio: 19.99, imagen: '🧢' }
];
