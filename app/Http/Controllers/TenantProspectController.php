<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShowingStatus;
use App\Models\LeasingStatus;
use App\Models\Property;
use App\Models\TenantProspect;
use App\Models\Suite;
use App\Models\User;
use Inertia\Inertia;
use Gate;
use Carbon\Carbon;

class TenantProspectController extends Controller
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

         $tenantProspects = TenantProspect::query();

         $orderBy = 'tenant_name';  
         $order ='asc' ;
         
         if(request()->filled('orderby')){
            $orderBy = request()->filled('orderby') ? ( !in_array(request()->orderby, 
                ['tenant_use','tenant_name','date','showing_date'] ) ? 'tenant_name' : request()->orderby ) : 'tenant_name';
            
            $order = !in_array(\Str::lower(request()->order), ['desc','asc'])  ? 'asc' 
             : request()->order;
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

         $dateArr = TenantProspect::$dateArr;
         $date = request()->date;
         $property = request()->property;
         $suite = request()->suite;
         $shown_by = request()->shown_by;
         $leasing_agent = request()->leasing_agent;
         $tenantProspects = $tenantProspects->when($property, function ($q) use 
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
      

         $tenantProspects = $tenantProspects->orderBy($orderBy,$order)->paginate((new TenantProspect())->perPage); 

         return Inertia::render('tenant_prospects/Index',compact('date','property','suite','shown_by','leasing_agent','dateArr','tenantProspects','properties',
          'users','showingStatus','leasingStatus','tenantSuit'));
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

          return Inertia::render('tenant_prospects/Create',compact('properties','users',
            'showingStatus','leasingStatus'));
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

        TenantProspect::create($data);

       return redirect('tenant-prospects')->with('message', 'TenantProspect Created Successfully!');
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

         $tenantProspect = TenantProspect::find($id);

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

          $tenantSuit = @$tenantProspect->suite;
          $tenantSuit->label = @$tenantSuit->name;
          $tenantSuit->value = @$tenantSuit->id;
        

         return Inertia::render('tenant_prospects/Edit',compact('tenantSuit','tenantProspect','properties','users',
            'showingStatus','leasingStatus'));
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
        
        $tenantProspect = TenantProspect::find($id);

         if(!$tenantProspect){
            return redirect()->back();
         }
          
        $tenantProspect->update($data);
          
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
         TenantProspect::find($id)->delete();

        return redirect()->back()->with('message', 'Tenant Prospect Deleted Successfully!');
    }
}
