<?php

namespace App\Enums;

enum FlashResponse: string
{
    case CALLOUT = 'alert';
    case TRANSIENT = 'toast';
}
