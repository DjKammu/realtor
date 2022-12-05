<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suite extends Model
{
    use HasFactory;

      protected $fillable = [
        'name', 'slug', 'account_number','property_id'
    ];

    public function property(){
    	return $this->belongsTo(Property::class);
    }
}
