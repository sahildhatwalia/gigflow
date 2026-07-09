import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiEdit, FiDollarSign, FiTag, FiBriefcase } from "react-icons/fi";
import api from "../api/axios";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const res = await api.get(`/${id}`);
      setForm(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/${id}`, {
        name: form.name,
        price: form.price,
        category: form.category,
      });

      alert("Product Updated Successfully");

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

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

        <form
          onSubmit={updateProduct}
          className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-100 relative overflow-hidden shadow-sm w-full"
        >
          {/* Decorative accent top bar */}
          <div className="absolute top-0 left-0 w-full h-[4px] bg-indigo-600" />
          
          <h2 className="text-2xl font-bold mb-8 text-slate-900 tracking-tight flex items-center gap-2">
            <FiEdit className="text-indigo-600 text-2xl" />
            <span>Edit Product</span>
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <FiBriefcase className="text-slate-400" />
                <span>Product Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Mechanical Keyboard"
                required
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 h-11 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <FiDollarSign className="text-slate-400" />
                <span>Price (INR)</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 4999"
                required
                min="0"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 h-11 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <FiTag className="text-slate-400" />
                <span>Category</span>
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Electronics"
                required
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 h-11 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold h-11 rounded-lg shadow-xs transition-all active:scale-[0.99] cursor-pointer mt-8"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;