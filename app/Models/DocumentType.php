<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentType extends Model
{
    use HasFactory;

    CONST SHOWING_NOTE     = 'Showing Note';
   

    protected $perPage = 20;

    protected $fillable = [
     'name' , 'slug' ,'account_number'
    ];

    public static $notEditable = [
      self::SHOWING_NOTE
    ];

     public function documents(){
    	return $this->hasMany(Document::class);
    }
}
