import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiPlus,
  FiInbox,
} from "react-icons/fi";
import { useContext } from "react";
import { SearchContext } from "../context/SearchContext";
import api from "../api/axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import ProductCard, {
  ProductCardSkeleton,
} from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { search } = useContext(SearchContext);

  // Fetch Products
  const getProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/products?page=${page}&limit=8`);

      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Search Products
  const searchProducts = async (query) => {
    try {
      setLoading(true);

      const res = await api.get(`/products/search?query=${query}`);

      setProducts(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Runs whenever page or search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() === "") {
        getProducts();
      } else {
        searchProducts(search);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [page, search]);

  // Delete Product
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
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/products/${id}`);

      setProducts((prev) =>
        prev.filter((item) => item._id !== id)
      );

      toast.success("Product Deleted");
    } catch (err) {
      console.log(err);
      toast.error("Delete Failed");
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

      {/* Pagination */}
      {search.trim() === "" && (
        <div className="flex justify-center items-center gap-5 mt-12">

          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <span className="font-semibold text-slate-700">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={page === totalPages}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}
    </div>
  );
}

export default Home;