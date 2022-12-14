<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMediaTable extends Migration
{
    public function up()
    {
        Schema::create('media', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->morphs('model');
            $table->string('name');
            $table->string('file_name');
            $table->string('mime_type')->nullable();
            $table->string('path');
            $table->unsignedInteger('doc_type')->nullable();
            $table->nullableTimestamps();
        });
    }
}
