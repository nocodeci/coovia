import React, { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'
import { CircleFlag } from 'react-circle-flags'
import { cn } from '../lib/utils'
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

const CurrencySelector: React.FC = () => {
  const { currency, currencies, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)

  // Mapper les devises avec les drapeaux des pays correspondants
  const currencyWithFlags = currencies.map(curr => {
    const flagMap: { [key: string]: string } = {
      'XOF': 'ci', // Côte d'Ivoire
      'USD': 'us', // États-Unis
      'EUR': 'eu', // Union Européenne
      'GBP': 'gb', // Royaume-Uni
      'XAF': 'cm', // Cameroun
      'CDF': 'cd', // République Démocratique du Congo
      'NGN': 'ng', // Nigeria
      'GHS': 'gh'  // Ghana
    }
    
    return {
      ...curr,
      flag: flagMap[curr.code] || 'un' // UN flag par défaut
    }
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center space-x-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 min-w-[120px]">
          <CircleFlag 
            countryCode={currencyWithFlags.find(c => c.code === currency.code)?.flag || 'un'} 
            className="w-4 h-4 rounded-full" 
          />
          <span className="text-xs font-medium text-slate-700">({currency.symbol})</span>
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher une devise..." />
          <CommandList>
            <CommandEmpty>Aucune devise trouvée.</CommandEmpty>
            <CommandGroup>
              {currencyWithFlags.map((curr) => (
                <CommandItem
                  key={curr.code}
                  value={curr.name}
                  onSelect={() => {
                    setCurrency(curr)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <CircleFlag countryCode={curr.flag} className="h-4 w-4 rounded-full flex-shrink-0" />
                    <span className="text-sm flex-1 min-w-0">{curr.name}</span>
                    <span className="font-medium text-xs flex-shrink-0">
                      {curr.symbol}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      curr.code === currency.code
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

export default CurrencySelector 