import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit2, Trash2, Search, CheckCircle2, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import ImageUpload from "../components/ImageUpload";
import { apiDelete, apiJson, uploadSingleImage, storage } from "../lib/api";

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  features: string[];
  status: "active" | "inactive";
}

type Paginated<T> = { data: T[] };

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    features: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    apiJson<Paginated<Service>>("/construction-services?perPage=50")
        .then((res) => setServices(res.data))
        .catch((e) => toast.error(e.message));
  }, []);

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title ?? "",
        description: service.description ?? "",
        price: service.price ?? "",
        features: (service.features ?? []).join("\n"),
        status: service.status ?? "active",
      });
    } else {
      setEditingService(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        features: "",
        status: "active",
      });
    }
    setUploadedFiles([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setUploadedFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const featuresArray = formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

    try {
      let imageUrl = editingService?.image ?? "";

      if (uploadedFiles.length > 0) {
        const up = await uploadSingleImage(uploadedFiles[0]);
        imageUrl = up.path; // ✅ store path only
      } else if (!editingService) {
        toast.error("Please upload an image");
        return;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        features: featuresArray,
        status: formData.status,
        image: imageUrl,
      };

      if (editingService) {
        const updated = await apiJson<Service>(
            `/construction-services/${editingService.id}`,
            "PUT",
            payload
        );
        setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        toast.success("Service updated successfully!");
      } else {
        const created = await apiJson<Service>("/construction-services", "POST", payload);
        setServices((prev) => [...prev, created]);
        toast.success("Service created successfully!");
      }

      handleCloseModal();
    } catch (e: any) {
      toast.error(e?.message || "Failed to save service");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDelete(`/construction-services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success("Service deleted successfully!");
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
  };

  const toggleStatus = async (id: string) => {
    const service = services.find((s) => s.id === id);
    if (!service) return;
    try {
      const updated = await apiJson<Service>(
          `/construction-services/${id}`,
          "PUT",
          { status: service.status === "active" ? "inactive" : "active" }
      );
      setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      toast.success("Service status updated!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to update status");
    }
  };

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
        (s) =>
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            (s.price ?? "").toLowerCase().includes(q)
    );
  }, [services, searchQuery]);

  return (
      <Layout>
        <div className="p-4 md:p-8 space-y-6">
          {/* Header */}
          <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1e2a3a] mb-2">
                Services
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your service offerings
              </p>
            </div>
            <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f5bf23] hover:bg-[#e6b020] text-white font-medium hover:shadow-lg transition-shadow"
            >
              <Plus className="w-5 h-5" />
              Add Service
            </button>
          </motion.div>

          {/* Search */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50"
            />
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => (
                  <motion.div
                      key={service.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <button
                          onClick={() => toggleStatus(service.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-colors ${
                              service.status === "active"
                                  ? "bg-green-500/20 text-green-600 dark:text-green-400"
                                  : "bg-slate-500/20 text-slate-600 dark:text-slate-400"
                          }`}
                      >
                        {service.status === "active" ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </>
                        ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Inactive
                            </>
                        )}
                      </button>
                    </div>

                    <div className="p-6">
                      {/* Image */}
                      <div className="relative h-40 -mt-6 -mx-6 mb-4 overflow-hidden">
                        <img
                            src={storage(service.image)}
                            alt={service.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                        {service.description}
                      </p>

                      {/* Price */}
                      {service.price && (
                          <div className="mb-4">
                      <span className="text-2xl font-bold text-[#1e2a3a]">
                        {service.price}
                      </span>
                          </div>
                      )}

                      {/* Features */}
                      {service.features?.length > 0 && (
                          <div className="space-y-2 mb-6">
                            {service.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                                </div>
                            ))}
                          </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                            onClick={() => handleOpenModal(service)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                            onClick={() => handleDelete(service.id)}
                            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-[#eef6ff] hover:bg-[#e6b020] opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />
                  </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredServices.length === 0 && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
              >
                <p className="text-slate-400 text-lg">No services found</p>
              </motion.div>
          )}
        </div>

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#1e2a3a]">
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter service title"
                    required
                />
              </div>
              <div className="space-y-2">
                <Label>Service Image (Upload from Computer)</Label>
                <ImageUpload
                    images={uploadedFiles}
                    onChange={setUploadedFiles}
                    multiple={false}
                    maxImages={1}
                />
                {editingService && uploadedFiles.length === 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Current image will be kept if you don't upload a new one
                    </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter service description"
                    rows={3}
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., $2,500 or $1,000/mo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder={"Feature 1\nFeature 2\nFeature 3"}
                    rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as "active" | "inactive" })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-[#f5bf23] hover:bg-[#e6b020] text-white font-medium hover:shadow-lg transition-shadow"
                >
                  {editingService ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Layout>
  );
}