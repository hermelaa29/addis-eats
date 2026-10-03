import { Link, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDishesStore } from "../store/dishesStore";
import { useCartStore } from "../store/cartStore";
import { useToastStore } from "../store/toastStore";
import { ErrorMessage, Spinner } from "../ui/States";
import gsap from "gsap";

export default function DishDetail() {
  const { id } = useParams();
  const { dishes, loading, error, fetchDishes } = useDishesStore();
  
  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);
  
  const dish = dishes?.find((item) => item.id === id);
  
  const addItem = useCartStore((state) => state.addItem);
  const itemCount = useCartStore((state) => state.getItemCount());
  const showToast = useToastStore((state) => state.showToast);
  
  const pageRef = useRef(null);
  
  const handleAddToCart = () => {
    addItem(dish);
    showToast("Added to cart");
  };

  useEffect(() => {
    if (!dish || !pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".detail-art", { x: -40, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".detail-copy > *", { y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out", delay: 0.1 });
    }, pageRef);
    return () => ctx.revert();
  }, [dish]);

  if (loading)
    return (
      <main className="page">
        <Spinner label="Finding that dish" />
      </main>
    );
  if (error)
    return (
      <main className="page">
        <ErrorMessage onRetry={() => window.location.reload()} />
      </main>
    );
  if (!dish)
    return (
      <main className="page narrow">
        <div className="state state-empty">
          <span className="state-mark">?</span>
          <h1>Dish not found</h1>
          <p>
            That dish may have moved off the menu. There are plenty more good
            things to try.
          </p>
          <Link className="button button-dark" to="/menu">
            Back to menu
          </Link>
        </div>
      </main>
    );
  return (
    <main className="page" ref={pageRef}>
      <Link className="back-link" to="/menu">
        ← Back to menu
      </Link>
      <section className="detail-layout">
        <div
          className={`detail-art accent-${dish.accent}`}
          style={{ backgroundImage: `url(${dish.image})` }}
        >
          <small>{dish.tag}</small>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{dish.category}</p>
          <h1>{dish.name}</h1>
          <p className="detail-description">{dish.description}</p>
          <div className="detail-price">
            {dish.price} <small>ETB</small>
          </div>
          <button className="button button-dark" onClick={handleAddToCart}>
            Add to order <span>+</span>
          </button>
          {itemCount > 0 && (
            <Link className="detail-cart" to="/cart">
              Your bag has {itemCount} {itemCount === 1 ? "item" : "items"} →
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
