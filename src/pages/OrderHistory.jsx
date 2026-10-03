import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useCartStore } from "../store/cartStore";
import { useOrdersStore } from "../store/ordersStore";
import { useToastStore } from "../store/toastStore";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function OrderHistory() {
  const orders = useOrdersStore((state) => state.orders);
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.showToast);
  const pageRef = useRef(null);
  
  const reorder = (order) => {
    order.items.forEach(({ dish, quantity }) => {
      Array.from({ length: quantity }).forEach(() => addItem(dish));
    });
    showToast("Added previous order to cart");
  };

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".page-intro > *", { y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" });
    }, pageRef);
    return () => ctx.revert();
  }, []);
  
  useEffect(() => {
    if (orders.length === 0 || !pageRef.current) return;
    const ctx = gsap.context(() => {
      const articles = document.querySelectorAll(".admin-order");
      articles.forEach((article) => {
        gsap.from(article, {
          scrollTrigger: {
            trigger: article,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.1,
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, [orders.length]);

  return (
    <main className="page" ref={pageRef}>
      <div className="page-intro">
        <p className="eyebrow">Your table, remembered</p>
        <h1>Order history.</h1>
        <p>Find a favourite order and bring it back with one click.</p>
      </div>
      {orders.length === 0 ? (
        <div className="state state-empty"><h2>No past orders yet</h2><p>Your completed orders will appear here.</p><Link className="button button-dark" to="/menu">Browse the menu</Link></div>
      ) : (
        <div className="admin-orders">
          {orders.map((order) => (
            <article className="admin-order" key={order.id}>
              <div className="admin-order-heading"><div><strong>{order.id}</strong><span>{new Date(order.createdAt).toLocaleString()}</span></div><b>{order.status}</b></div>
              <div className="admin-order-details"><div><span>Items</span><strong>{order.items.map(({ dish, quantity }) => `${quantity} × ${dish.name}`).join(", ")}</strong></div><div><span>Deliver to</span><strong>{order.customer.address}</strong></div><div><span>Total</span><strong>{order.total} ETB</strong></div></div>
              <button className="button button-dark" type="button" onClick={() => reorder(order)}>Reorder <span>+</span></button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
