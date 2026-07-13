import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiPlus, FiInbox, FiSearch } from "react-icons/fi";
import api from "../api/axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch all products
  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      toast.success("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const searchProducts = async (query) => {
    try {
      setLoading(true);

      const res = await api.get(`/search?query=${query}`);

      setProducts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Runs on first load & when search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() === "") {
        getProducts();
      } else {
        searchProducts(search);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Delete
 const deleteProduct = async (id) => {
  const result = await Swal.fire({
    title: "Delete Product?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#4f46e5",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
    background: "#ffffff",
  });

  if (!result.isConfirmed) return;

  try {
    await api.delete(`/${id}`);

    setProducts((prev) => prev.filter((item) => item._id !== id));

    toast.success("🗑️ Product deleted successfully!");
  } catch (err) {
    console.log(err);
    toast.error("❌ Failed to delete product!");
  }
};
  return (
    <div className="max-w-7xl mx-auto px-5 py-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-8">

        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Product Inventory
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your products easily.
          </p>
        </div>

        <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-semibold">
          {products.length} Products
        </span>
      </div>

      {/* Search + Add */}
      <div className="flex flex-col md:flex-row justify-between gap-5 mb-10">

        <div className="relative w-full md:w-96">

          <FiSearch className="absolute left-4 top-3.5 text-gray-400" />

          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
          />

        </div>

        <Link
          to="/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <FiPlus />
          Add Product
        </Link>

      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">

          <FiInbox className="mx-auto text-6xl text-gray-300 mb-5" />

          <h2 className="text-2xl font-bold text-gray-600">
            No Products Found
          </h2>

          <p className="text-gray-500 mt-2">
            Try another search or create a new product.
          </p>

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