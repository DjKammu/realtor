<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentType extends Model
{
    use HasFactory;

    CONST SHOWING_NOTE     = 'Showing Note';
    CONST TENANT_PROSPECT  = 'Tenant Prospect';


    protected $perPage = 20;

    protected $fillable = [
     'name' , 'slug' ,'account_number'
    ];

    public static $notEditable = [
      self::SHOWING_NOTE , self::TENANT_PROSPECT
    ];

     public function documents(){
    	return $this->hasMany(Document::class);
    }
}
