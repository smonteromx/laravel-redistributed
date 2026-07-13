import { usePage } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconRenderer } from '@/components/ux/typography/icon-renderer';
import { EmphasisVariantDecoration } from '@/decorations/emphasis-variant-decoration';
import { useDecorator } from '@/hooks/use-decorator';

function FlashAlert({ ...props }: ComponentProps<'div'>) {
    const { alert } = usePage().flash;
    const decorator = useDecorator(EmphasisVariantDecoration, alert?.variant);

    if (!alert || !decorator) {
        return null;
    }

    const { icon } = decorator;

    return (
        <Alert variant={alert.variant} {...props}>
            <IconRenderer iconNode={icon} />
            <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
    );
}

export { FlashAlert };
