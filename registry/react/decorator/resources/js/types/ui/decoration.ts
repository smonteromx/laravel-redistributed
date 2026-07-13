import type { LucideIcon } from 'lucide-react';
import type { EmphasisVariant } from '../../enums/emphasis-variant';

export type Decoration = {
    label: string;
    description: string;
    emphasis: EmphasisVariant;
    icon: LucideIcon;
};
