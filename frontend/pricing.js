export const DISCOUNT_THRESHOLD = 10000;
export const DISCOUNT_RATE = 0.1;

export function calculatePricing(items) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = subtotal > 0 && subtotal < 999 ? 99 : 0;
    const discount = subtotal > DISCOUNT_THRESHOLD ? Math.round(subtotal * DISCOUNT_RATE) : 0;

    return {
        subtotal,
        delivery,
        discount,
        total: subtotal + delivery - discount
    };
}