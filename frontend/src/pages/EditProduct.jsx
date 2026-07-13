import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiEdit,
  FiDollarSign,
  FiTag,
  FiBriefcase,
} from "react-icons/fi";
import api from "../api/axios";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category", form.category);

      if (image) {
        formData.append("image", image);
      }

      await api.put(`/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product Updated Successfully");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
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
          className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="absolute top-0 left-0 w-full h-[4px] bg-indigo-600"></div>

          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <FiEdit className="text-indigo-600" />
            Edit Product
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                <FiBriefcase className="inline mr-1" />
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 h-11"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                <FiDollarSign className="inline mr-1" />
                Price
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 h-11"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                <FiTag className="inline mr-1" />
                Category
              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 h-11"
                required
              />
            </div>

            {/* Current Image */}
            {(preview || form.image) && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Current Image
                </label>

                <img
                  src={
                    preview
                      ? preview
                      : `http://localhost:5000/${form.image}`
                  }
                  alt="Product"
                  className="w-40 h-40 object-cover rounded-lg border"
                />
              </div>
            )}

            {/* Upload New Image */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Change Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-11 mt-8"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;