<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Http\Traits\MediaManager;

class TenantProspect extends Model 
{
    use HasFactory, MediaManager;

    CONST TENANT_PROSPECT_PATH  = 'tenant_prospects';

    protected $fillable = [
        'date', 'showing_date', 'property_id', 'suite_id',
        'tenant_name', 'tenant_use', 'showing_status_id', 
        'leasing_status_id','shown_by_id', 
        'leasing_agent_id', 'notes','realtor_id'
    ];


    public function suite(){
    	return $this->belongsTo(Suite::class);
    }

    public function property(){
      return $this->belongsTo(Property::class);
    }

    public static $dateArr = [
      ['label' => 'Select Date' , 'value' => null],
      ['label' => '1 Week' , 'value' => 7],
      ['label' => '2 Week' , 'value' => 14],
      ['label' => '3 Week' , 'value' => 21],
      ['label' => '4 Week' , 'value' => 28],
      ['label' => '5 Week' , 'value' => 35],
      ['label' => '6 Week' , 'value' => 42],
      ['label' => '2 Months' , 'value' => 60],
      ['label' => '3 Months' , 'value' => 90],
      ['label' => '4 Months' , 'value' => 120],
      ['label' => '5 Months' , 'value' => 150],
      ['label' => '6 Months' , 'value' => 180],
      ['label' => '1 Year' , 'value' => 365],
      ['label' => '2 Year' , 'value' => 730],
      ['label' => '3 Year' , 'value' => 1095],
      ['label' => '4 Year' , 'value' => 1460],
      ['label' => 'All Dates' , 'value' => null]
    ];

}
