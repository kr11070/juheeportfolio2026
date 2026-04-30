import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'KR' | 'EN' | 'JP';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  KR: {
    'nav.home': '홈',
    'nav.portfolio': '포트폴리오',
    'nav.about': '소개',
    'nav.contact': '연락처',
    'portfolio.title': '프로젝트',
    'portfolio.new': '추가',
    'portfolio.saving': '저장 중...',
    'portfolio.edit': '변경',
    'portfolio.delete': '삭제',
    'portfolio.modal.add': '새 프로젝트 추가',
    'portfolio.modal.edit': '프로젝트 수정',
    'portfolio.label.title': '프로젝트 제목',
    'portfolio.label.type': '분류 (Type)',
    'portfolio.label.img': '썸네일 이미지 URL',
    'portfolio.label.link': '외부 링크 (선택사항)',
    'portfolio.label.team': '팀 / 공동작업자',
    'portfolio.label.team.placeholder': '비워두면 개인 프로젝트로 표시됩니다',
    'portfolio.label.keywords': '키워드 (쉼표로 구분)',
    'portfolio.label.desc': '작업 노트',
    'portfolio.filter.all': '전체',
    'portfolio.filter.team': '팀 프로젝트',
    'portfolio.filter.individual': '개인 프로젝트',
    'portfolio.sort.newest': '최신순',
    'portfolio.sort.oldest': '오래된순',
    'portfolio.sort.title': '가나다순',
    'portfolio.btn.add': '프로젝트 추가하기',
    'portfolio.btn.edit': '수정 완료',
    'portfolio.confirm.delete': '이 프로젝트를 삭제하시겠습니까?',
    'portfolio.error.invalidType': 'JPG, PNG 형식의 이미지만 업로드 가능합니다.',
    'portfolio.label.date': '진행 기간/날짜',
    'portfolio.label.title.kr': '프로젝트 제목 (KR)',
    'portfolio.label.title.en': 'Project Title (EN)',
    'portfolio.label.title.jp': 'プロジェクト名 (JP)',
    'portfolio.label.type.kr': '분류 (Type) (KR)',
    'portfolio.label.type.en': 'Category (EN)',
    'portfolio.label.type.jp': '分類 (Type) (JP)',
    'hero.name': '이주희',
    'hero.title': 'UXUI 디자이너',
    'about.text': '디지털 경험을 디자인하고 <br /> 혁신을 이끌어가는 <br /> <span class="text-green-600">UX/UI 디자이너</span>입니다.',
    'stats.title': '요약',
    'stats.exp': '경력 년수',
    'stats.projects': '프로젝트 수',
    'stats.skills': '사용 도구 및 스킬',
    'footer.contact': '문의하기',
  },
  EN: {
    'nav.home': 'Home',
    'nav.portfolio': 'Portfolio',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'portfolio.title': 'Projects',
    'portfolio.new': 'New',
    'portfolio.saving': 'Saving...',
    'portfolio.edit': 'Edit',
    'portfolio.delete': 'Delete',
    'portfolio.modal.add': 'Add New Project',
    'portfolio.modal.edit': 'Edit Project',
    'portfolio.label.title': 'Project Title',
    'portfolio.label.type': 'Category',
    'portfolio.label.img': 'Thumbnail Image URL',
    'portfolio.label.link': 'External Link (Optional)',
    'portfolio.label.team': 'Team / Coworkers',
    'portfolio.label.team.placeholder': 'Empty for Individual Project',
    'portfolio.label.keywords': 'Keywords (comma separated)',
    'portfolio.label.desc': 'Description / Work Note',
    'portfolio.filter.all': 'All',
    'portfolio.filter.team': 'Team',
    'portfolio.filter.individual': 'Individual',
    'portfolio.sort.newest': 'Newest',
    'portfolio.sort.oldest': 'Oldest',
    'portfolio.sort.title': 'Title (A-Z)',
    'portfolio.btn.add': 'Add Project',
    'portfolio.btn.edit': 'Save Changes',
    'portfolio.confirm.delete': 'Are you sure you want to delete this project?',
    'portfolio.error.invalidType': 'Only JPG and PNG images are allowed.',
    'portfolio.label.date': 'Project Period/Date',
    'portfolio.label.title.kr': 'Project Title (KR)',
    'portfolio.label.title.en': 'Project Title (EN)',
    'portfolio.label.title.jp': 'Project Title (JP)',
    'portfolio.label.type.kr': 'Category (KR)',
    'portfolio.label.type.en': 'Category (EN)',
    'portfolio.label.type.jp': 'Category (JP)',
    'hero.name': 'Juhee Lee',
    'hero.title': 'UXUI Designer',
    'about.text': 'I am a <span class="text-green-600">UX/UI Designer</span> <br /> who designs digital experiences <br /> and leads innovation.',
    'stats.title': 'Summary',
    'stats.exp': 'Experience',
    'stats.projects': 'Projects',
    'stats.skills': 'Tools & Skills',
    'footer.contact': 'Contact Me',
  },
  JP: {
    'nav.home': 'ホーム',
    'nav.portfolio': 'ポートフォリオ',
    'nav.about': '紹介',
    'nav.contact': '連絡先',
    'portfolio.title': 'プロジェクト',
    'portfolio.new': '新規',
    'portfolio.saving': '保存中...',
    'portfolio.edit': '変更',
    'portfolio.delete': '削除',
    'portfolio.modal.add': '新規プロジェクト追加',
    'portfolio.modal.edit': 'プロジェクト修正',
    'portfolio.label.title': 'プロジェクト名',
    'portfolio.label.type': '分類 (Type)',
    'portfolio.label.img': 'サムネイルURL',
    'portfolio.label.link': '外部リンク (任意)',
    'portfolio.label.team': 'チーム / 共同作業者',
    'portfolio.label.team.placeholder': '空の場合、個人プロジェクトになります',
    'portfolio.label.keywords': 'キーワード (カンマ区切り)',
    'portfolio.label.desc': '作業ノート (Description)',
    'portfolio.filter.all': '全て',
    'portfolio.filter.team': 'チーム',
    'portfolio.filter.individual': '個人',
    'portfolio.sort.newest': '新着順',
    'portfolio.sort.oldest': '古い順',
    'portfolio.sort.title': 'タイトル (A-Z)',
    'portfolio.btn.add': 'プロジェクトを追加',
    'portfolio.btn.edit': '修正完了',
    'portfolio.confirm.delete': 'このプロジェクトを削除しますか？',
    'portfolio.error.invalidType': 'JPG、PNG形式の画像のみアップロード可能です。',
    'portfolio.label.date': '進行期間/日付',
    'portfolio.label.title.kr': 'プロジェクト名 (KR)',
    'portfolio.label.title.en': 'プロジェクト名 (EN)',
    'portfolio.label.title.jp': 'プロジェクト名 (JP)',
    'portfolio.label.type.kr': '分類 (Type) (KR)',
    'portfolio.label.type.en': '分類 (Type) (EN)',
    'portfolio.label.type.jp': '分類 (Type) (JP)',
    'hero.name': 'イ・ジュヒ',
    'hero.title': 'UXUI デザイナー',
    'about.text': 'デジタル体験をデザインし、<br /> 革新をリードする <br /> <span class="text-green-600">UX/UIデザイナー</span>です。',
    'stats.title': '要約',
    'stats.exp': '経歴',
    'stats.projects': 'プロジェクト数',
    'stats.skills': 'スキル',
    'footer.contact': 'お問い合わせ',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('KR');

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
