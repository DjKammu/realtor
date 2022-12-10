<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TenantProspect extends Model
{
    use HasFactory;

    protected $fillable = [
        'date', 'showing_date', 'property_id', 'suite_id',
        'tenant_name', 'tenant_use', 'showing_status_id', 
        'leasing_status_id','shown_by_id', 
        'leasing_agent_id', 'notes'
    ];


    public function suite(){
    	return $this->belongsTo(Suite::class);
    }
}
