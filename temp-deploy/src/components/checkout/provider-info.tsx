interface ProviderInfoProps {
  provider: string;
  fallbackUsed: boolean;
}

export function ProviderInfo({ provider, fallbackUsed }: ProviderInfoProps) {
  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'pawapay':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'paydunya':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'pawapay':
        return '🔗';
      case 'paydunya':
        return '💳';
      default:
        return '⚡';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getProviderColor(provider)}`}>
      <span>{getProviderIcon(provider)}</span>
      <span>{provider.toUpperCase()}</span>
      {fallbackUsed && (
        <span className="text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full text-xs">
          FALLBACK
        </span>
      )}
    </div>
  );
}

