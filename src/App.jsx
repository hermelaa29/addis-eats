import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { RequireAuth } from "./store/authStore";
import { RequireAdmin } from "./admin/AdminAuthContext";
import { ErrorBoundary } from "./ui/ErrorBoundary";
import { Spinner } from "./ui/States";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import DishDetail from "./pages/DishDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Favorites from "./pages/Favorites";
import AdminDashboard from "./pages/AdminDashboard";
import OrderHistory from "./pages/OrderHistory";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminMenu from "./admin/AdminMenu";
import AdminOrders from "./admin/AdminOrders";
const Checkout = lazy(() => import("./pages/Checkout"));

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="menu/:id" element={<DishDetail />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="cart" element={<Cart />} />
            <Route path="login" element={<Login />} />
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
              <Route index element={<AdminDashboard />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
            <Route
              path="checkout"
              element={
                <RequireAuth>
                  <Suspense
                    fallback={
                      <main className="page">
                        <Spinner label="Opening checkout" />
                      </main>
                    }
                  >
                    <Checkout />
                  </Suspense>
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
