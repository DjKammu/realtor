<?php
namespace App\Http\Traits;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\DocumentType;
use DB;

trait MediaManager {
     
    public function storeFile($input, $multiple = false){
    	 $fileArr = request()->{$input};
    	 if(!$multiple){
    	 	$mimeType =  $fileArr->getClientMimeType();
    	 	$name = pathinfo($fileArr)['filename'].'_'.time();
    	 	$fileName = $name.'.'. $fileArr->getClientOriginalExtension();
    	    $fileArr->storeAs($this->path, $fileName, 'media');
            $this->fileName = $fileName; 
            $this->mimeType = $mimeType; 
            $this->name = $name; 
    	    $this->saveMedia();
    	 }
    	return true;

    } 

    public function saveMedia() {
        $class = get_class($this);
        $data['model_type'] = $class;
        $data['model_id']   = $this->id;
        $data['file_name']  = $this->fileName;
        $data['mime_type']  = $this->mimeType;
        $data['doc_type']   = $this->docType;
        $data['name'] = $this->name;
        $data['path'] = $this->path;
        DB::table('media')->insert($data);
         
        return true; 
    }
    
    public function allMedia(){
         $files = DB::table('media')
              ->where(['model_type' => get_class($this),
                'model_id' => $this->id])
             ->get();    
          return $files;   
    }
    public function getMedia(){
         $files = $this->allMedia();
        
          $files = @$files->filter(function($file){
              $file->path = $this->getFullPath($file);
              return $file;
          });      
    	return ($files->count() == 1) ? $files->first() : ($files->count() == 0 ? null : $files) ;  
    }

    public function getMediaPath(){
      $files =  $this->allMedia();
    
  	 $files = @$files->map(function($file){
          return $file->path = $this->getFullPath($file);
      }); 

	 return ($files->count() == 1) ? $files->first() : ($files->count() == 0 ? null : $files) ;  
    }

    public function getFullPath($file){
    	return ($file) ?  asset($file->path.'/'.$file->file_name) : null;
    }

    public function toPath($path){

    	   if(!\File::exists(public_path().$path)) {
    			  \File::makeDirectory(public_path().'/'.$path, $mode = 0777, true, true);
    			}
           $this->path = $path; 
    	   return $this;
    }

    public function docType($type){
        $docType = null;
        if($type){
        	$docType = DocumentType::firstOrCreate(
			    ['name' => $type],
			    ['account_number' => DocumentType::max('account_number') + 100 , 
			      'slug' => \Str::slug($type)]
			);
			$docType = $docType->id;
        }
    
    	$this->docType = $docType;
       return $this;

    }


}