<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeasingStatus;
use Inertia\Inertia;
use Gate;


class LeasingStatusController extends Controller
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

         $statuses = LeasingStatus::query();

         $orderBy = 'name';  
         $order ='asc' ;
         
         if(request()->filled('orderby')){
            $orderBy = request()->filled('orderby') ? ( !in_array(request()->orderby, 
                ['account_number','name'] ) ? 'name' : request()->orderby ) : 'name';
            
            $order = !in_array(\Str::lower(request()->order), ['desc','asc'])  ? 'asc' 
             : request()->order;
        }
        
         $statuses = $statuses->orderBy($orderBy,$order)->paginate((new LeasingStatus())->perPage); 

         return Inertia::render('leasing_statuses/Index',['statuses' => $statuses]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // if(Gate::denies('add')) {
        //        return abort('401');
        // } 

          return Inertia::render('leasing_statuses/Create');
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
              'name' => 'required|unique:leasing_statuses',
              'account_number' => 'required|unique:leasing_statuses',
        ]);

        $data['slug'] = \Str::slug($request->name);

        LeasingStatus::create($data);

       return redirect('leasing-status')->with('message', 'Leasing Status Created Successfully!');
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

         $status = LeasingStatus::find($id);

         return Inertia::render('leasing_statuses/Edit',compact('status'));
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
              'name' => 'required|unique:leasing_statuses,name,'.$id,
              'account_number' => 'required|unique:leasing_statuses,account_number,'.$id,
        ]);

        $data['slug'] = \Str::slug($request->name);

        $status = LeasingStatus::find($id);

         if(!$status){
            return redirect()->back();
         }
          
        $status->update($data);
          
        return redirect('leasing-status')->with('message', 'Leasing Status Updated Successfully!');
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
         LeasingStatus::find($id)->delete();

        return redirect()->back()->with('message', 'Leasing Status Deleted Successfully!');
    }
}
