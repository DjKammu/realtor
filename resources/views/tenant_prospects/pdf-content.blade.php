
<div class="table-responsive table-payments">
       
       <table id="project-types-table" class="table table-hover text-center payments-table">
            <thead>
            <tr class="text-danger">
                 <th >Date </th>
                 <th >Showing Date</th>
                 <th >Property</th>
                 <th >Name </th>
                 <th >Tenant Use</th>

            </tr>
            </thead>
            <tbody>
              @foreach($tenant_prospects as $prospect)

             <tr>
               <td> {{ @$prospect->date }}</td>
               <td> {{ @$prospect->showing_date }}</td>
               <td> {{ @$prospect->property->name }}</td>
               <td> {{ @$prospect->tenant_name }}</td>
               <td> {{ @$prospect->tenant_use }}</td>
          
             </tr> 
             @endforeach
            <!-- Project Types Go Here -->
            </tbody>
        </table>

</div>