<?php

namespace App\Http\Controllers\Tenant;

use App\Data\Tenant\Frontend\Table\PlotTableData;
use App\Data\Tenant\Frontend\Table\TotalWidgetsData;
use App\Data\Tenant\Frontend\Widgets\PageTotalWidget;
use App\Data\Tenant\Frontend\Widgets\PageWidgets;
use App\Http\Controllers\Controller;
use App\Models\Tenant\Plot;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PlotsController extends Controller
{

    public function index(Request $request)
    {
        $perPage = $request->query('pp', config('app.defaults.list_settings.per_page'));
        $plots = Plot::search($request->q)
                     ->orderBy('id')
                     ->query(fn(Builder $query) => $query->with(['owners']))
                     ->paginate($perPage)
                     ->onEachSide(1)
                     ->withQueryString();

        return Inertia::render('Tenant/Plots/List', [
            'plots' => PlotTableData::from($plots),
            'total' => $this->buildTotalWidgets()
        ]);
    }

    private function buildTotalWidgets(): PageWidgets
    {
        $counts = DB::table('plots')
                    ->selectRaw('SUM(area) as total_plots_square')
                    ->selectRaw('COUNT(*) as total_count')
                    ->first();

        return new PageWidgets([
            new PageTotalWidget(__('tenant/page_total_widgets.plots_total'), $counts->total_count),
            new PageTotalWidget(__('tenant/page_total_widgets.total_plots_square'), number_format($counts->total_plots_square, 0, '', ' '), 'м²'),
        ]);
    }
}
