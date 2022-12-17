<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Models\Property;
use App\Models\User;
use App\Models\Role;
use Inertia\Inertia;
use Gate;

class UserController extends Controller
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

         $users = User::paginate((new User())->perPage); 
         return Inertia::render('users/Index',['users' => $users]);
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
        
        $data = $request->except('_token');


        $request->validate([
              'name' => 'required|string',
               'email' => [
                    'required',
                    'string',
                    'email',
                    Rule::unique(User::class),
                ],
                'password' => $this->passwordRules()
        ]);


        $user =  User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
        
        $user->roles()->sync($data['role']); 
        $user->properties()->sync($data['properties']); 

       return redirect('users')->with('message', 'User Created Successfully!');
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

        //  if(Gate::denies('update')) {
        //        return abort('401');
        // } 

        $data = $request->except(['_token','password','password_confirmation']);
    
        $request->validate([
              'name' => 'required|max:255',
              'email' => 'required|email|max:255|unique:users,id,:id',
              'password' => 'nullable|sometimes|min:6|confirmed|required_with:password'
        ]);
       
        ($request->filled('password')) ? $data['password'] = \Hash::make($request->password) 
        : '';

         $user = User::find($id);

         if(!$user){
            return redirect()->back();
         }
          
        $user->update($data);

        $user->roles()->sync($data['role']);
        $user->properties()->sync($data['properties']); 
       
        return redirect('users')->with('message', 'User Updated Successfully!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
         // if(Gate::denies('delete')) {
         //       return abort('401');
         //  } 
         User::find($id)->delete();

        return redirect()->back()->with('message', 'User Deleted Successfully!');
    }
}
