<?php

namespace App\Data\Tenant\Frontend\Table;

use App\Data\Tenant\Frontend\PaginationLinksData;
use Spatie\LaravelData\Data;

abstract class TableData extends Data
{
    public function __construct(
        public readonly int $current_page,
        public readonly ?string $first_page_url,
        public readonly ?int $from,
        public readonly ?int $last_page,
        public readonly string $last_page_url,
        /** @var array<PaginationLinksData> */ public readonly ?array $links,
        public readonly ?string $next_page_url,
        public readonly ?string $path,
        public readonly ?int $per_page,
        public readonly ?string $prev_page_url,
        public readonly ?int $to,
        public readonly ?int $total
    ) {
    }
}
