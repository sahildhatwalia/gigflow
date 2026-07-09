import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiPlus, FiInbox } from "react-icons/fi";
import api from "../api/axios";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/${id}`);
      alert("Product Deleted");
      getProducts();
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-5 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Product Inventory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your store's products, prices, and categories in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <FiPackage className="text-sm" />
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </span>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center bg-white border border-dashed border-slate-200 rounded-2xl p-12 max-w-md mx-auto my-12 shadow-xs">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 mb-4">
            <FiInbox className="h-6 w-6 stroke-[2]" />
          </div>
          <h3 className="mt-2 text-sm font-semibold text-slate-900">No products</h3>
          <p className="mt-1 text-sm text-slate-500">
            Get started by creating a new product in your inventory.
          </p>
          <div className="mt-6">
            <Link
              to="/create"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-xs transition-all active:scale-[0.98]"
            >
              <FiPlus className="text-base stroke-[2.5]" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={deleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

