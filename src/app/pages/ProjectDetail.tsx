import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Calendar, Tag, User, Users, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useLanguage } from '../context/LanguageContext';
import { DATABASE_URL } from '../utils/firebase';

export function ProjectDetail() {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${DATABASE_URL}/portfolio/projects.json`);
        const data = await res.json();
        
        let projects = [];
        if (data && data.data) {
          projects = data.data;
        }
        
        const foundProject = projects.find((p: any) => p.id === id);
        if (foundProject) setProject(foundProject);
      } catch (err) {
        console.error("General error in fetchProject:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-green-500" size={40} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-4">
            {lang === 'KR' ? '프로젝트를 찾을 수 없습니다.' : lang === 'EN' ? 'Project not found.' : 'プロジェクトが見つかりません。'}
          </h2>
          <Link to="/" className="text-green-600 font-bold hover:underline">
            {lang === 'KR' ? '홈으로 돌아가기' : lang === 'EN' ? 'Back to Home' : 'ホームに戻る'}
          </Link>
        </div>
      </div>
    );
  }

  const getVal = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj['KR'] || '';
  };

  const getContent = () => {
    if (!project.description) return '';
    if (typeof project.description === 'string') return project.description;
    return project.description[lang] || project.description['KR'] || '';
  };

  const teamName = getVal(project.team);
  const isTeam = teamName && teamName.trim().length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pt-32 pb-24 px-6 max-w-7xl mx-auto"
    >
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-gray-400 hover:text-green-600 transition-colors mb-12 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Back to Portfolio</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight mb-4">
              {getVal(project.title)}
            </h1>
            {project.keywords && project.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.keywords.map((kw: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-xl">
                    #{kw}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100">
            <div className="flex items-start gap-3">
              <Calendar className="text-green-600 shrink-0" size={20} />
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                <p className="font-bold text-gray-900">{getVal(project.date) || '-'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              {isTeam ? <Users className="text-green-600 shrink-0" size={20} /> : <User className="text-green-600 shrink-0" size={20} />}
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Team</p>
                <p className="font-bold text-gray-900">{isTeam ? teamName : t('portfolio.filter.individual')}</p>
              </div>
            </div>
          </div>
          
          {project.externalUrl && (
            <div className="pt-6">
              <a 
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-200 active:scale-95"
              >
                <ExternalLink size={20} />
                Visit Project
              </a>
            </div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="aspect-square rounded-[48px] overflow-hidden shadow-2xl shadow-green-100/50"
        >
          <ImageWithFallback 
            src={project.img} 
            alt={getVal(project.title)} 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      <div className="max-w-3xl space-y-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t('portfolio.label.desc')}</h2>
          <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
            {getContent() || <span className="text-gray-400 italic">No detailed description provided for this project.</span>}
          </p>
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="grid grid-cols-1 gap-12 pt-12">
            {project.gallery.map((img: string, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full aspect-video rounded-[48px] overflow-hidden bg-gray-100 shadow-xl"
              >
                <ImageWithFallback 
                  src={img} 
                  alt={`Gallery ${i}`} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
