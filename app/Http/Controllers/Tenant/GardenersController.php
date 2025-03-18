<?php

namespace App\Http\Controllers\Tenant;

use App\Data\Tenant\Frontend\SelectOptions\GardenerOptionsData;
use App\Data\Tenant\Frontend\Table\GardenerTableData;
use App\Data\Tenant\Frontend\Widgets\PageTotalWidget;
use App\Data\Tenant\Frontend\Widgets\PageWidgets;
use App\Http\Controllers\Controller;
use App\Models\Tenant\Gardener;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GardenersController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->query('pp', config('app.defaults.list_settings.per_page'));
        $gardeners = Gardener::search($request->q)->orderBy('id')->query(fn(Builder $query) => $query->with([
            'plots',
            'contacts'
        ]))->paginate($perPage)->onEachSide(1)->withQueryString();

        return Inertia::render('Tenant/Gardeners/List', [
            'gardeners' => GardenerTableData::from($gardeners),
            'total' => $this->buildTotalWidgets()
        ]);
    }

    public function options(Request $request)
    {
        $gardeners = Gardener::search($request->q)->query(fn(Builder $query) => $query->select([
            'id',
            'last_name',
            'first_name',
            'middle_name'
        ]))->get()->pluck('name', 'id')->mapWithKeys(
            function (string $item, int $key) {
                return [$key => new GardenerOptionsData($key, $item)];
            }
        );

        return response()->json($gardeners);
    }

    private function buildTotalWidgets()
    {
        $counts = DB::table('gardeners')
                    ->selectRaw('SUM(CASE WHEN is_member = true THEN 1 ELSE 0 END) as member_count')
                    ->selectRaw('SUM(CASE WHEN is_member = false THEN 1 ELSE 0 END) as non_member_count')
                    ->selectRaw('COUNT(*) as total_count')
                    ->first();

        return new PageWidgets([
            new PageTotalWidget(__('tenant/page_total_widgets.gardeners_total'), $counts->total_count),
            new PageTotalWidget(__('tenant/page_total_widgets.total_is_member'), $counts->member_count),
            new PageTotalWidget(__('tenant/page_total_widgets.total_is_not_member'), $counts->non_member_count),
        ]);
    }
}
