import React, { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { countries } from 'country-data-list'
import { CircleFlag } from 'react-circle-flags'
import { cn } from '../lib/utils'
import { Button } from './ui/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/ui/popover'

interface Country {
  name: string
  code: string
  flag: string
  currency: {
    code: string
    symbol: string
  }
}

interface CountrySelectorProps {
  onCountrySelect?: (country: Country) => void
  selectedCountry?: Country
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  onCountrySelect,
  selectedCountry
}) => {
  const [open, setOpen] = useState(false)

  // Filtrer et formater les pays avec des données valides
  const availableCountries: Country[] = countries.all
    .filter(country => 
      country.currencies && 
      country.currencies.length > 0
    )
    .map(country => ({
      name: country.name,
      code: country.alpha2,
      flag: country.alpha2.toLowerCase(),
      currency: {
        code: country.currencies[0].code,
        symbol: country.currencies[0].symbol || country.currencies[0].code
      }
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  // Pays par défaut (Côte d'Ivoire)
  const defaultCountry: Country = {
    name: 'Côte d\'Ivoire',
    code: 'CI',
    flag: 'ci',
    currency: {
      code: 'XOF',
      symbol: 'CFA'
    }
  }

  const currentCountry = selectedCountry || defaultCountry

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between"
        >
          <div className="flex items-center gap-2">
            <CircleFlag countryCode={currentCountry.flag} className="h-4 w-4" />
            <span>{currentCountry.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un pays..." />
          <CommandList>
            <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
            <CommandGroup>
              {availableCountries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.name}
                  onSelect={() => {
                    onCountrySelect?.(country)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <CircleFlag countryCode={country.flag} className="h-4 w-4" />
                    <span>{country.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {country.currency.symbol}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentCountry.code === country.code
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default CountrySelector 