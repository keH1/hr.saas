<?php

namespace App\Http\Middleware;

use App\Services\Tenant\MainMenuService;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'dadataToken' => config('app.dadata_token'),
            'mainMenu' => new MainMenuService()->menu,
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'listPageProps' => [
                'defaultPerPage' => config('app.defaults.list_settings.per_page'),
                'defaultOnPage' => config('app.defaults.list_settings.on_page'),
            ],
            'queryParams' => $request->query()
        ];
    }
}
