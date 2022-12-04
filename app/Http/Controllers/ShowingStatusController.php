<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShowingStatus;
use Inertia\Inertia;
use Gate;


class ShowingStatusController extends Controller
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

         $statuses = ShowingStatus::query();

         $orderBy = 'name';  
         $order ='asc' ;
         
         if(request()->filled('orderby')){
            $orderBy = request()->filled('orderby') ? ( !in_array(request()->orderby, 
                ['account_number','name'] ) ? 'name' : request()->orderby ) : 'name';
            
            $order = !in_array(\Str::lower(request()->order), ['desc','asc'])  ? 'asc' 
             : request()->order;
        }
        
         $statuses = $statuses->orderBy($orderBy,$order)->paginate((new ShowingStatus())->perPage); 

         return Inertia::render('showing_statuses/Index',['statuses' => $statuses]);
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

          return Inertia::render('showing_statuses/Create');
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
              'name' => 'required|unique:showing_statuses',
              'account_number' => 'required|unique:showing_statuses',
        ]);

        $data['slug'] = \Str::slug($request->name);

        ShowingStatus::create($data);

       return redirect('showing-status')->with('message', 'Showing Status Created Successfully!');
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

         $status = ShowingStatus::find($id);

         return Inertia::render('showing_statuses/Edit',compact('status'));
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
              'name' => 'required|unique:showing_statuses,name,'.$id,
              'account_number' => 'required|unique:showing_statuses,account_number,'.$id,
        ]);

        $data['slug'] = \Str::slug($request->name);

        $status = ShowingStatus::find($id);

         if(!$status){
            return redirect()->back();
         }
          
        $status->update($data);
          
        return redirect('showing-status')->with('message', 'Showing Status Updated Successfully!');
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
         ShowingStatus::find($id)->delete();

        return redirect()->back()->with('message', 'Showing Status Deleted Successfully!');
    }
}
