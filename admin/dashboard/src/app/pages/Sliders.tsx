import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit2, Trash2, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import ImageUpload from "../components/ImageUpload";
import { apiDelete, apiJson, uploadSingleImage, storage } from "../lib/api";

type ApiResource<T> = { data: T };

interface Slider {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  buttonText?: string | null;
  buttonLink?: string | null;
  order?: number | null;
  visible: boolean;
}

export default function Sliders() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
  });

  const load = async () => {
    try {
      const res = await apiJson<ApiResource<Slider[]>>("/sliders");
      setSliders(res.data ?? []);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load sliders");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenModal = (slider?: Slider) => {
    if (slider) {
      setEditingSlider(slider);
      setFormData({
        title: slider.title ?? "",
        subtitle: slider.subtitle ?? "",
        buttonText: slider.buttonText ?? "",
        buttonLink: slider.buttonLink ?? "",
      });
    } else {
      setEditingSlider(null);
      setFormData({ title: "", subtitle: "", buttonText: "", buttonLink: "" });
    }
    setUploadedFiles([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSlider(null);
    setUploadedFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = editingSlider?.image ?? "";

      if (uploadedFiles.length > 0) {
        const up = await uploadSingleImage(uploadedFiles[0]);
        imageUrl = up.path; // ✅ store path only
      } else if (!editingSlider) {
        toast.error("Please upload an image");
        return;
      }

      const payload = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        buttonText: formData.buttonText || null,
        buttonLink: formData.buttonLink || null,
        image: imageUrl,
      };

      if (editingSlider) {
        const res = await apiJson<ApiResource<Slider>>(`/sliders/${editingSlider.id}`, "PUT", payload);
        const updated = res.data;
        setSliders((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        toast.success("Slider updated successfully!");
      } else {
        const res = await apiJson<ApiResource<Slider>>("/sliders", "POST", payload);
        const created = res.data;
        setSliders((prev) => [...prev, created]);
        toast.success("Slider created successfully!");
      }

      handleCloseModal();
    } catch (e: any) {
      toast.error(e?.message || "Failed to save slider");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDelete(`/sliders/${id}`);
      setSliders((prev) => prev.filter((s) => s.id !== id));
      toast.success("Slider deleted successfully!");
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
  };

  const toggleVisibility = async (id: string) => {
    try {
      const res = await apiJson<ApiResource<Slider>>(`/sliders/${id}/toggle-visibility`, "PATCH");
      const updated = res.data;
      setSliders((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      toast.success("Slider visibility updated!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to toggle visibility");
    }
  };

  const moveSlider = async (id: string, direction: "up" | "down") => {
    try {
      const res = await apiJson<ApiResource<Slider[]>>(`/sliders/${id}/move?direction=${direction}`, "PATCH");
      setSliders(res.data ?? []);
      toast.success("Slider order updated!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to move slider");
    }
  };

  const sortedSliders = useMemo(
      () => [...sliders].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      [sliders]
  );

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
                Sliders
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your homepage slider content
              </p>
            </div>
            <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f5bf23] hover:bg-[#e6b020] text-white font-medium hover:shadow-lg transition-shadow"
            >
              <Plus className="w-5 h-5" />
              Add Slider
            </button>
          </motion.div>

          {/* Sliders List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {sortedSliders.map((slider, index) => (
                  <motion.div
                      key={slider.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all ${
                          !slider.visible ? "opacity-50" : ""
                      }`}
                  >
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6">
                      {/* Image Preview */}
                      <div className="relative w-full md:w-64 h-40 flex-shrink-0 rounded-xl overflow-hidden">
                        <img
                            src={storage(slider.image)}
                            alt={slider.title}
                            className="w-full h-full object-cover"
                        />
                        {!slider.visible && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <EyeOff className="w-8 h-8 text-white" />
                            </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{slider.title}</h3>
                            {slider.subtitle && (
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                                  {slider.subtitle}
                                </p>
                            )}
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                          Order: {slider.order ?? "—"}
                        </span>
                          </div>
                        </div>
                        {slider.buttonText && (
                            <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          Button:{" "}
                          <span className="font-medium">{slider.buttonText}</span>
                        </span>
                            </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2">
                        <button
                            onClick={() => moveSlider(slider.id, "up")}
                            disabled={index === 0}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => moveSlider(slider.id, "down")}
                            disabled={index === sortedSliders.length - 1}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => toggleVisibility(slider.id)}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title={slider.visible ? "Hide" : "Show"}
                        >
                          {slider.visible ? (
                              <Eye className="w-4 h-4" />
                          ) : (
                              <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                        <button
                            onClick={() => handleOpenModal(slider)}
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
                            title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(slider.id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Delete"
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

          {sortedSliders.length === 0 && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
              >
                <p className="text-slate-400 text-lg">No sliders found</p>
              </motion.div>
          )}
        </div>

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#1e2a3a]">
                {editingSlider ? "Edit Slider" : "Add New Slider"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter slider title"
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Enter slider subtitle"
                    rows={2}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Slider Image (Upload from Computer)</Label>
                <ImageUpload
                    images={uploadedFiles}
                    onChange={setUploadedFiles}
                    multiple={false}
                    maxImages={1}
                />
                {editingSlider && uploadedFiles.length === 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Current image will be kept if you don't upload a new one
                    </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                    id="buttonText"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="e.g., Get Started"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input
                    id="buttonLink"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    placeholder="e.g., /contact"
                />
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
                  {editingSlider ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Layout>
  );
}