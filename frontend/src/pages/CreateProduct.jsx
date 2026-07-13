import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiPlusCircle,
  FiDollarSign,
  FiTag,
  FiBriefcase,
} from "react-icons/fi";
import api from "../api/axios";

function CreateProduct() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category", form.category);

      if (image) {
        formData.append("image", image);
      }

      await api.post("/", formData);

      toast.success("Product Created Successfully");

      setForm({
        name: "",
        price: "",
        category: "",
      });

      setImage(null);

      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
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
          onSubmit={handleSubmit}
          className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>

          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <FiPlusCircle className="text-indigo-600" />
            Create Product
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold mb-2">
                <FiBriefcase className="inline mr-2" />
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2">
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2">
                <FiDollarSign className="inline mr-2" />
                Price
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                required
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2">
                <FiTag className="inline mr-2" />
                Category
              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                required
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;