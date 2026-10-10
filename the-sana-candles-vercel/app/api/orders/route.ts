const prices: Record<string, number> = {
  "Iced Raspberry Latte": 500,
  "Iced Classic Latte": 350,
  "Iced Strawberry Matcha Latte": 500,
  "Iced Coffee Swirl Candle": 650,
};

export async function POST(request: Request) {
  try {
    const data = await request.json() as { name?: string; phone?: string; address?: string; notes?: string; items?: { name: string; quantity: number }[] };
    const name = data.name?.trim() ?? "";
    const phone = data.phone?.trim() ?? "";
    const address = data.address?.trim() ?? "";
    const items = (data.items ?? []).filter((item) => prices[item.name] && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20);
    if (name.length < 2 || phone.length < 8 || address.length < 8 || !items.length) return Response.json({ error: "Please complete your order details." }, { status: 400 });
    const total = items.reduce((sum, item) => sum + prices[item.name] * item.quantity, 0);
    const orderId = `${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    return Response.json({ orderNumber: `SANA-${orderId}`, total }, { status: 201 });
  } catch {
    return Response.json({ error: "Could not confirm your order. Please try again." }, { status: 500 });
  }
}
