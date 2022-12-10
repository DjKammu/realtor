<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTenantProspectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tenant_prospects', function (Blueprint $table) {
            $table->id();
             $table->date('date')->reuired();
             $table->date('showing_date')->nullable();
             $table->unsignedBigInteger('property_id')->nullable();
             $table->unsignedBigInteger('suite_id')->nullable();
             $table->string('tenant_name')->nullable();
             $table->string('tenant_use')->nullable();
             $table->unsignedBigInteger('showing_status_id')->nullable();
             $table->unsignedBigInteger('leasing_status_id')->nullable();
             $table->unsignedBigInteger('shown_by_id')->nullable();
             $table->unsignedBigInteger('leasing_agent_id')->nullable();
             $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tenant_prospects');
    }
}
