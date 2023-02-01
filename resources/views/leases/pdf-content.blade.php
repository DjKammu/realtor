
<div class="table-responsive table-payments">
       
       <table id="project-types-table" class="table table-hover text-center payments-table">
            <thead>
            <tr class="text-danger">
                 
                 <th >Property</th>
                 <th >Suite</th>
                 <th >Tenant</th>
                 <th >Start Date </th>
                 <th >End Date</th>
                 <th >Notes</th>

            </tr>
            </thead>
            <tbody>
              @foreach($leases as $lease)

             <tr>
              
               <td> {{ @$lease->suite->name }}</td>
               <td> {{ @$lease->property->name }}</td>
               <td> {{ @$lease->tenant->name }}</td>
                <td> {{ @$lease->date }}</td>
               <td> {{ @$lease->showing_date }}</td>
               <td> {{ @$lease->notes }}</td>
          
             </tr> 
             @endforeach
            <!-- Project Types Go Here -->
            </tbody>
        </table>

</div>