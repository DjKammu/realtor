<?php

use App\Http\Controllers\publicControllers\profileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('auth/Login');
    // return Inertia::render('Welcome', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion' => PHP_VERSION,
    // ]);
});

// Set Up Routes // 

Route::inertia('/setup', 'Setup')->middleware('auth');

Route::resource('roles', App\Http\Controllers\RoleController::class)->middleware('can:add_users');
Route::resource('users', App\Http\Controllers\UserController::class)->middleware('can:add_users');
Route::resource('properties', App\Http\Controllers\PropertyController::class);
Route::post('properties/quick-add', [App\Http\Controllers\PropertyController::class,
    'quickAdd'])->name('properties.quick-add'); 
Route::resource('showing-status', App\Http\Controllers\ShowingStatusController::class);
Route::resource('leasing-status', App\Http\Controllers\LeasingStatusController::class);
Route::resource('suites', App\Http\Controllers\SuiteController::class);

Route::get('get-suites', [App\Http\Controllers\SuiteController::class, 'getSuites'])->name('suites.properties');
Route::resource('document-types', App\Http\Controllers\DocumentTypeController::class);
Route::resource('tenant-uses', App\Http\Controllers\TenantUseController::class);
Route::resource('tenants', App\Http\Controllers\TenantController::class);
Route::resource('realtors', App\Http\Controllers\RealtorController::class);


// Modules Routes 
Route::resource('tenant-prospects', App\Http\Controllers\TenantProspectController::class);
Route::resource('leases', App\Http\Controllers\LeaseController::class);
 Route::get('download/tenant-prospects', [App\Http\Controllers\TenantProspectController::class,
    'downloadPDF'])->name('download.tenant-prospects'); 
 Route::get('download/leases', [App\Http\Controllers\LeaseController::class,
    'downloadPDF'])->name('download.leases');
 Route::get('leases-attachment/delete/{id}', [App\Http\Controllers\LeaseController::class,
    'deleteAttachment'])->name('leases.attachment.delete');



// Profile Routes 
Route::group(['middleware' => 'auth'], function() {
    Route::inertia('/home', 'Home');

    Route::get('/profile', [profileController::class, 'index'])->name('profile');
    Route::delete('/profilePhotoDelete', [profileController::class, 'deleteProfilePhoto'])->name('profilePhotoDelete');
    Route::put('/profilePhotoUpdate', [profileController::class, 'updateProfilePhoto'])->name('profilePhotoUpdate');
    Route::delete('/profileDelete', [profileController::class, 'deleteProfile'])->name('profileDelete');

});


// Favourite Routes
Route::resource('favourites', App\Http\Controllers\FavouriteUrlController::class);
Route::post('favourite',[ App\Http\Controllers\FavouriteUrlController::class,'getFavourite'])->name('get.favourite');


// Migration Routes

Route::get('/linkstorage', function () {
    Artisan::call('storage:link');
    $exitCode = Artisan::call('storage:link', [] );
    echo $exitCode;
});

Route::get('/migration', function () {
    $m = request()->m;
    Artisan::call('migrate'.$m);
    $exitCode = Artisan::call('migrate', [] );
    echo $exitCode;
});