import { useEffect, useMemo, useState, useRef } from "react";
import Layout from "../components/Layout";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit2, Trash2, Search, ExternalLink, Eye, Loader2, X, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import ImageUpload from "../components/ImageUpload";
import { apiDelete, apiJson, uploadMultipleImages, storage } from "../lib/api";

interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  link: string;
  services: string[];
}

interface Service {
  id: string;
  title: string;
}

type Paginated<T> = { data: T[] };

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Drag state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "", description: "", category: "", link: "", services: [] as string[],
  });

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      apiJson<Paginated<Project>>("/construction-projects?perPage=50"),
      apiJson<Paginated<Service>>("/construction-services?perPage=100"),
    ])
      .then(([projectsRes, servicesRes]) => {
        setProjects(projectsRes.data);
        setAvailableServices(servicesRes.data);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== draggedId) setDragOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;
    setProjects(prev => {
      const next = [...prev];
      const fromIndex = next.findIndex(p => p.id === draggedId);
      const toIndex = next.findIndex(p => p.id === targetId);
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const saveOrder = async () => {
    setIsSavingOrder(true);
    try {
      await apiJson("/construction-projects/reorder", "POST", {
        ids: projects.map(p => p.id),
      });
      toast.success("Order saved!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to save order");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setExistingImages(project.images ?? []);
      setFormData({ title: project.title, description: project.description, category: project.category, link: project.link, services: project.services });
    } else {
      setEditingProject(null);
      setExistingImages([]);
      setFormData({ title: "", description: "", category: "", link: "", services: [] });
    }
    setUploadedFiles([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setUploadedFiles([]);
    setExistingImages([]);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (existingImages.length + uploadedFiles.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    setIsSubmitting(true);
    try {
      let newImageUrls: string[] = [];
      if (uploadedFiles.length > 0) {
        const uploaded = await uploadMultipleImages(uploadedFiles);
        newImageUrls = uploaded.map(x => x.path); // ✅ store path only
      }
      const payload = { ...formData, images: [...existingImages, ...newImageUrls] };
      if (editingProject) {
        const res = await apiJson<{ data: Project }>(`/construction-projects/${editingProject.id}`, "PUT", payload);
        setProjects(prev => prev.map(p => p.id === res.data.id ? res.data : p));
        toast.success("Project updated!");
      } else {
        const res = await apiJson<{ data: Project }>("/construction-projects", "POST", payload);
        setProjects(prev => [...prev, res.data]);
        toast.success("Project created!");
      }
      handleCloseModal();
    } catch (e: any) {
      toast.error(e?.message || "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await apiDelete(`/construction-projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success("Project deleted!");
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleService = (title: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(title)
        ? prev.services.filter(s => s !== title)
        : [...prev.services, title],
    }));
  };

  const openGallery = (project: Project, index = 0) => {
    setSelectedProject(project);
    setGalleryIndex(index);
    setIsGalleryOpen(true);
  };

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.services.some(s => s.toLowerCase().includes(q))
    );
  }, [projects, searchQuery]);

  const isFiltering = searchQuery.trim().length > 0;

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
              Projects
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Drag the <GripVertical className="inline w-4 h-4" /> handle to reorder, then click Save Order
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isFiltering && projects.length > 1 && (
              <button
                onClick={saveOrder}
                disabled={isSavingOrder}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#f5bf23]/60 text-[#92620a] font-medium hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSavingOrder && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Order
              </button>
            )}
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f5bf23] hover:bg-[#e6b020] text-white font-medium hover:shadow-lg transition-shadow cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add Project
            </button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50"
          />
        </motion.div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-[#b07d10] animate-spin" />
            <p className="text-slate-400 text-sm">Loading projects...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    draggable={!isFiltering}
                    onDragStart={(e) => handleDragStart(e as any, project.id)}
                    onDragOver={(e) => handleDragOver(e as any, project.id)}
                    onDrop={(e) => handleDrop(e as any, project.id)}
                    onDragEnd={handleDragEnd}
                    className={`group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border transition-all hover:shadow-2xl
                      ${draggedId === project.id ? "opacity-40 scale-95 border-[#f5bf23]/60" : "border-slate-200/50 dark:border-slate-700/50"}
                      ${dragOverId === project.id && draggedId !== project.id ? "border-[#f5bf23] shadow-lg shadow-yellow-200/20 scale-[1.02]" : ""}
                      ${!isFiltering ? "cursor-grab active:cursor-grabbing" : ""}
                    `}
                  >
                    {/* Drag handle + position badge */}
                    {!isFiltering && (
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                          <GripVertical className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-bold">
                          #{index + 1}
                        </span>
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.images?.[0] || ""}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {project.images?.length > 1 && (
                        <div className="absolute bottom-4 right-4">
                          <button
                            onClick={() => openGallery(project)}
                            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-medium hover:scale-105 transition-transform cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            {project.images.length} photos
                          </button>
                        </div>
                      )}

                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-medium">
                          {project.category}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(project)} className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(project.id)} disabled={deletingId === project.id} className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-red-500 hover:text-white transition-colors cursor-pointer disabled:opacity-60">
                          {deletingId === project.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                      {project.services?.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-slate-500 mb-2">Services Used:</p>
                          <div className="flex flex-wrap gap-2">
                            {project.services.map(service => (
                              <span key={service} className="px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium">
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-[#92620a] hover:gap-3 transition-all" onClick={e => e.stopPropagation()}>
                          View Project <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredProjects.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <p className="text-slate-400 text-lg">No projects found</p>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1e2a3a]">
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label>Project Title</Label>
              <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Enter project title" required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g., Residential, Commercial" required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Enter project description" rows={4} required />
            </div>
            <div className="space-y-2">
              <Label>Services Used</Label>
              {availableServices.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No services available.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {availableServices.map(service => (
                    <label key={service.id} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${formData.services.includes(service.title) ? "bg-amber-50 border-[#f5bf23]" : "border-slate-300 dark:border-slate-600 hover:border-[#f5bf23]/50"}`}>
                      <input type="checkbox" checked={formData.services.includes(service.title)} onChange={() => toggleService(service.title)} className="w-4 h-4 accent-[#f5bf23]" />
                      <span className="text-sm">{service.title}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-3">
              <Label>Project Images</Label>
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500">Current images — click × to remove</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {existingImages.map((url, index) => (
                      <div key={index} className="relative group/img aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                        <img src={storage(url)} alt={`Existing ${index + 1}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <ImageUpload images={uploadedFiles} onChange={setUploadedFiles} multiple maxImages={10} />
            </div>
            <div className="space-y-2">
              <Label>Project Link</Label>
              <Input value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="https://example.com" />
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={handleCloseModal} disabled={isSubmitting} className="px-6 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#f5bf23] hover:bg-[#e6b020] text-white font-medium hover:shadow-lg transition-shadow cursor-pointer disabled:opacity-70">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />{editingProject ? "Updating..." : "Creating..."}</> : (editingProject ? "Update" : "Create")}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] bg-black/95 border-slate-700">
          {selectedProject && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">{selectedProject.title} — Gallery</DialogTitle>
              </DialogHeader>
              <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
                <img src={storage(selectedProject.images[galleryIndex])} alt={`Photo ${galleryIndex + 1}`} className="w-full h-full object-contain" />
                {selectedProject.images.length > 1 && (
                  <>
                    <button onClick={() => setGalleryIndex((galleryIndex - 1 + selectedProject.images.length) % selectedProject.images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer">
                      <span className="text-white text-xl">‹</span>
                    </button>
                    <button onClick={() => setGalleryIndex((galleryIndex + 1) % selectedProject.images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer">
                      <span className="text-white text-xl">›</span>
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-white/10 text-white text-sm">{galleryIndex + 1} / {selectedProject.images.length}</div>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {selectedProject.images.map((image, index) => (
                  <button key={index} onClick={() => setGalleryIndex(index)} className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${index === galleryIndex ? "border-[#f5bf23] scale-105" : "border-transparent hover:border-slate-500"}`}>
                    <img src={storage(image)} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
