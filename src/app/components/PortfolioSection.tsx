import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Plus, X, MoreVertical, Pencil, Trash2, Loader2, Globe, Tag, Users, User, ArrowDownUp, Upload, Filter, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { auth, DATABASE_URL } from '../utils/firebase';
import { uploadToImageKit, getThumbUrl } from '../utils/imagekit';
import { onAuthStateChanged } from 'firebase/auth';


const ADMIN_EMAIL = 'leejuhee010340@gmail.com';

interface LocalizedString {
  KR: string;
  EN: string;
  JP: string;
}

interface Project {
  id: string;
  title: LocalizedString;
  createdAt: number;
  date: LocalizedString; // displayed date string like "2026.02 - 2026.04"
  team: LocalizedString; // if empty, it's individual project
  img: string;
  externalUrl?: string;
  keywords: string[];
  description: LocalizedString;
}

const getLocalizedValue = (val: any, currentLang: string) => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val[currentLang] || val['KR'] || '';
};

// "2026.04.20" 또는 "2026.04.20 - 2026.04.17" 형식에서 YYYYMMDD 숫자를 추출
function parseDateField(dateVal: any, lang: string, position: 'start' | 'end'): number {
  const str = getLocalizedValue(dateVal, lang);
  if (!str) return 0;
  const parts = str.split(/\s*[-~→]\s*/).map((s: string) => s.trim());
  const target = position === 'end' && parts.length > 1 ? parts[parts.length - 1] : parts[0];
  // YYYY.MM.DD
  const full = target.match(/(\d{4})[.\-/](\d{2})[.\-/](\d{2})/);
  if (full) return parseInt(full[1]) * 10000 + parseInt(full[2]) * 100 + parseInt(full[3]);
  // YYYY.MM
  const short = target.match(/(\d{4})[.\-/](\d{2})/);
  if (short) return parseInt(short[1]) * 10000 + parseInt(short[2]) * 100;
  return 0;
}

function ProjectCard({ 
  project, 
  handleOpenEditModal,
  handleDeleteProject,
  activeMenuId,
  setActiveMenuId,
  menuRef,
  t,
  lang,
  isAdmin
}: {
  project: Project;
  handleOpenEditModal: (project: Project) => void;
  handleDeleteProject: (id: string) => void;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
  t: (key: string) => string;
  lang: string;
  isAdmin: boolean;
}) {
  const displayTitle = getLocalizedValue(project.title, lang);
  const displayDate = getLocalizedValue(project.date, lang);
  const displayTeam = getLocalizedValue(project.team, lang);
  const isTeam = displayTeam && displayTeam.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20" ref={activeMenuId === project.id ? (menuRef as any) : null}>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveMenuId(activeMenuId === project.id ? null : project.id);
            }}
            className="w-10 h-10 bg-white/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-gray-500 hover:text-green-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={20} />
          </button>
          
          <AnimatePresence>
            {activeMenuId === project.id && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute top-12 right-0 w-32 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-30"
              >
                <button 
                  onClick={(e) => { e.preventDefault(); handleOpenEditModal(project); }}
                  className="w-full px-4 py-2 flex items-center gap-2 text-sm font-bold text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  <Pencil size={14} />
                  {t('portfolio.edit')}
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); handleDeleteProject(project.id); }}
                  className="w-full px-4 py-2 flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                  {t('portfolio.delete')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {project.externalUrl ? (
        <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" className="block relative">
          <div className="aspect-video w-full rounded-[40px] overflow-hidden mb-6 bg-gray-100 shadow-xl shadow-gray-200/50 group-hover:shadow-green-100/50 transition-all duration-500 relative">
            <ImageWithFallback
              src={getThumbUrl(project.img)}
              alt={displayTitle}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${isTeam ? 'bg-blue-500/90 text-white' : 'bg-green-500/90 text-white'}`}>
                {isTeam ? <Users size={12} className="inline mr-1" /> : <User size={12} className="inline mr-1" />}
                {isTeam ? displayTeam : t('portfolio.filter.individual')}
              </span>
            </div>
          </div>
        </a>
      ) : (
        <Link to={`/project/${project.id}`} className="block relative">
          <div className="aspect-video w-full rounded-[40px] overflow-hidden mb-6 bg-gray-100 shadow-xl shadow-gray-200/50 group-hover:shadow-green-100/50 transition-all duration-500 relative">
            <ImageWithFallback
              src={getThumbUrl(project.img)}
              alt={displayTitle}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${isTeam ? 'bg-blue-500/90 text-white' : 'bg-green-500/90 text-white'}`}>
                {isTeam ? <Users size={12} className="inline mr-1" /> : <User size={12} className="inline mr-1" />}
                {isTeam ? displayTeam : t('portfolio.filter.individual')}
              </span>
            </div>
          </div>
        </Link>
      )}
      <div className="space-y-2">
        {project.externalUrl ? (
          <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
            <h4 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-green-600 transition-colors">
              {displayTitle}
            </h4>
          </a>
        ) : (
          <Link to={`/project/${project.id}`}>
            <h4 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-green-600 transition-colors">
              {displayTitle}
            </h4>
          </Link>
        )}
        
        {displayDate && (
          <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
            <Calendar size={12} /> {displayDate}
          </p>
        )}

        {project.keywords && project.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.keywords.map((kw, i) => (
              <span key={i} className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded-lg">
                #{kw.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function PortfolioSection() {
  const { t, lang } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Filters & Sorting
  const [filterTeam, setFilterTeam] = useState<'ALL' | 'TEAM' | 'INDIVIDUAL'>('ALL');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [filterYear, setFilterYear] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'TITLE'>('NEWEST');
  const [sortReverse, setSortReverse] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const initialProjectState: Omit<Project, 'id' | 'createdAt'> = {
    title: { KR: '', EN: '', JP: '' },
    date: { KR: '', EN: '', JP: '' },
    team: { KR: '', EN: '', JP: '' },
    img: '',
    externalUrl: '',
    keywords: [],
    description: { KR: '', EN: '', JP: '' }
  };
  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'createdAt'>>(initialProjectState);
  const [keywordsInput, setKeywordsInput] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${DATABASE_URL}/portfolio/projects.json`);
      const data = await res.json();
      
      if (data && data.data) {
        setProjects(data.data);
      } else {
        // Fallback fake data if empty DB
        setProjects([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.email === ADMIN_EMAIL);
    });
    return () => unsubscribe();
  }, []);

  const saveToDB = async (updatedProjects: Project[]) => {
    setIsSaving(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser?.email === ADMIN_EMAIL) {
        const token = await currentUser.getIdToken();
        await fetch(`${DATABASE_URL}/portfolio/projects.json?auth=${token}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: updatedProjects })
        });
      }
    } catch (e) {
      console.error("Failed to save projects", e);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setNewProject(initialProjectState);
    setKeywordsInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingId(project.id);
    setNewProject({
      title: project.title,
      date: project.date || { KR: '', EN: '', JP: '' },
      team: project.team || { KR: '', EN: '', JP: '' },
      img: project.img,
      externalUrl: project.externalUrl || '',
      keywords: project.keywords || [],
      description: project.description || { KR: '', EN: '', JP: '' }
    });
    setKeywordsInput((project.keywords || []).join(', '));
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm(t('portfolio.confirm.delete'))) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      saveToDB(updated);
      setActiveMenuId(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (auth.currentUser?.email !== ADMIN_EMAIL) {
      alert("Only the admin can upload images.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const { url } = await uploadToImageKit(file, setUploadProgress);
      setNewProject(prev => ({ ...prev, img: url }));
    } catch (error: any) {
      console.error("Upload error:", error);
      alert("업로드 오류: " + error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.KR || !newProject.img) return;

    const keywordsArray = keywordsInput.split(',').map(k => k.trim()).filter(k => k.length > 0);

    let updated;
    if (editingId) {
      updated = projects.map(p => 
        p.id === editingId ? { ...p, ...newProject, keywords: keywordsArray } : p
      );
    } else {
      const projectToAdd: Project = {
        ...newProject,
        id: String(Date.now()),
        createdAt: Date.now(),
        keywords: keywordsArray
      };
      updated = [projectToAdd, ...projects];
    }

    setProjects(updated);
    saveToDB(updated);
    setIsModalOpen(false);
    setEditingId(null);
  };

  // Unique keywords list for filter
  const allKeywords = useMemo(() => {
    const kwSet = new Set<string>();
    projects.forEach(p => p.keywords?.forEach(k => kwSet.add(k)));
    return Array.from(kwSet);
  }, [projects]);

  const allYears = useMemo(() => {
    const years = new Set<string>();
    projects.forEach(p => {
      if (p.createdAt) {
        years.add(new Date(p.createdAt).getFullYear().toString());
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [projects]);

  // Derived filtered & sorted projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Filter by Team/Individual
    if (filterTeam === 'TEAM') {
      result = result.filter(p => {
        const teamStr = getLocalizedValue(p.team, lang);
        return teamStr && teamStr.trim().length > 0;
      });
    } else if (filterTeam === 'INDIVIDUAL') {
      result = result.filter(p => {
        const teamStr = getLocalizedValue(p.team, lang);
        return !teamStr || teamStr.trim().length === 0;
      });
    }

    // Filter by Year
    if (filterYear !== 'ALL') {
      result = result.filter(p => {
        const year = new Date(p.createdAt).getFullYear().toString();
        return year === filterYear;
      });
    }

    // Filter by Keywords
    if (selectedKeywords.length > 0) {
      result = result.filter(p => 
        p.keywords && p.keywords.some(kw => selectedKeywords.includes(kw))
      );
    }

    // Sorting
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'NEWEST') {
        const da = parseDateField(a.date, lang, 'end');
        const db = parseDateField(b.date, lang, 'end');
        if (da > 0 && db > 0) cmp = db - da;
        else if (da > 0) cmp = -1;
        else if (db > 0) cmp = 1;
        else cmp = b.createdAt - a.createdAt;
      } else if (sortBy === 'TITLE') {
        cmp = getLocalizedValue(a.title, lang).localeCompare(getLocalizedValue(b.title, lang));
      }
      return sortReverse ? -cmp : cmp;
    });

    return result;
  }, [projects, filterTeam, selectedKeywords, filterYear, sortBy, sortReverse, lang]);

  const toggleKeyword = (kw: string) => {
    setSelectedKeywords(prev => 
      prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
    );
  };

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="animate-spin text-green-500" size={40} />
      </div>
    );
  }

  return (
    <section id="portfolio" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">{t('portfolio.title')}</h2>
            <div className="h-1.5 w-12 bg-green-500 rounded-full"></div>
          </div>
          {isSaving && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full"
            >
              <Loader2 size={14} className="animate-spin" />
              {t('portfolio.saving')}
            </motion.div>
          )}
        </div>
        
        {isAdmin && (
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-200 active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} />
            {t('portfolio.new')}
          </button>
        )}
      </div>

      {/* Filter and Sort Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-100/50 mb-12 border border-gray-100 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-2xl">
            <button 
              onClick={() => setFilterTeam('ALL')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterTeam === 'ALL' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t('portfolio.filter.all')}
            </button>
            <button 
              onClick={() => setFilterTeam('TEAM')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterTeam === 'TEAM' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Users size={14} className="inline mr-1.5" />
              {t('portfolio.filter.team')}
            </button>
            <button 
              onClick={() => setFilterTeam('INDIVIDUAL')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterTeam === 'INDIVIDUAL' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <User size={14} className="inline mr-1.5" />
              {t('portfolio.filter.individual')}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border-r border-gray-200 pr-3 mr-1">
              <Calendar size={16} className="text-gray-400" />
              <select 
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-transparent border-none py-2 text-sm font-bold text-gray-700 outline-none cursor-pointer"
              >
                <option value="ALL">All Years</option>
                {allYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => setSortReverse(prev => !prev)}
              className={`p-1.5 rounded-lg transition-all ${sortReverse ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-gray-600'}`}
              title={sortReverse ? '역순' : '정순'}
            >
              <ArrowDownUp size={16} className={`transition-transform duration-200 ${sortReverse ? 'rotate-180' : ''}`} />
            </button>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-50 border-none px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer"
            >
              <option value="NEWEST">{t('portfolio.sort.newest')}</option>
              <option value="TITLE">{t('portfolio.sort.title')}</option>
            </select>
          </div>
        </div>

        {allKeywords.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-500">
              <Filter size={14} /> Keywords
            </div>
            <div className="flex flex-wrap gap-2">
              {allKeywords.map(kw => (
                <button
                  key={kw}
                  onClick={() => toggleKeyword(kw)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    selectedKeywords.includes(kw) 
                      ? 'bg-green-50 border-green-500 text-green-700' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  #{kw}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {filteredProjects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="py-20 text-center text-gray-400 font-medium"
          >
            No projects found matching the criteria.
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                handleOpenEditModal={handleOpenEditModal}
                handleDeleteProject={handleDeleteProject}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                menuRef={menuRef}
                t={t}
                lang={lang}
                isAdmin={isAdmin}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h3 className="text-2xl font-black text-gray-900">
                  {editingId ? t('portfolio.modal.edit') : t('portfolio.modal.add')}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto overflow-x-hidden flex-1 custom-scrollbar">
                <form id="project-form" onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Titles and Description */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe size={18} className="text-green-600" />
                          <span className="font-black text-gray-900">Project Titles</span>
                        </div>
                        {['KR', 'EN', 'JP'].map((l) => (
                          <div key={`title-${l}`}>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">{l}</label>
                            <input 
                              type="text" 
                              required={l === 'KR'}
                              value={(newProject.title as any)[l]}
                              onChange={e => setNewProject({...newProject, title: {...newProject.title, [l]: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-green-500 focus:outline-none transition-colors font-medium text-sm bg-gray-50 focus:bg-white"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag size={18} className="text-green-600" />
                          <span className="font-black text-gray-900">{t('portfolio.label.desc')}</span>
                        </div>
                        {['KR', 'EN', 'JP'].map((l) => (
                          <div key={`desc-${l}`}>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">{l}</label>
                            <textarea 
                              rows={2}
                              value={(newProject.description as any)[l]}
                              onChange={e => setNewProject({...newProject, description: {...newProject.description, [l]: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-green-500 focus:outline-none transition-colors font-medium text-sm bg-gray-50 focus:bg-white resize-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Other metadata */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={18} className="text-green-600" />
                          <span className="font-black text-gray-900">{t('portfolio.label.date')}</span>
                        </div>
                        {['KR', 'EN', 'JP'].map((l) => (
                          <div key={`date-${l}`}>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">{l}</label>
                            <input 
                              type="text" 
                              placeholder={l === 'KR' ? "2026.01 - 2026.04" : ""}
                              value={(newProject.date as any)[l]}
                              onChange={e => setNewProject({...newProject, date: {...newProject.date, [l]: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-green-500 focus:outline-none transition-colors font-medium text-sm bg-gray-50 focus:bg-white"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users size={18} className="text-green-600" />
                          <span className="font-black text-gray-900">{t('portfolio.label.team')}</span>
                        </div>
                        {['KR', 'EN', 'JP'].map((l) => (
                          <div key={`team-${l}`}>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">{l}</label>
                            <input 
                              type="text" 
                              placeholder={t('portfolio.label.team.placeholder')}
                              value={(newProject.team as any)[l]}
                              onChange={e => setNewProject({...newProject, team: {...newProject.team, [l]: e.target.value}})}
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-green-500 focus:outline-none transition-colors font-medium text-sm bg-gray-50 focus:bg-white"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="block text-sm font-black text-gray-900 mb-2">{t('portfolio.label.keywords')}</label>
                          <input 
                            type="text" 
                            placeholder="UX, UI, Research"
                            value={keywordsInput}
                            onChange={e => setKeywordsInput(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-green-500 focus:outline-none transition-colors font-medium text-sm bg-gray-50 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-black text-gray-900 mb-2">{t('portfolio.label.link')}</label>
                          <input 
                            type="url" 
                            value={newProject.externalUrl}
                            onChange={e => setNewProject({...newProject, externalUrl: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-green-500 focus:outline-none transition-colors font-medium text-sm bg-gray-50 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    <label className="block text-sm font-black text-gray-900">{t('portfolio.label.img')}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          disabled={isUploading}
                        />
                        <div className={`h-48 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-colors ${isUploading ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-200 group-hover:border-green-400 group-hover:bg-green-50'}`}>
                          {isUploading ? (
                            <>
                              <Loader2 size={32} className="text-gray-400 animate-spin" />
                              <span className="text-sm font-bold text-gray-400">
                                {uploadProgress > 0 ? `${uploadProgress}%` : 'Uploading...'}
                              </span>
                              {uploadProgress > 0 && (
                                <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-500 rounded-full transition-all duration-200"
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <Upload size={32} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                              <div className="text-center">
                                <span className="text-sm font-bold text-gray-600 block">Click or drag to upload</span>
                                <span className="text-xs text-gray-400 mt-1 block">JPG, PNG — ImageKit 자동 업로드</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="h-48 rounded-[32px] overflow-hidden bg-gray-100 border border-gray-100 flex items-center justify-center">
                        {newProject.img ? (
                          <ImageWithFallback src={newProject.img} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-bold text-gray-400">Preview</span>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end">
                <button
                  type="submit"
                  form="project-form"
                  disabled={isUploading || !newProject.title.KR || !newProject.img}
                  className="px-8 py-4 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-green-200"
                >
                  {editingId ? t('portfolio.btn.edit') : t('portfolio.btn.add')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
