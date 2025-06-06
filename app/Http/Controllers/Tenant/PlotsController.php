<?php

namespace App\Http\Controllers\Tenant;

use App\Contracts\TotalWidgetsProviderInterface;
use App\Data\Tenant\Forms\PlotCreateData;
use App\Data\Tenant\Frontend\SelectOptions\GardenerOptionsData;
use App\Data\Tenant\Frontend\SelectOptions\StreetOptionsData;
use App\Data\Tenant\Frontend\Table\PlotTableData;
use App\Data\Tenant\Frontend\Widgets\PageTotalWidget;
use App\Data\Tenant\Frontend\Widgets\PageWidgets;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\NewPlotRequest;
use App\Models\Tenant\Gardener;
use App\Models\Tenant\Plot;
use App\Models\Tenant\Street;
use App\Repositories\Tenant\PlotRepository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PlotsController extends Controller implements TotalWidgetsProviderInterface
{

    /**
     * GET /plots
     * Отобразить список
     */
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

    /**
     * GET /plots/create
     * Показать форму для создания
     */
    public function create()
    {
        return Inertia::render('Tenant/Plots/Add', [
            'streets' => Street::pluck('name', 'id')->mapWithKeys(function (string $item, int $key) {
                return [$key => new StreetOptionsData($key, $item)];
            }),
            'gardeners' => Gardener::limit(config('app.defaults.default_options_limit'))->select(
                [
                    'id',
                    'last_name',
                    'first_name',
                    'middle_name'
                ]
            )->get()->pluck('name', 'id')->mapWithKeys(function (string $item, int $key) {
                return [$key => new GardenerOptionsData($key, $item)];
            })
        ]);
    }

    /**
     * POST /plots
     * Сохранить новую запись в базе
     */
    public function store(NewPlotRequest $request, PlotRepository $plotRepository)
    {
        $validatedData = $request->validated();
        $plotData = PlotCreateData::fromRequest($validatedData);
        $plot = $plotRepository->create($plotData);

        return redirect()->route('plots.show', ['plot' => $plot->id])->with('success', 'Участок успешно создан!');
    }

    /**
     * GET /plots/{plot}
     * Показать детальную страницу
     */
    public function show(Plot $plot)
    {
        return Inertia::render('Tenant/Plots/Detail', []);
    }

    /**
     * GET /plots/{plot}/edit
     * Показать форму для редактирования
     */
    public function edit(Street $street)
    {
        return inertia('Streets/Edit', ['street' => $street]);
    }

    /**
     * PUT/PATCH /plots/{plot}
     * Обновить данные
     */
    public function update(Request $request, Street $street)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $street->update($validated);

        return redirect()->route('streets.index')->with('success', 'Улица обновлена!');
    }

    /**
     * DELETE /plots/{plot}
     * Удалить
     */
    public function destroy(Street $street)
    {
        $street->delete();

        return redirect()->route('streets.index')->with('success', 'Улица удалена!');
    }

    public function checkPlotExistence(Request $request)
    {
        $request->validate([
            'plot_number' => 'required',
            'street_id' => 'required',
        ]);

        $plotNumber = $request->input('plot_number');
        $streetId = $request->input('street_id');

        $exists = Plot::where('plot_number', $plotNumber)
                      ->where('street_id', $streetId)
                      ->exists();

        return response()->json(['exists' => $exists]);
    }

    public function buildTotalWidgets(): PageWidgets
    {
        $counts = DB::table('plots')
                    ->selectRaw('SUM(area) as total_plots_square')
                    ->selectRaw('COUNT(*) as total_count')
                    ->first();

        return new PageWidgets([
            new PageTotalWidget(__('tenant/page_total_widgets.plots_total'), $counts->total_count),
            new PageTotalWidget(
                __('tenant/page_total_widgets.total_plots_square'),
                number_format($counts->total_plots_square, 0, '', ' '),
                'м²'
            ),
        ]);
    }
}
