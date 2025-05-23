<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Autenticación
Route::get('/login', fn() => Inertia::render('auth/Login'))->name('login');
Route::get('/register', fn() => Inertia::render('auth/Register'))->name('register');

// Cliente
Route::get('/client/Home_Cli', fn() => Inertia::render('Ferreteria/client/Home_Cli'))->name('home_cli');
Route::get('/client/Orders_Cli', fn() => Inertia::render('Ferreteria/client/Orders_Cli'))->name('pedidos_cli');
Route::get('/client/History_Cli', fn() => Inertia::render('Ferreteria/client/History_Cli'))->name('historial_cli');
Route::get('/client/Catalog_Cli', fn() => Inertia::render('Ferreteria/client/Catalog_Cli'))->name('catalogo_cli');
Route::get('/client/Notifications_Cli', fn() => Inertia::render('Ferreteria/client/Notifications_Cli'))->name('notificaciones_cli');
Route::get('/client/Ofertas_Cli', fn() => Inertia::render('Ferreteria/client/Ofertas_Cli'))->name('ofertas_cli');

// Preventista
Route::get('/preventive/Shopping_Pre', fn() => Inertia::render('Ferreteria/preventive/Shopping_Pre'))->name('compras_pre');
Route::get('/preventive/Orders_Pre', fn() => Inertia::render('Ferreteria/preventive/Orders_Pre'))->name('pedidos_pre');
Route::get('/preventive/History_Pre', fn() => Inertia::render('Ferreteria/preventive/History_Pre'))->name('historial_pre');
Route::get('/preventive/Catalog_Pre', fn() => Inertia::render('Ferreteria/preventive/Catalog_Pre'))->name('catalogo_pre');
Route::get('/preventive/Notifications_Pre', fn() => Inertia::render('Ferreteria/preventive/Notifications_Pre'))->name('notificaciones_pre');
Route::get('/preventive/Offers_Pre', fn() => Inertia::render('Ferreteria/preventive/Offers_Pre'))->name('ofertas_pre');

// Administrador
Route::get('/admin/Index_Admin', fn() => Inertia::render('Ferreteria/admin/Index_Admin'))->name('inicio_admin');
Route::get('/admin/Orders_Admin', fn() => Inertia::render('Ferreteria/admin/Orders_Admin'))->name('productos_admin');
Route::get('/admin/Users_Admin', fn() => Inertia::render('Ferreteria/admin/Users_Admin'))->name('usuarios_admin');
Route::get('/admin/UploadFiles_Admin', fn() => Inertia::render('Ferreteria/admin/UploadFiles_Admin'))->name('uploadfiles_admin');
