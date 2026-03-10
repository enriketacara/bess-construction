import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { motion } from "motion/react";
import { Save, Building, Users, Target, Award, Edit2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import ImageUpload from "../components/ImageUpload";
import { apiJson, uploadSingleImage, storage } from "../lib/api";

type AboutFormData = {
  companyName: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  founded: string;
  employees: string;
  clients: string;
  awards: string;
  heroImage: string;
};

export default function AboutUs() {
  const [isEditing, setIsEditing]         = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData]           = useState<AboutFormData>({
    companyName: "",
    tagline:     "",
    description: "",
    mission:     "",
    vision:      "",
    founded:     "",
    employees:   "",
    clients:     "",
    awards:      "",
    heroImage:   "",
  });

  useEffect(() => {
    apiJson<any>("/about")
        .then((res) => {
          // ✅ Handle both flat { companyName: ... } and wrapped { data: { ... } } / { about: { ... } }
          const data = res?.data ?? res?.about ?? res;

          if (!data || typeof data !== "object") return;

          setFormData((prev) => ({
            ...prev,
            ...data,
            heroImage: data.heroImage ?? "",
          }));
        })
        .catch((e) => toast.error(e.message));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let heroImage = formData.heroImage;
      if (uploadedFiles.length > 0) {
        const up = await uploadSingleImage(uploadedFiles[0]);
        heroImage = up.path;
      }

      const payload = {
        companyName: formData.companyName,
        tagline:     formData.tagline,
        description: formData.description,
        mission:     formData.mission,
        vision:      formData.vision,
        founded:     formData.founded,
        employees:   formData.employees,
        clients:     formData.clients,
        awards:      formData.awards,
        heroImage,
      };

      const updated = await apiJson<any>("/about", "PUT", payload);

      // ✅ Same defensive unwrap for PUT response
      const updatedData = updated?.data ?? updated?.about ?? updated;

      setFormData((prev) => ({
        ...prev,
        ...updatedData,
        heroImage: updatedData.heroImage ?? heroImage,
      }));

      setUploadedFiles([]);
      setIsEditing(false);
      toast.success("About Us information updated successfully!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to update About section");
    }
  };

  const stats = [
    { icon: Building, label: "Founded",      value: formData.founded,   color: "from-blue-500 to-cyan-500"    },
    { icon: Users,    label: "Team Members",  value: formData.employees, color: "from-amber-400 to-yellow-300" },
    { icon: Target,   label: "Happy Clients", value: formData.clients,   color: "from-pink-500 to-rose-500"    },
    { icon: Award,    label: "Awards Won",    value: formData.awards,    color: "from-cyan-500 to-blue-500"    },
  ];

  return (
      <Layout>
        <div className="p-4 md:p-8 space-y-8">
          {/* Header */}
          <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1e2a3a] mb-2">About Us</h1>
              <p className="text-slate-600 dark:text-slate-400">Manage your company information</p>
            </div>
            <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f5bf23] hover:bg-[#e6b020] text-white font-medium hover:shadow-lg transition-shadow"
            >
              <Edit2 className="w-5 h-5" />
              {isEditing ? "Cancel" : "Edit Information"}
            </button>
          </motion.div>

          {isEditing ? (
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-6 md:p-8"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input id="tagline" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mission">Mission Statement</Label>
                    <Textarea id="mission" value={formData.mission} onChange={(e) => setFormData({ ...formData, mission: e.target.value })} rows={3} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vision">Vision Statement</Label>
                    <Textarea id="vision" value={formData.vision} onChange={(e) => setFormData({ ...formData, vision: e.target.value })} rows={3} required />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="founded">Founded</Label>
                      <Input id="founded" value={formData.founded} onChange={(e) => setFormData({ ...formData, founded: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employees">Employees</Label>
                      <Input id="employees" value={formData.employees} onChange={(e) => setFormData({ ...formData, employees: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clients">Clients</Label>
                      <Input id="clients" value={formData.clients} onChange={(e) => setFormData({ ...formData, clients: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="awards">Awards</Label>
                      <Input id="awards" value={formData.awards} onChange={(e) => setFormData({ ...formData, awards: e.target.value })} required />
                    </div>
                  </div>

                  {/* Hero Image Upload */}
                  <div className="space-y-2">
                    <Label>Hero Image</Label>
                    {formData.heroImage && uploadedFiles.length === 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-slate-500 mb-2">Current image:</p>
                          <img
                              src={storage(formData.heroImage)}
                              alt="Current hero"
                              className="h-32 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                          />
                        </div>
                    )}
                    <ImageUpload images={uploadedFiles} onChange={setUploadedFiles} multiple={false} maxImages={1} />
                    {formData.heroImage && uploadedFiles.length === 0 && (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Current image will be kept if you don't upload a new one
                        </p>
                    )}
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#f5bf23] hover:bg-[#e6b020] text-white font-medium hover:shadow-lg transition-shadow">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
          ) : (
              <div className="space-y-8">
                {/* Hero banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-[#1e2a3a] p-8 md:p-12 text-white"
                >
                  {formData.heroImage && (
                      <div className="absolute inset-0">
                        <img src={storage(formData.heroImage)} alt="Hero" className="w-full h-full object-cover opacity-20" />
                      </div>
                  )}
                  <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">{formData.companyName}</h2>
                    <p className="text-xl md:text-2xl opacity-90 mb-6">{formData.tagline}</p>
                    <p className="text-lg opacity-80 max-w-3xl">{formData.description}</p>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-6 text-center group hover:shadow-xl transition-shadow"
                        >
                          <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                        </motion.div>
                    );
                  })}
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-6 md:p-8"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">Our Mission</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{formData.mission}</p>
                  </motion.div>
                  <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-6 md:p-8"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#f5bf23] flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">Our Vision</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{formData.vision}</p>
                  </motion.div>
                </div>
              </div>
          )}
        </div>
      </Layout>
  );
}