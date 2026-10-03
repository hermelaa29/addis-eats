import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useFavoritesStore } from "../store/favoritesStore";
import { useToastStore } from "../store/toastStore";

export default function DishCard({ dish }) {
  const addItem = useCartStore((state) => state.addItem);
  const { favoriteIds, toggleFavorite } = useFavoritesStore();
  const showToast = useToastStore((state) => state.showToast);

  const isFavorite = favoriteIds.includes(dish.id);
  const isAvailable = dish.available !== false;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    toggleFavorite(dish.id);
    showToast(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addItem(dish);
    showToast("Added to cart");
  };

  if (dish.premium) {
    return (
      <article className="premium-dish-card dish-card">
        <Link className="premium-dish-image" to={`/menu/${dish.id}`} style={{ backgroundImage: `url(${dish.image})` }}>
          <span className="premium-dish-category">{dish.category}</span>
          <button
            className={`premium-favorite ${isFavorite ? "is-favorite" : ""}`}
            onClick={handleFavoriteClick}
            aria-label="Toggle favorite"
          >
            {isFavorite ? "♥" : "♡"}
          </button>
          <div className="premium-dish-overlay">
            <span>{dish.tag}</span>
            <h3>{dish.name}</h3>
            <p>{dish.description.substring(0, 70)}...</p>
          </div>
        </Link>
        <div className="premium-dish-footer">
          <strong>{dish.price} <small>ETB</small></strong>
          <span className="premium-view-link">View <span>→</span></span>
          <button 
            className="premium-cart-button" 
            onClick={handleAddToCart}
            disabled={!isAvailable}
            style={{ opacity: isAvailable ? 1 : 0.5, cursor: isAvailable ? "pointer" : "not-allowed" }}
          >
            <span>{isAvailable ? "Add +" : "Sold Out"}</span>
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="dish-card">
      <Link className="dish-art" to={`/menu/${dish.id}`} style={{ backgroundImage: `url(${dish.image})` }}>
        <span>{dish.emoji || "🍽️"}</span>
        {dish.tag && <small>{dish.tag}</small>}
        <button
          className={`premium-favorite dish-art-favorite ${isFavorite ? "is-favorite" : ""}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? `Remove ${dish.name} from favorites` : `Add ${dish.name} to favorites`}
          aria-pressed={isFavorite}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </Link>
      <div className="dish-info">
        <div>
          <p className="eyebrow">{dish.category}</p>
          <h3><Link to={`/menu/${dish.id}`}>{dish.name}</Link></h3>
        </div>
      </div>
      <div className="premium-dish-footer">
        <strong>{dish.price} <small>ETB</small></strong>
        <Link className="premium-view-link" to={`/menu/${dish.id}`}>View <span>→</span></Link>
        <button 
          className="premium-cart-button" 
          onClick={handleAddToCart}
          disabled={!isAvailable}
          style={{ opacity: isAvailable ? 1 : 0.5, cursor: isAvailable ? "pointer" : "not-allowed" }}
        >
          <span>{isAvailable ? "Add +" : "Sold Out"}</span>
        </button>
      </div>
    </article>
  );
}
