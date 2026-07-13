import { useMemo } from 'react';
import type { Decoration } from '@/types/ui/decoration';

export function useDecorator<
    TValue extends string,
    TKeys extends keyof Decoration,
>(
    decorations: Record<TValue, Pick<Decoration, TKeys>>,
    value: TValue | string | null | undefined,
): Pick<Decoration, TKeys> | null {
    return useMemo(
        () =>
            value != null && value in decorations
                ? decorations[value as TValue]
                : null,
        [decorations, value],
    );
}
