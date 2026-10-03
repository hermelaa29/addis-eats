import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { categories } from "../api/dishes";
import { useDishesStore } from "../store/dishesStore";
import DishCard from "../components/DishCard";
import { EmptyState, ErrorMessage, Spinner } from "../ui/States";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All";
  const [search, setSearch] = useState("");
  const { dishes, loading, error, fetchDishes } = useDishesStore();
  
  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);
  
  
  const pageRef = useRef(null);
  
  const filteredDishes =
    dishes?.filter(
      (dish) =>
        (selectedCategory === "All" || dish.category === selectedCategory) &&
        dish.name.toLowerCase().includes(search.trim().toLowerCase()),
    ) || [];
    
  const chooseCategory = (category) => {
    category === "All" ? setSearchParams({}) : setSearchParams({ category });
  };
  
  useEffect(() => {
    if (!pageRef.current) return;
    
    const ctx = gsap.context(() => {
      // Intro animation
      gsap.from(".page-intro > *", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });
      
      gsap.from(".category-bar", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out",
      });
    }, pageRef);
    
    return () => ctx.revert();
  }, []);
  
  useEffect(() => {
    if (loading || error || filteredDishes.length === 0 || !pageRef.current) return;
    
    const ctx = gsap.context(() => {
      const cards = document.querySelectorAll(".dish-card");
      cards.forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          y: 60,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.1,
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, [loading, error, filteredDishes.length]);
  
  return (
    <main className="page" ref={pageRef}>
      <div className="page-intro">
        <p className="eyebrow">Take your pick</p>
        <h1>The menu</h1>
        <p>
          Familiar favourites and new rituals, made for the way Addis eats
          today.
        </p>
      </div>
      <div className="category-bar" aria-label="Filter menu by category">
        {categories.map((category) => (
          <button
            className={
              selectedCategory === category ? "category active" : "category"
            }
            key={category}
            onClick={() => chooseCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: "40px" }}>
        <label className="search-field" htmlFor="menu-search">Search dishes
          <input 
            id="menu-search" 
            type="search" 
            value={search} 
            onChange={(event) => setSearch(event.target.value)} 
            placeholder="Search by dish name" 
            style={{ marginTop: "10px", width: "100%", maxWidth: "400px" }}
          />
        </label>
      </div>
      
      {loading && <Spinner label="Fetching today's dishes" />}
      {error && <ErrorMessage onRetry={() => window.location.reload()} />}
      {!loading && !error && filteredDishes.length === 0 && (
        <EmptyState
          title="Nothing on this table yet"
          message={`We do not have any ${selectedCategory.toLowerCase()} dishes right now. Try another category.`}
          action={
            <button
              className="button button-dark"
              onClick={() => chooseCategory("All")}
            >
              Show all dishes
            </button>
          }
        />
      )}
      {!loading && !error && filteredDishes.length > 0 && (
        <div className="dish-grid">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </main>
  );
}
