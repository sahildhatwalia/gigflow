import { Link } from "react-router-dom";
import { FiEye, FiEdit3, FiTrash2, FiTag } from "react-icons/fi";

function ProductCard({ product, onDelete }) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
                <img
                    src={
                        product.image
                            ? product.image.startsWith("http")
                                ? product.image
                                : `http://localhost:5000/${product.image}`
                            : ""
                    }
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                />
                <div className="flex justify-between items-start mb-4">
                    {/* Category Pill */}
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2.5 py-1 rounded-full">
                        <FiTag className="text-[10px]" />
                        {product.category || "General"}
                    </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 tracking-tight line-clamp-1">
                    {product.name}
                </h2>

                <div className="mt-3 flex items-baseline gap-0.5">
                    <span className="text-sm font-semibold text-slate-400">₹</span>
                    <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {Number(product.price).toLocaleString("en-IN")}
                    </span>
                </div>
            </div>

            {/* Button Actions */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-100">
                <Link
                    to={`/view/${product._id}`}
                    className="inline-flex items-center justify-center gap-1 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-600 text-xs font-semibold py-2 rounded-lg transition-colors active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="View Details"
                >
                    <FiEye className="text-sm" />
                    <span>View</span>
                </Link>

                <Link
                    to={`/edit/${product._id}`}
                    className="inline-flex items-center justify-center gap-1 border border-indigo-200 hover:bg-indigo-50/60 text-indigo-600 text-xs font-semibold py-2 rounded-lg transition-colors active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Edit Product"
                >
                    <FiEdit3 className="text-sm" />
                    <span>Edit</span>
                </Link>

                <button
                    onClick={() => onDelete(product._id)}
                    className="inline-flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    title="Delete Product"
                >
                    <FiTrash2 className="text-sm" />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs animate-pulse flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                    {/* Category Pill skeleton */}
                    <div className="h-6 w-20 bg-slate-100 rounded-full" />
                </div>

                {/* Title skeleton */}
                <div className="h-5 w-3/4 bg-slate-100 rounded-md mb-3" />

                {/* Price skeleton */}
                <div className="mt-3 h-7 w-24 bg-slate-100 rounded-md" />
            </div>

            {/* Button Actions skeleton */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-100">
                <div className="h-8 bg-slate-50 rounded-lg" />
                <div className="h-8 bg-slate-50 rounded-lg" />
                <div className="h-8 bg-slate-50 rounded-lg" />
            </div>
        </div>
    );
}

export default ProductCard;
