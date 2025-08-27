<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Routes PayDunya Web
Route::prefix('paydunya')->group(function () {
    Route::post('webhook', function () {
        return app(\App\Http\Controllers\Api\PayDunyaController::class)->webhook(request());
    })->name('paydunya.webhook');
    
    Route::get('success', function () {
        return response()->json(['message' => 'Paiement réussi']);
    })->name('paydunya.success');
    
    Route::get('cancel', function () {
        return response()->json(['message' => 'Paiement annulé']);
    })->name('paydunya.cancel');
});

// Routes de paiement Wave CI
Route::get('/test/wave-payment', function () {
    return view('wave-payment-test');
})->name('test.wave_payment');

Route::post('/pay/wave-ci', [PaymentController::class, 'initiateWavePayment'])->name('payment.initiate.wave_ci')->withoutMiddleware(['web']);
