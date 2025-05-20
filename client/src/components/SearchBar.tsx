import { useCallback, useState } from "react";
import { useLocation } from "wouter";
import { useText } from "../context/EnglishContext";

const SearchBar = ({ className = "" }: { className?: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [, navigate] = useLocation();
  const { t } = useText();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  }, [searchTerm, navigate]);

  return (
    <form onSubmit={handleSearch} className={`relative w-full ${className}`}>
      <input
        type="text"
        placeholder={t('nav.search')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-1.5 rounded-full"
        aria-label={t('nav.search')}
      >
        <i className="fas fa-search text-sm"></i>
      </button>
    </form>
  );
};

export default SearchBar;
