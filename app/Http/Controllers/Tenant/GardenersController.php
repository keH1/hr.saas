<?php

namespace App\Http\Controllers\Tenant;

use App\Contracts\TotalWidgetsProviderInterface;
use App\Data\Tenant\Forms\PlotCreateData;
use App\Data\Tenant\Frontend\SelectOptions\GardenerOptionsData;
use App\Data\Tenant\Frontend\SelectOptions\PlotOptionsData;
use App\Data\Tenant\Frontend\SelectOptions\StreetOptionsData;
use App\Data\Tenant\Frontend\Table\GardenerTableData;
use App\Data\Tenant\Frontend\Widgets\PageTotalWidget;
use App\Data\Tenant\Frontend\Widgets\PageWidgets;
use App\Enums\Tenant\ContactLabels;
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

class GardenersController extends Controller implements TotalWidgetsProviderInterface
{
    /**
     * GET /gardeners
     * Отобразить список
     */
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

    /**
     * GET /gardeners/create
     * Показать форму для создания
     */
    public function create()
    {
        $plots = Plot::limit(10)->get()->mapWithKeys(function ($item, $key) {
            return [$key => new PlotOptionsData($key, $item->street->name . ' ' . $item->plot_number)];
        });

        return Inertia::render('Tenant/Gardeners/Add', [
            'contact_labels' => ContactLabels::toSelectOptions(),
            'plots' => $plots
        ]);
    }

    /**
     * POST /gardeners
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
     * GET /gardeners/{gardener}
     * Показать детальную страницу
     */
    public function show(Plot $plot)
    {
        return Inertia::render('Tenant/Gardeners/Detail', []);
    }

    /**
     * GET /gardeners/{gardener}/edit
     * Показать форму для редактирования
     */
    public function edit(Street $street)
    {
        return inertia('Streets/Edit', ['street' => $street]);
    }

    /**
     * PUT/PATCH /gardeners/{gardener}
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
     * DELETE /gardeners/{gardener}
     * Удалить
     */
    public function destroy(Street $street)
    {
        $street->delete();

        return redirect()->route('streets.index')->with('success', 'Улица удалена!');
    }

    /**
     * Ajax для выбора списка садоводов с поиском
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
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

    /**
     * Собирает тотал виджеты для страницы списка
     *
     * @return \App\Data\Tenant\Frontend\Widgets\PageWidgets
     */
    public function buildTotalWidgets(): PageWidgets
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
