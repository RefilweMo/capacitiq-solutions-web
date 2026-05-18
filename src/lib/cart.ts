/** Localstorage cart of selected template IDs (browser-only). */
const KEY = "capacitiq.cart.v1";

export type CartItem = { id: string; name: string; price_cents: number };

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function write(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("capacitiq.cart.changed"));
}
export const cart = {
  get: read,
  add(item: CartItem) {
    const items = read();
    if (!items.find((i) => i.id === item.id)) items.push(item);
    write(items);
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  clear() {
    write([]);
  },
};
