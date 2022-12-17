<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;
use App\Models\TenantUse;
use Inertia\Inertia;
use Gate;
use Carbon\Carbon;


class TenantUseController extends Controller
{
     /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
     public function index()
    {
         if(Gate::denies('view')) {
               return abort('401');
         } 

         $tenantUses = TenantUse::query();

         $orderBy = 'account_number';  
         $order ='ASC' ;
         
         if(request()->filled('order')){
            $orderBy = request()->filled('orderby') ? ( !in_array(request()->orderby, 
                ['account_number','name'] ) ? 'name' : request()->orderby ) : 'name';
            
            $order = !in_array(\Str::lower(request()->order), ['desc','asc'])  ? 'ASC' 
             : request()->order;
        }
        
         $tenantUses = $tenantUses->orderBy($orderBy,$order)->paginate((new TenantUse())->perPage); 
         
          return Inertia::render('tenant_uses/Index',['tenantUses' => $tenantUses]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if(Gate::denies('add')) {
               return abort('401');
         } 

        return Inertia::render('tenant_uses/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
          if(Gate::denies('add')) {
               return abort('401');
        } 

        $data = $request->except('_token');

        $request->validate([
              'name' => 'required|unique:tenant_uses',
              'account_number' => 'required|unique:tenant_uses',
        ]);

        $data['slug'] = \Str::slug($request->name);
            
        TenantUse::create($data);

        return redirect('tenant-uses')->with('message', 'Tenant Use Created Successfully!');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
          if(Gate::denies('edit')) {
               return abort('401');
          } 

        $tenantUse = TenantUse::find($id);
        return Inertia::render('tenant_uses/Edit',compact('tenantUse'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if(Gate::denies('update')) {
               return abort('401');
        } 

        $data = $request->except('_token');

        $request->validate([
              'name' => 'required|unique:tenant_uses,name,'.$id,
              'account_number' => 'required|unique:tenant_uses,account_number,'.$id,
        ]);

        $data['slug'] = \Str::slug($request->name);

        $tenantUse = TenantUse::find($id);

         if(!$tenantUse){
            return redirect()->back();
         }
          
         $tenantUse->update($data);

        return redirect('tenant-uses')->with('message', 'Tenant Use Updated Successfully!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
         if(Gate::denies('delete')) {
               return abort('401');
          } 

         $tenantUse = TenantUse::find($id);

         $tenantUse->delete();

        return redirect()->back()->with('message', 'Tenant Use Delete Successfully!');
    }
}
