<?php
namespace App\Http\Controllers;

use App\Models\ShowingStatus;
use App\Models\LeasingStatus;
use App\Models\TenantUse;
use Illuminate\Http\Request;
use App\Models\DocumentType;
use App\Models\Property;
use App\Models\Realtor;
use App\Models\Tenant;
use App\Models\Suite;
use App\Models\Lease;
use App\Models\User;
use Inertia\Inertia;
use Carbon\Carbon;
use Gate;
use PDF;

class LeaseController extends Controller
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
         
         $leases = Lease::query();

         $orderBy = 'tenant_name';  
         $order ='asc' ;
         
         if(request()->filled('orderby')){
            $orderBy = request()->filled('orderby') ? ( !in_array(request()->orderby, 
                ['tenant_use','tenant_name','date','showing_date','property_id','suite_id','shown_by_id','leasing_agent_id'] ) ? 'tenant_name' : request()->orderby ) : 'tenant_name';
            
            $order = !in_array(\Str::lower(request()->order), ['desc','asc'])  ? 'asc' 
             : request()->order;

             if($orderBy == 'property_id' ){
                    $orderBy = Property::select('name')
                          ->whereColumn('properties.id', 'leases.property_id');

             }elseif($orderBy == 'tenant_name' ){

                    $orderBy = Tenant::select('name')
                   ->whereColumn('tenants.id', 'leases.tenant_name');

             }elseif($orderBy == 'tenant_use' ){

                    $orderBy = TenantUse::select('name')
                   ->whereColumn('tenant_uses.id', 'leases.tenant_use');

             }elseif($orderBy == 'suite_id' ){
                    $orderBy = Suite::select('name')
                          ->whereColumn('suites.id', 'leases.suite_id');

             }elseif($orderBy == 'shown_by_id' ){
                    $orderBy = User::select('name')
                          ->whereColumn('users.id', 'leases.shown_by_id');

             }elseif($orderBy == 'leasing_agent_id' ){
                    $orderBy = User::select('name')
                          ->whereColumn('users.id', 'leases.leasing_agent_id');
             }elseif($orderBy == 'realtor_id' ){
                    $orderBy = Realtor::select('name')
                             ->whereColumn('realtors.id', 'leases.realtor_id');
             }

        }
         
         $properties = Property::orderBy('name')->get();
         $users      = User::whereNotIn('id',[1])->orderBy('name')->get();
         $showingStatus = ShowingStatus::orderBy('name')->get();
         $leasingStatus = LeasingStatus::orderBy('name')->get();

         $properties = @$properties->filter(function($property){
              $property->label = $property->name;
              $property->value = $property->id;
              return $property;
          });
          $users = @$users->filter(function($user){
              $user->label = $user->name;
              $user->value = $user->id;
              return $user;
          });
          $showingStatus = @$showingStatus->filter(function($showingSt){
              $showingSt->label = $showingSt->name;
              $showingSt->value = $showingSt->id;
              return $showingSt;
          });

          $leasingStatus = @$leasingStatus->filter(function($leasingSt){
              $leasingSt->label = $leasingSt->name;
              $leasingSt->value = $leasingSt->id;
              return $leasingSt;
          });

         $dateArr = Lease::$dateArr;
         $date = request()->date;
         $property = request()->property;
         $suite = request()->suite;
         $shown_by = request()->shown_by;
         $leasing_agent = request()->leasing_agent;
         $leases = $leases->when($property, function ($q) use 
           ($property) {$q->where('property_id',$property);
          })->when($suite, function ($q) use 
           ($suite) {$q->where('suite_id',$suite);
          })->when($shown_by, function ($q) use 
           ($shown_by) {$q->where('shown_by_id',$shown_by);
          })->when($leasing_agent, function ($q) use 
           ($leasing_agent) {$q->where('leasing_agent_id',$leasing_agent);
          })->when($date, function ($q) use 
           ($date) {$q->where('date', '>', now()->subDays($date));
          });
     

          $tenantSuit = @Suite::find($suite);

          if($tenantSuit){
                $tenantSuit->label = ($tenantSuit) ? @$tenantSuit->name : '';
                $tenantSuit->value = ($tenantSuit) ? @$tenantSuit->id : '';
          }
          
          $suitesArr = Suite::where('property_id',$property)->orderBy('name')->get();
         
           $suitesArr = @$suitesArr->filter(function($suite){
              $suite->label = $suite->name;
              $suite->value = $suite->id;
              return $suite;
          });

         $leases = $leases->addSelect(['property' => Property::select('name')
            ->whereColumn('properties.id', 'leases.property_id')
            ->take(1),
            'suite' => Suite::select('name')
            ->whereColumn('suites.id', 'leases.suite_id')
            ->take(1),
            'shown_by' => User::select('name')
            ->whereColumn('users.id', 'leases.shown_by_id')
            ->take(1),
            'leasing_agent' => User::select('name')
            ->whereColumn('users.id', 'leases.leasing_agent_id')
            ->take(1),
            'realtor' => Realtor::select('name')
            ->whereColumn('realtors.id', 'leases.realtor_id')
            ->take(1),
            'tenant_name' => Tenant::select('name')
            ->whereColumn('tenants.id', 'leases.tenant_name')
            ->take(1),
            'tenant_use' => TenantUse::select('name')
            ->whereColumn('tenant_uses.id', 'leases.tenant_use')
            ->take(1)
        ])->orderBy($orderBy,$order)->paginate((new Lease())->perPage); 
      
         return Inertia::render('leases/Index',compact('date','property','suite','shown_by','leasing_agent','dateArr','leases','properties',
          'users','showingStatus','leasingStatus','tenantSuit','suitesArr'));
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
          $properties = Property::orderBy('name')->get();
          $users      = User::whereNotIn('id',[1])->orderBy('name')->get();
          $showingStatus = ShowingStatus::orderBy('name')->get();
          $leasingStatus = LeasingStatus::orderBy('name')->get();
          $tenantUses = TenantUse::orderBy('name')->get();
          $realtors = Realtor::orderBy('name')->get();
          $tenants = Tenant::orderBy('name')->get();

          $properties = @$properties->filter(function($property){
              $property->label = $property->name;
              $property->value = $property->id;
              return $property;
          });
          $users = @$users->filter(function($user){
              $user->label = $user->name;
              $user->value = $user->id;
              return $user;
          });
          $showingStatus = @$showingStatus->filter(function($showingSt){
              $showingSt->label = $showingSt->name;
              $showingSt->value = $showingSt->id;
              return $showingSt;
          });

          $leasingStatus = @$leasingStatus->filter(function($leasingSt){
              $leasingSt->label = $leasingSt->name;
              $leasingSt->value = $leasingSt->id;
              return $leasingSt;
          });

          $tenantUses = @$tenantUses->filter(function($tenantU){
              $tenantU->label = $tenantU->name;
              $tenantU->value = $tenantU->id;
              return $tenantU;
          });
          $realtors = @$realtors->filter(function($realtor){
              $realtor->label = $realtor->name;
              $realtor->value = $realtor->id;
              return $realtor;
          });
          $tenants = @$tenants->filter(function($tenant){
              $tenant->label = $tenant->name;
              $tenant->value = $tenant->id;
              return $tenant;
          });


          return Inertia::render('leases/Create',compact('tenantUses','properties','users',
            'showingStatus','leasingStatus','realtors','tenantUses','tenants'));
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

        $request->merge(['date' => Carbon::parse($request->date)->format('Y-m-d')]);
        $request->merge(['showing_date' => Carbon::parse($request->showing_date)->format('Y-m-d')]);
        
        $data = $request->except('_token');

        $lease = Lease::create($data);


        if($request->hasFile('file') && $request->file('file')->isValid()){
            //$lease->addMediaFromRequest('file')->toMediaCollection('file');
        }


       return redirect('leases')->with('message', 'Lease Created Successfully!');
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

         $lease = Lease::find($id);

         $properties = Property::orderBy('name')->get();

          $users      = User::whereNotIn('id',[1])->orderBy('name')->get();
          $showingStatus = ShowingStatus::orderBy('name')->get();
          $leasingStatus = LeasingStatus::orderBy('name')->get();
          $tenantUses = TenantUse::orderBy('name')->get();
          $realtors = Realtor::orderBy('name')->get();
          $tenants = Tenant::orderBy('name')->get();

          $properties = @$properties->filter(function($property){
              $property->label = $property->name;
              $property->value = $property->id;
              return $property;
          });
          $users = @$users->filter(function($user){
              $user->label = $user->name;
              $user->value = $user->id;
              return $user;
          });
          $showingStatus = @$showingStatus->filter(function($showingSt){
              $showingSt->label = $showingSt->name;
              $showingSt->value = $showingSt->id;
              return $showingSt;
          });

          $leasingStatus = @$leasingStatus->filter(function($leasingSt){
              $leasingSt->label = $leasingSt->name;
              $leasingSt->value = $leasingSt->id;
              return $leasingSt;
          });

          $tenantUses = @$tenantUses->filter(function($tenantU){
              $tenantU->label = $tenantU->name;
              $tenantU->value = $tenantU->id;
              return $tenantU;
          });
          $realtors = @$realtors->filter(function($realtor){
              $realtor->label = $realtor->name;
              $realtor->value = $realtor->id;
              return $realtor;
          });
          $tenants = @$tenants->filter(function($tenant){
              $tenant->label = $tenant->name;
              $tenant->value = $tenant->id;
              return $tenant;
          });

          $tenantSuit = @$lease->suite;

          if($tenantSuit){
                $tenantSuit->label = ($tenantSuit) ? @$tenantSuit->name : '';
                $tenantSuit->value = ($tenantSuit) ? @$tenantSuit->id : '';
          }
          // $lease->media =  @$lease->getMediaPath();
              
         return Inertia::render('leases/Edit',compact('realtors','tenantSuit','lease','properties','users','showingStatus','leasingStatus','tenantUses','tenants'));
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
        
        $request->merge(['date' => Carbon::parse($request->date)->format('Y-m-d')]);
        $request->merge(['showing_date' => Carbon::parse($request->showing_date)->format('Y-m-d')]);
        
        $data = $request->except('_token');
        
        $lease = TenantProspect::find($id);

         if(!$lease){
            return redirect()->back();
         }
          
        $lease->update($data);

        if($request->hasFile('file') && $request->file('file')->isValid()){
            // $lease->docType(DocumentType::TENANT_PROSPECT)->toPath(TenantProspect::TENANT_PROSPECT_PATH)->storeFile('file');
        }

          
        return redirect('tenant-prospects')->with('message', 'Tenant Prospect Updated Successfully!');
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
         Lease::find($id)->delete();

        return redirect()->back()->with('message', 'Lease Deleted Successfully!');
    }

    public function downloadPDF($id,$view = false){

        $leases = Lease::all();

        $pdf = PDF::loadView('leases.pdf',
          ['leases' => $leases]
        );
         
       // $view = true; 
        if($view){
        // return $pdf->stream('tenant_prospects.pdf');
         return $pdf->setPaper('a4')->output();
        }
        return $pdf->download('leases.pdf');
    }

}