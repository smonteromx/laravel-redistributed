import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react';
import type { EmphasisVariant } from '../enums/emphasis-variant';
import { EmphasisVariants } from '../enums/emphasis-variant';
import type { Decoration } from '../types/ui/decoration';

export const EmphasisVariantDecoration: Record<EmphasisVariant, Pick<Decoration, 'icon'>> = {
    [EmphasisVariants.AFFIRMATIVE]: { icon: CircleCheckIcon },
    [EmphasisVariants.INFORMATIVE]: { icon: InfoIcon },
    [EmphasisVariants.PREVENTIVE]: { icon: TriangleAlertIcon },
    [EmphasisVariants.DESTRUCTIVE]: { icon: OctagonXIcon },
    [EmphasisVariants.INTERROGATIVE]: { icon: Loader2Icon },
};
