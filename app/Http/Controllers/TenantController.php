<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TenantUse;
use App\Models\Tenant;
use App\Models\User;
use Inertia\Inertia;
use Carbon\Carbon;
use Gate;
use PDF;

class TenantController extends Controller
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

         $tenants = Tenant::query();

         $orderBy = 'name';  
         $order ='asc' ;
         
         if(request()->filled('orderby')){
            $orderBy = request()->filled('orderby') ? ( !in_array(request()->orderby, 
                ['name'] ) ? 'name' : request()->orderby ) : 'name';
            
            $order = !in_array(\Str::lower(request()->order), ['desc','asc'])  ? 'asc' 
             : request()->order;

        }
         
         $tenantUses = TenantUse::orderBy('name')->get();

          $tenantUses = @$tenantUses->filter(function($tenantU){
              $tenantU->label = $tenantU->name;
              $tenantU->value = $tenantU->id;
              return $tenantU;
          });
       
          $s = request()->s;
          
          $tenants = $tenants->when($s, function ($q) use 
             ($s) {$q->where('name','like',"%$s%");
          });
        
         $tenants = $tenants->addSelect(['tenant_use' => TenantUse::select('name')
            ->whereColumn('tenant_uses.id', 'tenants.tenant_use_id')
            ->take(1)
        ])->orderBy($orderBy,$order)->paginate((new Tenant())->perPage); 
      
         return Inertia::render('tenants/Index',compact('tenants','tenantUses','s'));
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
          
          $tenantUses = TenantUse::orderBy('name')->get();

          $tenantUses = @$tenantUses->filter(function($tenantU){
              $tenantU->label = $tenantU->name;
              $tenantU->value = $tenantU->id;
              return $tenantU;
          });
       

          return Inertia::render('tenants/Create',compact('tenantUses'));
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
              'name' => 'required|string'
        ]);

        Tenant::create($data);

       return redirect('tenants')->with('message', 'Tenant Created Successfully!');
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

         $tenant = Tenant::find($id);

         $tenantUses = TenantUse::orderBy('name')->get();

          $tenantUses = @$tenantUses->filter(function($tenantU){
              $tenantU->label = $tenantU->name;
              $tenantU->value = $tenantU->id;
              return $tenantU;
          });
       

          $tenantUse = @$tenant->tenant_use;

          if($tenantUse){
                $tenantUse->label = ($tenantUse) ? @$tenantUse->name : '';
                $tenantUse->value = ($tenantUse) ? @$tenantUse->id : '';
          }

         return Inertia::render('tenants/Edit',compact('tenant','tenantUses','tenantUse'));
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
              'name' => 'required|string'
        ]);

        
        $tenant = Tenant::find($id);

         if(!$tenant){
            return redirect()->back();
         }
          
        $tenant->update($data);
          
        return redirect('tenants')->with('message', 'Tenant Updated Successfully!');
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
         Tenant::find($id)->delete();

        return redirect()->back()->with('message', 'Tenant Deleted Successfully!');
    }

    // public function downloadPDF($id,$view = false){

    //     $tenant_prospects = TenantProspect::all();

    //     $pdf = PDF::loadView('tenant_prospects.pdf',
    //       ['tenant_prospects' => $tenant_prospects]
    //     );
         
    //    // $view = true; 
    //     if($view){
    //     // return $pdf->stream('tenant_prospects.pdf');
    //      return $pdf->setPaper('a4')->output();
    //     }
    //     return $pdf->download('tenant_prospects.pdf');
    // }

}
