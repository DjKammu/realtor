<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Realtor extends Model
{
    use HasFactory;

     protected $fillable = [
        'name', 'address', 'company', 'phone_number', 'emaill',
        'tenant_use_id'
    ];


    public function tenant_use(){
      return $this->belongsTo(TenantUse::class);
    }

}
