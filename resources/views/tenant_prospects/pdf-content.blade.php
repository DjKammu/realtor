
<div class="table-responsive table-payments">
       
       <table id="project-types-table" class="table table-hover text-center payments-table">
            <thead>
            <tr class="text-danger">
                 <th >Date </th>
                 <th >SD</th>
                 <th >Property</th>
                 <th >Suite</th>
                 <th >TN</th>
                 <th >TU</th>
                 <th >SB</th>
                 <th >LA</th>
                 <th >Notes</th>

            </tr>
            </thead>
            <tbody>
              @foreach($tenant_prospects as $prospect)

             <tr>
               <td> {{ @$prospect->date }}</td>
               <td> {{ @$prospect->showing_date }}</td>
               <td> {{ @$prospect->suite->name }}</td>
               <td> {{ @$prospect->property->name }}</td>
               <td> {{ @$prospect->tenant_name }}</td>
               <td> {{ @$prospect->tenant_use }}</td>
               <td> {{ @$prospect->shown_by->name }}</td>
               <td> {{ @$prospect->leasing_agent->name }}</td>
               <td> {{ @$prospect->notes }}</td>
          
             </tr> 
             @endforeach
            <!-- Project Types Go Here -->
            </tbody>
        </table>

</div>