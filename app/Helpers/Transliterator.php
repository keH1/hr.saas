<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class Transliterator
{
    /**
     * Transliterate a string from Cyrillic to Latin.
     *
     * @param string $text
     * @return string
     */
    public static function transliterate(string $text): string
    {
        $transliterator = \Transliterator::create('Any-Latin; Latin-ASCII; Lower()');
        $result = $transliterator->transliterate($text);

        return Str::slug($result);
    }
}
