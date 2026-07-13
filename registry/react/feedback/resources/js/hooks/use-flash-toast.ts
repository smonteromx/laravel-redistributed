import { router } from '@inertiajs/react';
import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { EmphasisVariant, EmphasisVariantAlternative } from '@/enums/emphasis-variant';
import type { FlashResponse } from '@/types/data/flash-response';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashResponse | undefined;

            if (!data) {
                return;
            }

            const emphasisMap: Record<EmphasisVariant, EmphasisVariantAlternative> = {
                affirmative: 'success',
                informative: 'info',
                preventive: 'warning',
                destructive: 'error',
                interrogative: 'message',
            };

            if (data.variant === 'interrogative') {
                toast[emphasisMap[data.variant]](data.message, {
                    style: {
                        '--normal-bg': 'var(--interrogative-accent)',
                        '--normal-border': 'var(--interrogative)',
                        '--normal-text': 'var(--interrogative-accent-foreground)',
                    } as CSSProperties,
                });

                return;
            }

            toast[emphasisMap[data.variant]](data.message);
        });
    }, []);
}
