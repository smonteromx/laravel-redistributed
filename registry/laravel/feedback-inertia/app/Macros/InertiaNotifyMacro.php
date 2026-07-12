<?php

namespace App\Macros;

use App\Enums\EmphasisVariant;
use App\Enums\FlashResponse;
use Inertia\ResponseFactory;

class InertiaNotifyMacro
{
    public static function declare(): void
    {
        ResponseFactory::macro('notify', function (string $message, FlashResponse $style, EmphasisVariant $variant = EmphasisVariant::AFFIRMATIVE) {
            return $this->flash($style->value, [
                'message' => $message,
                'variant' => $variant->value,
            ]);
        });
    }
}
