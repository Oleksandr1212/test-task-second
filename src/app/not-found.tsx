import Link from "next/link";
import { Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8 border border-red-100 shadow-sm relative">
        <Search className="w-10 h-10 text-red-500" />
        <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full border border-gray-200">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
        </div>
      </div>

      <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tighter">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Ми шукали всюди, але не знайшли цю сторінку</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed font-medium">
        Можливо, посилання застаріло або сталася помилка в адресі. Спробуйте повернутися на головну.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs sm:max-w-none justify-center">
        <Link 
          href="/" 
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:-translate-y-0.5"
        >
          <Home className="w-5 h-5" />
          На головну
        </Link>
      </div>
      
    </div>
  );
}
