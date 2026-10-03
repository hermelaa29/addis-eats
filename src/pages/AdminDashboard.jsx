import { Link, useNavigate } from "react-router-dom";
import { fetchDishes } from "../api/dishes";
import { useFetch } from "../hooks/useFetch";
import { useAdminAuth } from "../admin/AdminAuthContext";
import { useAuthStore } from "../store/authStore";
import { useOrdersStore } from "../store/ordersStore";
import { ErrorMessage, Spinner } from "../ui/States";

export default function AdminDashboard() {
  const { data: dishes, loading, error } = useFetch(fetchDishes);
  const { signOut: signOutAdmin } = useAdminAuth();
  
  const signOutUser = useAuthStore((state) => state.signOut);
  const orders = useOrdersStore((state) => state.orders);
  const updateOrderStatus = useOrdersStore((state) => state.updateOrderStatus);
  
  const navigate = useNavigate();
  
  const logout = () => {
    signOutUser();
    signOutAdmin();
    navigate("/login", { replace: true });
  };
  
  const categories = dishes
    ? new Set(dishes.map((dish) => dish.category)).size
    : 0;
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const newOrders = orders.filter((order) => order.status === "New").length;
  
  return (
    <main className="page admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Addis Eats / private area</p>
          <h1>Dashboard</h1>
          <p>
            Manage the menu, incoming orders, customer details, and service
            status from one place.
          </p>
        </div>
        <button className="button button-light" onClick={logout}>
          Sign out
        </button>
      </div>
      {loading && <Spinner label="Loading dashboard" />}
      {error && <ErrorMessage onRetry={() => window.location.reload()} />}
      {!loading && !error && (
        <>
          <section className="admin-stats">
            <div>
              <span>Orders</span>
              <strong>{orders.length}</strong>
            </div>
            <div>
              <span>New orders</span>
              <strong>{newOrders}</strong>
            </div>
            <div>
              <span>Revenue</span>
              <strong>
                {revenue} <small>ETB</small>
              </strong>
            </div>
          </section>
          <section className="admin-panel orders-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="eyebrow">Customer activity</p>
                <h2>Incoming orders</h2>
              </div>
              <span className="admin-live-status">● Live in this browser</span>
            </div>
            {orders.length === 0 ? (
              <p className="admin-empty">
                No orders yet. Completed customer checkouts will appear here.
              </p>
            ) : (
              <div className="admin-orders">
                {orders.map((order) => (
                  <article className="admin-order" key={order.id}>
                    <div className="admin-order-heading">
                      <div>
                        <strong>{order.id}</strong>
                        <span>
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <select
                        value={order.status}
                        onChange={(event) =>
                          updateOrderStatus(order.id, event.target.value)
                        }
                        aria-label={`Update status for ${order.id}`}
                      >
                        <option>New</option>
                        <option>Preparing</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </div>
                    <div className="admin-order-details">
                      <div>
                        <span>Customer</span>
                        <strong>{order.customer.name}</strong>
                        <small>{order.customer.phone}</small>
                      </div>
                      <div>
                        <span>Deliver to</span>
                        <strong>{order.customer.address}</strong>
                        {order.customer.note && (
                          <small>Note: {order.customer.note}</small>
                        )}
                      </div>
                      <div>
                        <span>Order total</span>
                        <strong>{order.total} ETB</strong>
                        <small>
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                          )}{" "}
                          items
                        </small>
                      </div>
                    </div>
                    <div className="admin-order-items">
                      {order.items.map((item) => (
                        <span key={item.dish.id}>
                          {item.quantity} × {item.dish.name}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="eyebrow">Current menu</p>
                <h2>Dish catalogue</h2>
              </div>
              <Link className="button button-dark" to="/menu">
                View storefront <span>↗</span>
              </Link>
            </div>
            <div className="admin-table">
              {dishes.map((dish) => (
                <div className="admin-row" key={dish.id}>
                  <div
                    className="admin-row-image"
                    style={{ backgroundImage: `url(${dish.image})` }}
                  />
                  <div>
                    <strong>{dish.name}</strong>
                    <span>{dish.category}</span>
                  </div>
                  <b>{dish.price} ETB</b>
                  <Link
                    to={`/menu/${dish.id}`}
                    aria-label={`View ${dish.name}`}
                  >
                    ↗
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
