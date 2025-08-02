import React from 'react';
import { Search } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

interface SearchFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedType: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

function SearchFilters({
  searchTerm,
  selectedCategory,
  selectedType,
  categories,
  onSearchChange,
  onCategoryChange,
  onTypeChange
}: SearchFiltersProps) {
  const typeOptions = [
    { value: '', label: 'Tous les types' },
    { value: 'digital', label: 'Produit numérique' },
    { value: 'course', label: 'Formation' },
    { value: 'template', label: 'Template' },
  ];

  const categoryOptions = [
    { value: '', label: 'Toutes les catégories' },
    ...categories.map(category => ({ value: category, label: category }))
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-200">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-medium text-slate-900 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 lg:max-w-md">
          {/* Category Filter */}
          <div className="flex-1">
            <CustomDropdown
              options={categoryOptions}
              value={selectedCategory}
              placeholder="Toutes les catégories"
              onChange={onCategoryChange}
            />
          </div>

          {/* Type Filter */}
          <div className="flex-1">
            <CustomDropdown
              options={typeOptions}
              value={selectedType}
              placeholder="Tous les types"
              onChange={onTypeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchFilters; 