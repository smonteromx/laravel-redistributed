export const EmphasisVariants = {
    AFFIRMATIVE: 'affirmative',
    INFORMATIVE: 'informative',
    PREVENTIVE: 'preventive',
    DESTRUCTIVE: 'destructive',
    INTERROGATIVE: 'interrogative',
} as const;

export type EmphasisVariant =
    (typeof EmphasisVariants)[keyof typeof EmphasisVariants];

export type EmphasisVariantAlternative =
    'success' | 'info' | 'warning' | 'error' | 'message';
