
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
              @foreach($leases as $lease)

             <tr>
               <td> {{ @$lease->date }}</td>
               <td> {{ @$lease->showing_date }}</td>
               <td> {{ @$lease->suite->name }}</td>
               <td> {{ @$lease->property->name }}</td>
               <td> {{ @$lease->tenant_name }}</td>
               <td> {{ @$lease->tenant_use }}</td>
               <td> {{ @$lease->shown_by->name }}</td>
               <td> {{ @$lease->leasing_agent->name }}</td>
               <td> {{ @$lease->notes }}</td>
          
             </tr> 
             @endforeach
            <!-- Project Types Go Here -->
            </tbody>
        </table>

</div>