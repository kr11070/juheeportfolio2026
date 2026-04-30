import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const t = {
    login: { KR: '로그인', EN: 'Login', JP: 'ログイン' },
    signup: { KR: '회원가입', EN: 'Sign Up', JP: '新規登録' },
    email: { KR: '이메일', EN: 'Email', JP: 'メール' },
    password: { KR: '비밀번호', EN: 'Password', JP: 'パスワード' },
    name: { KR: '이름', EN: 'Name', JP: '名前' },
    submit: { KR: '계속하기', EN: 'Continue', JP: '次へ' },
    googleLogin: { KR: '구글로 계속하기', EN: 'Continue with Google', JP: 'Googleで続行' },
    toggleLogin: { KR: '이미 계정이 있으신가요?', EN: 'Already have an account?', JP: 'すでにアカウントをお持ちですか？' },
    toggleSignup: { KR: '계정이 없으신가요?', EN: 'Don\'t have an account?', JP: 'アカウントをお持ちでないですか？' },
    successLogin: { KR: '로그인되었습니다.', EN: 'Logged in successfully.', JP: 'ログインしました。' },
    successSignup: { KR: '회원가입이 완료되었습니다. 로그인해주세요.', EN: 'Account created. Please log in.', JP: '会員登録が完了しました。ログインしてください。' },
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success(t.successLogin[lang]);
      navigate('/');
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success(t.successLogin[lang]);
        navigate('/');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        toast.success(t.successSignup[lang]);
        setIsLogin(true);
      }
    } catch (error: any) {
      let msg = error.message;
      if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      if (error.code === 'auth/email-already-in-use') msg = 'Email is already in use.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-medium tracking-tight mb-2">
            {isLogin ? t.login[lang] : t.signup[lang]}
          </h1>
          <p className="text-gray-500 text-sm">
            {isLogin ? 'Welcome back' : 'Join our community'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">
                {t.name[lang]}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  placeholder="Juhee Lee"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">
              {t.email[lang]}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                placeholder="hello@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">
              {t.password[lang]}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {t.submit[lang]}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="relative mt-8 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 font-medium">
              {lang === 'KR' ? '또는' : lang === 'EN' ? 'Or' : 'または'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {t.googleLogin[lang]}
            </>
          )}
        </button>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-500 hover:text-green-600 transition-colors"
          >
            {isLogin ? t.toggleSignup[lang] : t.toggleLogin[lang]}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
