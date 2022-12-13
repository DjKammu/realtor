<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;
use App\Models\Suite;
use Inertia\Inertia;
use Gate;
use Carbon\Carbon;


class SuiteController extends Controller
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

         $suites = Suite::select('*');

         $orderBy = 'name';  
         $order ='asc' ;
         
         if(request()->filled('orderby')){
            $orderBy = request()->filled('orderby') ? ( !in_array(request()->orderby, 
                ['account_number','name' ,'property_id'] ) ? 'name' : request()->orderby ) : 'name';
            
            $order = !in_array(\Str::lower(request()->order), ['desc','asc'])  ? 'asc' 
             : request()->order;

             if($orderBy == 'property_id' ){
                    $suites->rightjoin('properties', 'properties.id', '=', 'suites.property_id');
                    $orderBy = 'properties.name';
             }
        }

         $suites = $suites->addSelect(['property' => Property::select('name')
            ->whereColumn('properties.id', 'suites.property_id')
            ->take(1)
        ])->orderBy($orderBy,$order)->paginate((new Suite())->perPage); 
      

         return Inertia::render('suites/Index',['suites' => $suites]);
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

          $properties = @$properties->filter(function($property){
              $property->label = $property->name;
              $property->value = $property->id;
              return $property;
          });

          return Inertia::render('suites/Create',compact('properties'));
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
              'name' => 'required|unique:suites',
              'account_number' => 'required|unique:suites',
        ]);

        $data['slug'] = \Str::slug($request->name);

        Suite::create($data);

       return redirect('suites')->with('message', 'Suite Created Successfully!');
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

         $suite = Suite::find($id);

         $properties = Property::orderBy('name')->get();

          $properties = @$properties->filter(function($property){
              $property->label = $property->name;
              $property->value = $property->id;
              return $property;
          });

         return Inertia::render('suites/Edit',compact('suite','properties'));
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
              'name' => 'required|unique:suites,name,'.$id,
              'account_number' => 'required|unique:suites,account_number,'.$id,
        ]);

        $data['slug'] = \Str::slug($request->name);

        $suite = Suite::find($id);

         if(!$suite){
            return redirect()->back();
         }
          
        $suite->update($data);
          
        return redirect('suites')->with('message', 'Suite Updated Successfully!');
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
         Suite::find($id)->delete();

        return redirect()->back()->with('message', 'Suite Deleted Successfully!');
    }

    public function getSuites(Request $request){

        if(Gate::denies('edit')) {
               return abort('401');
        } 

        $id = $request->id;
        $suites = Suite::wherePropertyId($id)->get();

        $suites = @$suites->filter(function($suite){
              $suite->label = $suite->name;
              $suite->value = $suite->id;
              return $suite;
          });

        return \Response::json(
         ['success' => 1,
         'data'    => $suites]
        );
    }
}
