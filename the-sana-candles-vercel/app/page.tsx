"use client";

import { FormEvent, useMemo, useState } from "react";

const products = [
  { name: "Iced Raspberry Latte", arabic: "آيسد راسبيري لاتيه", scent: "Raspberry · Creamy Latte", price: 480, tone: "raspberry", image: "/iced-raspberry-latte.jpeg" },
  { name: "Iced Classic Latte", arabic: "آيسد كلاسيك لاتيه", scent: "Coffee · Milk · Vanilla", price: 480, tone: "classic", image: "/iced-classic-latte.jpeg" },
  { name: "Iced Strawberry Matcha Latte", arabic: "آيسد ستروبيري ماتشا لاتيه", scent: "Strawberry · Matcha · Cream", price: 520, tone: "matcha", image: "/iced-strawberry-matcha-latte.jpeg" },
];

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState("");
  const [bagOpen, setBagOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<{ number: string; total: number; whatsappUrl: string } | null>(null);
  const cartItems = products.filter((product) => cart[product.name]).map((product) => ({ ...product, quantity: cart[product.name] }));
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const total = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);

  const add = (name: string) => {
    setCart((value) => ({ ...value, [name]: (value[name] ?? 0) + 1 }));
    setNotice(`${name} added to your bag`);
    window.setTimeout(() => setNotice(""), 1800);
  };

  const changeQuantity = (name: string, change: number) => setCart((current) => {
    const next = Math.max(0, (current[name] ?? 0) + change);
    const updated = { ...current, [name]: next };
    if (!next) delete updated[name];
    return updated;
  });

  const placeOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: form.get("name"), phone: form.get("phone"), address: form.get("address"), notes: form.get("notes"), items: cartItems.map(({ name, quantity }) => ({ name, quantity })) }) });
    const result = await response.json() as { orderNumber?: string; total?: number; error?: string };
    setSubmitting(false);
    if (!response.ok || !result.orderNumber) { setNotice(result.error ?? "Could not confirm your order."); return; }
    const orderTotal = result.total ?? total;
    const lines = cartItems.map((item) => `• ${item.name} × ${item.quantity} — ${item.price * item.quantity} EGP`).join("\n");
    const message = `طلب جديد من The Sana Candles\nرقم الطلب: ${result.orderNumber}\n\n${lines}\n\nالإجمالي: ${orderTotal} EGP\nالاسم: ${form.get("name")}\nالموبايل: ${form.get("phone")}\nالعنوان: ${form.get("address")}\nملاحظات: ${form.get("notes") || "لا يوجد"}`;
    setConfirmed({ number: result.orderNumber, total: orderTotal, whatsappUrl: `https://wa.me/201006182846?text=${encodeURIComponent(message)}` });
    setCart({});
  };

  return (
    <main>
      <div className="announcement">Free delivery in Cairo on orders over 900 EGP <span>·</span> توصيل مجاني داخل القاهرة</div>
      <header className="nav wrap">
        <a className="logo brand-image" href="#top" aria-label="The Sana Candles home"><img src="/brand-logo.jpg" alt="Sana Candles logo" /><strong>The Sana Candles</strong></a>
        <nav aria-label="Main navigation">
          <a href="#shop">Shop</a><a href="#story">Our story</a><a href="#gifts">Gifts</a>
        </nav>
        <button className="bag" onClick={() => { setBagOpen(true); setCheckout(false); setConfirmed(null); }} aria-label={`Open bag with ${cartCount} items`}>Bag <span>{cartCount}</span></button>
      </header>

      <section className="hero wrap" id="top">
        <div className="hero-copy">
          <p className="eyebrow">HAND-POURED IN EGYPT · صُنعت بحب</p>
          <h1>Light a softer<br/>kind of <em>moment.</em></h1>
          <p className="intro">Small-batch candles made with clean wax, soulful scents, and the quiet intention to make home feel warmer.</p>
          <div className="actions"><a className="primary" href="#shop">Shop the collection</a><a className="text-link" href="#story">Meet Sana <span>↗</span></a></div>
          <div className="trust"><span>Natural soy wax</span><span>40+ hour burn</span><span>Made by hand</span></div>
        </div>
        <div className="hero-art real-hero" aria-label="The Sana Candles iced latte candle collection"><img src="/candle-collection.jpeg" alt="Three handmade iced latte candles from The Sana Candles" /><p className="art-note">Handmade dessert candles<br/>that look good enough to drink.</p></div>
      </section>

      <section className="shop wrap" id="shop">
        <div className="section-head"><div><p className="eyebrow">THE SIGNATURE EDIT</p><h2>Scents for every mood</h2></div><p>ثلاث روائح، كل واحدة تحكي حكاية مختلفة.</p></div>
        <div className="products">
          {products.map((product, index) => (
            <article className="product" key={product.name}>
              <div className={`product-art ${product.tone}`}><span>0{index + 1}</span><img src={product.image} alt={`${product.name} candle`} /></div>
              <div className="product-info"><div><p>{product.scent}</p><h3>{product.name}</h3><span>{product.arabic}</span></div><strong>{product.price} EGP</strong></div>
              <button onClick={() => add(product.name)}>Add to bag <span>＋</span></button>
            </article>
          ))}
        </div>
      </section>

      <section className="story" id="story"><div className="wrap story-grid">
        <div className="story-art"><div className="story-candle"></div><p>POURED SLOWLY<br/>BURNED BEAUTIFULLY</p></div>
        <div className="story-copy"><p className="eyebrow">OUR STORY · حكايتنا</p><h2>Made for the pause<br/>between everything.</h2><p>The Sana Candles began with one simple belief: everyday rituals deserve beautiful things. Every candle is poured by hand in small batches, using a clean soy blend and carefully layered fragrances.</p><blockquote>“Sana means radiance — the kind that starts quietly, from within.”</blockquote><a className="text-link" href="#gifts">Discover our story <span>↗</span></a></div>
      </div></section>

      <section className="gifts wrap" id="gifts"><p className="eyebrow">A LITTLE LIGHT, BEAUTIFULLY GIVEN</p><h2>Made for gifting</h2><p>Birthdays, thank-yous, new homes, or just because.<br/>We wrap every gift with care.</p><a className="primary" href="https://wa.me/201000000000?text=Hello%20The%20Sana%20Candles%2C%20I%27d%20like%20to%20ask%20about%20a%20gift%20order">Order a gift</a></section>
      <footer><div className="wrap"><a className="logo footer-brand" href="#top">The Sana Candles</a><p>Hand-poured with warmth in Egypt.</p><div><a href="#shop">Shop</a><a href="#story">Story</a><a href="#gifts">Gifts</a></div><small>© 2026 The Sana Candles</small></div></footer>
      {bagOpen && <div className="bag-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setBagOpen(false); }}>
        <aside className="bag-panel" aria-label="Shopping bag" role="dialog" aria-modal="true">
          <div className="bag-head"><div><p className="eyebrow">YOUR SELECTION</p><h2>{confirmed ? "Order confirmed" : checkout ? "Checkout" : "Your bag"}</h2></div><button onClick={() => setBagOpen(false)} aria-label="Close bag">×</button></div>
          {confirmed ? <div className="confirmation"><div>✓</div><h3>Thank you, your order is confirmed.</h3><p>شكراً! تم تسجيل طلبك. اضغط الزر لإرسال التفاصيل للمتجر على واتساب وتأكيد موعد التوصيل.</p><strong>{confirmed.number}</strong><span>Total · {confirmed.total} EGP</span><a className="primary whatsapp-confirm" href={confirmed.whatsappUrl} target="_blank" rel="noreferrer">Send order on WhatsApp</a><button className="secondary-action" onClick={() => setBagOpen(false)}>Continue shopping</button></div>
          : checkout ? <form className="checkout-form" onSubmit={placeOrder}>
              <button className="back" type="button" onClick={() => setCheckout(false)}>← Back to bag</button>
              <label>Full name · الاسم<input name="name" required minLength={2} autoComplete="name" /></label>
              <label>Mobile number · رقم الموبايل<input name="phone" required minLength={8} inputMode="tel" autoComplete="tel" /></label>
              <label>Delivery address · عنوان التوصيل<textarea name="address" required minLength={8} rows={3} autoComplete="street-address" /></label>
              <label>Order notes · ملاحظات<textarea name="notes" rows={2} /></label>
              <div className="checkout-total"><span>Total</span><strong>{total} EGP</strong></div>
              <button className="primary checkout-submit" disabled={submitting}>{submitting ? "Confirming…" : "Confirm order · تأكيد الطلب"}</button>
              <small>Payment is collected on delivery. We’ll call to confirm your order.</small>
            </form>
          : cartItems.length ? <><div className="bag-items">{cartItems.map((item) => <div className="bag-item" key={item.name}><div className={`bag-thumb ${item.tone}`}></div><div><h3>{item.name}</h3><p>{item.scent}</p><div className="quantity"><button onClick={() => changeQuantity(item.name, -1)}>−</button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.name, 1)}>＋</button></div></div><strong>{item.price * item.quantity} EGP</strong></div>)}</div><div className="bag-summary"><div><span>Subtotal</span><strong>{total} EGP</strong></div><p>Delivery is confirmed by phone.</p><button className="primary" onClick={() => setCheckout(true)}>Continue to checkout</button></div></>
          : <div className="empty-bag"><p>Your bag is waiting for a little light.</p><span>السلة فارغة حالياً</span><button className="primary" onClick={() => setBagOpen(false)}>Explore candles</button></div>}
        </aside>
      </div>}
      {notice && <div className="toast" role="status">{notice}</div>}
    </main>
  );
}
