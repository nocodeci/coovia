<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Builder;

class ProductAttribute extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'type',
        'description',
        'is_required',
        'is_filterable',
        'is_searchable',
        'options',
        'validation_rules',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'is_filterable' => 'boolean',
        'is_searchable' => 'boolean',
        'options' => 'array',
        'validation_rules' => 'array',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    // Types d'attributs disponibles
    const TYPE_TEXT = 'text';
    const TYPE_NUMBER = 'number';
    const TYPE_SELECT = 'select';
    const TYPE_MULTISELECT = 'multiselect';
    const TYPE_BOOLEAN = 'boolean';
    const TYPE_DATE = 'date';
    const TYPE_DATETIME = 'datetime';
    const TYPE_COLOR = 'color';
    const TYPE_FILE = 'file';

    // Scopes
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    public function scopeFilterable(Builder $query): void
    {
        $query->where('is_filterable', true);
    }

    public function scopeSearchable(Builder $query): void
    {
        $query->where('is_searchable', true);
    }

    public function scopeRequired(Builder $query): void
    {
        $query->where('is_required', true);
    }

    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order');
    }

    // Accessors
    public function getTypeLabelAttribute(): string
    {
        return match($this->type) {
            self::TYPE_TEXT => 'Texte',
            self::TYPE_NUMBER => 'Nombre',
            self::TYPE_SELECT => 'Sélection unique',
            self::TYPE_MULTISELECT => 'Sélection multiple',
            self::TYPE_BOOLEAN => 'Oui/Non',
            self::TYPE_DATE => 'Date',
            self::TYPE_DATETIME => 'Date et heure',
            self::TYPE_COLOR => 'Couleur',
            self::TYPE_FILE => 'Fichier',
            default => 'Inconnu',
        };
    }

    public function getHasOptionsAttribute(): bool
    {
        return in_array($this->type, [self::TYPE_SELECT, self::TYPE_MULTISELECT]);
    }

    public function getOptionsListAttribute(): array
    {
        if (!$this->hasOptions || empty($this->options)) {
            return [];
        }

        return collect($this->options)->pluck('label', 'value')->toArray();
    }

    public function getValidationRulesArrayAttribute(): array
    {
        if (empty($this->validation_rules)) {
            return [];
        }

        $rules = [];
        
        if (isset($this->validation_rules['required']) && $this->validation_rules['required']) {
            $rules[] = 'required';
        } else {
            $rules[] = 'nullable';
        }

        if (isset($this->validation_rules['min'])) {
            $rules[] = 'min:' . $this->validation_rules['min'];
        }

        if (isset($this->validation_rules['max'])) {
            $rules[] = 'max:' . $this->validation_rules['max'];
        }

        if (isset($this->validation_rules['pattern'])) {
            $rules[] = 'regex:' . $this->validation_rules['pattern'];
        }

        if (isset($this->validation_rules['unique'])) {
            $rules[] = 'unique:' . $this->validation_rules['unique'];
        }

        return $rules;
    }

    // Méthodes statiques
    public static function getAvailableTypes(): array
    {
        return [
            self::TYPE_TEXT,
            self::TYPE_NUMBER,
            self::TYPE_SELECT,
            self::TYPE_MULTISELECT,
            self::TYPE_BOOLEAN,
            self::TYPE_DATE,
            self::TYPE_DATETIME,
            self::TYPE_COLOR,
            self::TYPE_FILE,
        ];
    }

    public static function getTypeLabels(): array
    {
        $labels = [];
        foreach (self::getAvailableTypes() as $type) {
            $labels[$type] = (new self(['type' => $type]))->type_label;
        }
        return $labels;
    }

    // Méthodes d'instance
    public function isTextType(): bool
    {
        return $this->type === self::TYPE_TEXT;
    }

    public function isNumberType(): bool
    {
        return $this->type === self::TYPE_NUMBER;
    }

    public function isSelectType(): bool
    {
        return in_array($this->type, [self::TYPE_SELECT, self::TYPE_MULTISELECT]);
    }

    public function isBooleanType(): bool
    {
        return $this->type === self::TYPE_BOOLEAN;
    }

    public function isDateType(): bool
    {
        return in_array($this->type, [self::TYPE_DATE, self::TYPE_DATETIME]);
    }

    public function isColorType(): bool
    {
        return $this->type === self::TYPE_COLOR;
    }

    public function isFileType(): bool
    {
        return $this->type === self::TYPE_FILE;
    }

    public function addOption(string $value, string $label, int $sortOrder = 0): void
    {
        $options = $this->options ?? [];
        $options[] = [
            'value' => $value,
            'label' => $label,
            'sort_order' => $sortOrder,
        ];
        
        $this->options = collect($options)->sortBy('sort_order')->values()->toArray();
        $this->save();
    }

    public function removeOption(string $value): void
    {
        if (empty($this->options)) {
            return;
        }

        $this->options = collect($this->options)->filter(function ($option) use ($value) {
            return $option['value'] !== $value;
        })->values()->toArray();
        
        $this->save();
    }

    public function getOptionLabel(string $value): ?string
    {
        if (empty($this->options)) {
            return null;
        }

        $option = collect($this->options)->firstWhere('value', $value);
        return $option['label'] ?? null;
    }

    public function validateValue(mixed $value): bool
    {
        // Validation de base selon le type
        switch ($this->type) {
            case self::TYPE_NUMBER:
                return is_numeric($value);
            case self::TYPE_BOOLEAN:
                return is_bool($value) || in_array($value, [0, 1, '0', '1', true, false]);
            case self::TYPE_DATE:
                return strtotime($value) !== false;
            case self::TYPE_COLOR:
                return preg_match('/^#[a-fA-F0-9]{6}$/', $value);
            case self::TYPE_SELECT:
                return $this->hasOptions && collect($this->options)->pluck('value')->contains($value);
            case self::TYPE_MULTISELECT:
                if (!is_array($value)) {
                    return false;
                }
                return $this->hasOptions && collect($this->options)->pluck('value')->diff($value)->isEmpty();
            default:
                return true;
        }
    }
}
