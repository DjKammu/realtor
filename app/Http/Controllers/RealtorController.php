<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TenantUse;
use App\Models\Realtor;
use App\Models\User;
use Inertia\Inertia;
use Carbon\Carbon;
use Gate;
use PDF;

class RealtorController extends Controller
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

         $realtors = Realtor::query();

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

          $realtors = $realtors->when($s, function ($q) use 
             ($s) {$q->where('name','like',"%$s%");
          });
        
         $realtors = $realtors->addSelect(['tenant_use' => TenantUse::select('name')
            ->whereColumn('tenant_uses.id', 'realtors.tenant_use_id')
            ->take(1)
        ])->orderBy($orderBy,$order)->paginate((new Realtor())->perPage); 
      
         return Inertia::render('realtors/Index',compact('realtors','tenantUses','s'));
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
       

          return Inertia::render('realtors/Create',compact('tenantUses'));
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

        Realtor::create($data);

       return redirect('realtors')->with('message', 'Realtor Created Successfully!');
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

         $realtor = Realtor::find($id);

         $tenantUses = TenantUse::orderBy('name')->get();

          $tenantUses = @$tenantUses->filter(function($tenantU){
              $tenantU->label = $tenantU->name;
              $tenantU->value = $tenantU->id;
              return $tenantU;
          });
       

          $tenantUse = @$realtor->tenant_use;

          if($tenantUse){
                $tenantUse->label = ($tenantUse) ? @$tenantUse->name : '';
                $tenantUse->value = ($tenantUse) ? @$tenantUse->id : '';
          }

         return Inertia::render('realtors/Edit',compact('realtor','tenantUses','tenantUse'));
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

        
        $realtor = Realtor::find($id);

         if(!$realtor){
            return redirect()->back();
         }
          
        $realtor->update($data);
          
        return redirect('realtors')->with('message', 'Realtor Updated Successfully!');
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
         Realtor::find($id)->delete();

        return redirect()->back()->with('message', 'Realtor Deleted Successfully!');
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
