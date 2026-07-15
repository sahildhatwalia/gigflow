import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiTag, FiDollarSign, FiCalendar, FiBox } from "react-icons/fi";
import api from "../api/axios";

function ViewProduct() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.log(err);
      alert("Product not found");
    }
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent mb-4" />
        <h2 className="text-sm font-medium text-slate-500">Loading product details...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">

      <div className="w-full max-w-md flex flex-col">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 text-sm font-semibold w-fit transition-colors"
        >
          <FiArrowLeft className="text-base" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-100 relative overflow-hidden shadow-sm w-full">
          {/* Decorative accent top bar */}
          <div className="absolute top-0 left-0 w-full h-[4px] bg-indigo-600" />

          <div className="bg-indigo-50 p-4 rounded-xl w-fit text-indigo-600 mb-6 border border-indigo-100/50 shadow-xs">
            <FiBox className="text-3xl" />
          </div>

          <div>
            {product.image ? (
              <img
                src={
                  product.image.startsWith("http")
                    ? product.image
                    : `http://localhost:5000/${product.image}`
                }
                alt={product.name}
                className="w-full bg-amber-300 h-64 object-cover rounded-xl mb-5"
              />
            ) : (
              <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center mb-5">
                <FiBox className="text-6xl text-indigo-600" />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-8">
            {product.name}
          </h1>

          <div className="space-y-4 border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FiDollarSign className="text-slate-400" />
                <span>Price</span>
              </span>
              <span className="text-lg font-extrabold text-slate-900">
                ₹ {Number(product.price).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FiTag className="text-slate-400" />
                <span>Category</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2.5 py-0.5 rounded-full">
                {product.category || "General"}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FiCalendar className="text-slate-400" />
                <span>Created At</span>
              </span>
              <span className="text-sm font-medium text-slate-600">
                {new Date(product.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-indigo-50 hover:bg-indigo-100/80 text-indigo-600 text-sm font-semibold px-6 py-2 rounded-lg transition-all active:scale-[0.98]"
            >
              Done
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProduct;