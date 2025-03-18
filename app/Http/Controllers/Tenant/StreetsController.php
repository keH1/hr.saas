<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Street;
use Illuminate\Http\Request;

class StreetsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'street' => 'required',
        ]);

        Street::create([
            'name' => $request->street,
        ]);

        return redirect()->back();
    }
}
