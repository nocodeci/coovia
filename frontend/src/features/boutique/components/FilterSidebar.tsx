import React from 'react'
import { X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

interface FilterSidebarProps {
  showFilters: boolean
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onClose: () => void
}

export function FilterSidebar({ 
  showFilters, 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onClose 
}: FilterSidebarProps) {
  const [priceRange, setPriceRange] = React.useState([0, 2000])
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = React.useState<number[]>([])

  const brands = ['Samsung', 'Apple', 'Sony', 'LG', 'Nike', 'Adidas']
  const ratings = [5, 4, 3, 2, 1]

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    )
  }

  const clearFilters = () => {
    onCategoryChange('all')
    setPriceRange([0, 2000])
    setSelectedBrands([])
    setSelectedRatings([])
  }

  const activeFiltersCount = [
    selectedCategory !== 'all' ? 1 : 0,
    selectedBrands.length,
    selectedRatings.length,
    priceRange[0] > 0 || priceRange[1] < 2000 ? 1 : 0
  ].reduce((sum, count) => sum + count, 0)

  const sidebarContent = (
    <div className="space-y-6">
      {/* Catégories */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Catégories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategory === category}
                onCheckedChange={() => onCategoryChange(category)}
              />
              <Label 
                htmlFor={`category-${category}`}
                className="text-sm cursor-pointer capitalize"
              >
                {category === 'all' ? 'Toutes les catégories' : category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Prix */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Prix</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={2000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{priceRange[0]} €</span>
            <span>{priceRange[1]} €</span>
          </div>
        </div>
      </div>

      {/* Marques */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Marques</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => handleBrandToggle(brand)}
              />
              <Label 
                htmlFor={`brand-${brand}`}
                className="text-sm cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Notes</h3>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={selectedRatings.includes(rating)}
                onCheckedChange={() => handleRatingToggle(rating)}
              />
              <Label 
                htmlFor={`rating-${rating}`}
                className="text-sm cursor-pointer flex items-center space-x-1"
              >
                <span>{rating}+</span>
                <div className="flex">
                  {[...Array(rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton Effacer */}
      {activeFiltersCount > 0 && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearFilters}
          className="w-full"
        >
          Effacer tous les filtres
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filtres</h2>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </div>
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={showFilters} onOpenChange={onClose}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>Filtres</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount}</Badge>
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {sidebarContent}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
} 