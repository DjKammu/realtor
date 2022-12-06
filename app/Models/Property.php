<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

      protected $fillable = [
        'name', 'slug', 'account_number'
    ];
     
    public function users()
    {
        return $this->belongsToMany(User::class, 'property_users')->withTimestamps();
    }
}
