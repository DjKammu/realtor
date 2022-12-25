<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Models\FavouriteUrl;
use App\Models\User;
use App\Models\Role;
use Inertia\Inertia;
use Gate;
use Auth;

class FavouriteUrlController extends Controller
{
    use \App\Actions\Fortify\PasswordValidationRules;

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
         //  if(Gate::denies('view')) {
         //       return abort('401');
         // }

         $user = Auth::user();

         $status = 1;
        
         $favourites =  FavouriteUrl::where(function($q){
              $q->where('user_id', auth()->user()->id); 
              $q->where('status',1); 
          })->orderBy('label','asc')
          ->paginate((new FavouriteUrl())->perPage); 

         return Inertia::render('favourites/Index',['favourites' => $favourites]);
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

          $properties = Property::orderBy('name')->get();

          $properties = @$properties->filter(function($property){
              $property->label = $property->name;
              $property->value = $property->id;
              return $property;
          });

          $roles = Role::orderBy('name')->get();

          $roles = @$roles->filter(function($role){
              $role->label = $role->name;
              $role->value = $role->id;
              return $role;
          });

          return Inertia::render('users/Create',compact('properties','roles'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

       $user = \Auth::user();

       $status = ($request->checked == 'true' ) ? 1 : 0;

        FavouriteUrl::updateOrCreate(
            ['url' =>$request->url, 'user_id' => $user->id],
            ['url' =>$request->url, 'user_id' => $user->id,'status' => (int) $status,
            'label' => $request->name]
        );
       
      $msg  = 'Favourite URL '.( $status == 1 ? "Added" : "Removed").' Successfully!';

      return response()->json(
           [
            'status' => 200,
            'message' => $msg
           ]
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
         // if(Gate::denies('edit')) {
         //       return abort('401');
         //  } 
         if($id == auth()->id()){
              return redirect('/profile');
         }

         $user = User::find($id);

         $properties = Property::orderBy('name')->get();
         $properties = @$properties->filter(function($property){
              $property->label = $property->name;
              $property->value = $property->id;
              return $property;
          });

          $roles = Role::orderBy('name')->get();

          $roles = @$roles->filter(function($role){
              $role->label = $role->name;
              $role->value = $role->id;
              return $role;
          });

          $user->role = ($user->roles()->exists()) ? $user->roles()->first()->id : null;
          $user->properties = ($user->properties()->exists()) ? $user->properties()->pluck('properties.id') : null;

         return Inertia::render('users/Edit',compact('user','roles','properties'));
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
       
      $user = Auth::user();

      $url  = FavouriteUrl::where(['id' => $id, 'user_id' => $user->id]);
        
      $return = redirect()->back();
        
      if($url->exists()){
        $url->update(['label' => $request->label ]);
        $return = redirect()->back()->with('message', 'Favourite URL Updated Successfully!');
      }else{
       $return = redirect()->back()->withErrors('URL Can`t be Updated!');
      }
     
      return $return;

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
          $user = Auth::user();

           $url  = FavouriteUrl::where(['id' => $id, 'user_id' => $user->id]);
          
          $return = redirect()->back();
          
          if($url->exists()){
           $url->delete();
            $return = redirect()->back()->with('message', 'Favourite URL Deleted Successfully!');
          }else{
           $return = redirect()->back()->withErrors('URL Can`t be Deleted!');
          }
         
          return $return;
    }


     public function favourites(Request $request){

       $user = Auth::user();

       $status = 1;
      
       $favourites =  FavouriteUrl::where(function($q){
            $q->where('user_id', auth()->user()->id); 
            $q->where('status',1); 
        })->get();

      return view('favourites',compact('favourites'));

    }


    public function makeFavourite(Request $request){
      
       $user = Auth::user();

       $status = ($request->status == 'true' ) ? 1 : 0;
      
        FavouriteUrl::updateOrCreate(
            ['url' =>$request->url, 'user_id' => $user->id],
            ['url' =>$request->url, 'user_id' => $user->id,'status' => (int) $status,
            'label' => $request->label]
        );

        return redirect($request->url)->with('message', 'Favourite URL '.( $status == 1 ? "Added" : "Removed").' Successfully!');

    }

    public function deleteFavourite (Request $request,$id){
      
       $user = Auth::user();

       $url  = FavouriteUrl::where(['id' => $id, 'user_id' => $user->id]);
        
      $return = redirect()->back();
        
      if($url->exists()){
       $url->delete();
        $return = redirect()->back()->with('message', 'Favourite URL Deleted Successfully!');
      }else{
       $return = redirect()->back()->withErrors('URL Can`t be Deleted!');
      }
     
      return $return;

    }

     public function updateFavourite(Request $request,$id){
      
       $user = Auth::user();

       $url  = FavouriteUrl::where(['id' => $id, 'user_id' => $user->id]);
        
      $return = redirect()->back();
        
      if($url->exists()){
        $url->update(['label' => $request->label ]);
        $return = redirect()->back()->with('message', 'Favourite URL Updated Successfully!');
      }else{
       $return = redirect()->back()->withErrors('URL Can`t be Updated!');
      }
     
      return $return;

    }

     public function getFavourite(Request $request){

       $user = \Auth::user();

       $url = $request->url;

       $favourite =  FavouriteUrl::where(function($q) use ($url){
            $q->where('user_id', auth()->user()->id); 
            $q->where('url',$url); 
        })->select('status','label')->first();

         return response()->json(
           [
            'status' => 200,
            'data' => $favourite
           ]
        );
        
    }

}
