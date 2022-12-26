<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;
use Inertia\Inertia;
use Gate;


class PropertyController extends Controller
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

         $properties = Property::query();

         $orderBy = 'name';  
         $order ='asc' ;
         
         if(request()->filled('orderby')){
            $orderBy = request()->filled('orderby') ? ( !in_array(request()->orderby, 
                ['account_number','name'] ) ? 'name' : request()->orderby ) : 'name';
            
            $order = !in_array(\Str::lower(request()->order), ['desc','asc'])  ? 'asc' 
             : request()->order;
        }
        
         $properties = $properties->orderBy($orderBy,$order)->paginate((new Property())->perPage); 

         return Inertia::render('properties/Index',['properties' => $properties]);
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

          return Inertia::render('properties/Create');
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
              'name' => 'required|unique:properties',
              'account_number' => 'required|unique:properties',
        ]);

        $data['slug'] = \Str::slug($request->name);

        Property::create($data);

       return redirect('properties')->with('message', 'Property Created Successfully!');
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

         $property = Property::find($id);

         return Inertia::render('properties/Edit',compact('property'));
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
              'name' => 'required|unique:properties,name,'.$id,
              'account_number' => 'required|unique:properties,account_number,'.$id,
        ]);

        $data['slug'] = \Str::slug($request->name);

        $property = Property::find($id);

         if(!$property){
            return redirect()->back();
         }
          
        $property->update($data);
          
        return redirect('properties')->with('message', 'Property Updated Successfully!');
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
         Property::find($id)->delete();

        return redirect()->back()->with('message', 'Property Deleted Successfully!');
    }

  public function quickAdd(Request $request)
    {
         if(Gate::denies('add')) {
               return abort('401');
        } 

        $data = $request->except('_token');

        $request->validate([
              'name' => 'required|unique:properties'
        ]);

        $data['slug'] = \Str::slug($request->name);

        Property::create($data);

        return redirect()->back()->with('message', 'Property Added Successfully!');
    }


}
