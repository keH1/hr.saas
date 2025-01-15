<?php

namespace App\Services\Tenant;

use Illuminate\Support\Str;

class MainMenuService
{
    private(set) array $menu;

    public function __construct()
    {
        $this->menu = [
            Str::upper(__('tenant/menu.main')),
            [
                "icon" => "LayoutDashboard",
                "pathname" => route('dashboard'),
                "name" => 'dashboard',
                "title" => __('tenant/menu.dashboard'),
            ],
            [
                "icon" => "LandPlot",
                "pathname" => route('plots.list'),
                "name" => "plots.*",
                "title" => __('tenant/menu.plots'),
            ],
            [
                "icon" => "SquareUser",
                "pathname" => route('gardeners.list'),
                "name" => "gardeners.*",
                "title" => __('tenant/menu.gardeners'),
            ],
            "УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ",
            [
                "icon" => "PackagePlus",
                "pathname" => "/add-user",
                "name" => "dsdsg",
                "title" => "Add User",
            ],
            "E-COMMERCE",
            [
                "icon" => "BookMarked",
                "pathname" => "/categories",
                "name" => "dsdsg",
                "title" => "Categories",
            ],
            [
                "icon" => "Compass",
                "pathname" => "/add-product",
                "name" => "dsdsg",
                "title" => "Add Product",
            ],
            [
                "icon" => "Table2",
                "pathname" => "/products",
                "name" => "dsdsg",
                "title" => "Products",
                "subMenu" => [
                    [
                        "icon" => "LayoutPanelTop",
                        "pathname" => "/product-list",
                        "name" => "dsdsg",
                        "title" => "Product List",
                    ],
                    [
                        "icon" => "LayoutPanelLeft",
                        "pathname" => "/product-grid",
                        "name" => "dsdsg",
                        "title" => "Product Grid",
                    ],
                ],
            ],
            "AUTHENTICATIONS",
            [
                "icon" => "BookKey",
                "pathname" => "login",
                "name" => "dsdsg",
                "title" => "Login",
            ],
            [
                "icon" => "BookLock",
                "pathname" => "register",
                "name" => "dsdsg",
                "title" => "Register",
            ],
        ];
    }

}
