import React , { useState } from 'react';
import Layout from '../../layouts/Layout';
import {Inertia} from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'
import { sortOrderBy } from '@/hooks/constants';
import Pagination from '@/Pagination';
import Select from 'react-select';

const Index = (props) => {
      
      let { realtors , tenantUses, s } = usePage().props  
      let propertyNullArr = [{'label' : 'Select Property' , 'value' : null}];
      let shownByNullArr = [{'label' : 'Select Shown By' , 'value' : null}];
      let leasingAgentNullArr = [{'label' : 'Select Leasing Agent' , 'value' : null}];
      let suitNullArr = [{'label' : 'Select Suite' , 'value' : null}];


      const [form, setForm] = useState({
              s: s
            })

      const deleteFunc = (e) => {
        e.preventDefault()
        
        if(!confirm('Are you sure?')){
          return;
        }

        const id = e.target.id;
        Inertia.post('/realtors/'+id, {
            _method: 'delete',
            preserveScroll: true,
          },{
            onError: () => id.current.focus(),
          })
      }


    const handleSubmit = e => {
              e.preventDefault()
              Inertia.get('/realtors', {
                  s: form.s
              })
    }

    const handleChange = e =>   {
      const key = e.target.id;
      const value = e.target.value;
      setForm(form => ({
          ...form,
          [key]: value,
      }));
    }
      
    return (
        <div>
            <Layout>
                {/* check app.css for related css */}
                <div className="header">
                    <h1 className="header-text">Realtors</h1>
                </div>
                       <div className="">
                           <div className="p-6 bg-white border-b border-gray-200">
                            <InertiaLink href="/realtors/create" className="p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                            Create Realtor
                            </InertiaLink>

                            </div>
                             <div className="flex items-center"> 

                                <input type="text" id="s" placeholder="Realtor Name"
                                value={form.s}
                                onChange={handleChange}
                                className="px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"/>
        
                                   <div className="flex border border-purple-200 rounded">
                                    
                                    <button onClick={handleSubmit} className="block w-full px-4 py-2 text-white bg-black border-l rounded ">
                                        Search
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                   
                                    <table className="table-fixed w-full">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                
                                                <th className="px-4 py-2">Name
                                                 <i onClick={sortOrderBy('name', 'asc')} 
                                                className="fa fa-sort-asc"></i>
                                                <i onClick={sortOrderBy('name', 'desc')}  
                                                className="fa fa-sort-desc"></i>
                                                </th>
                                                <th className="px-4 py-2">Company</th>
                                                <th className="px-4 py-2">Address</th>
                                                <th className="px-4 py-2">Phone Number</th>
                                                <th className="px-4 py-2 w-1/4">Emaill</th>
                                                <th className="px-4 py-2">Tenant Use</th>
                                              
                                                <th className="px-4 py-2">Edit</th>
                                                <th className="px-4 py-2">Delete</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {realtors.data.map((realtor,key) => (
                                                <tr key={key}>
                                                    <td className="border px-4 py-2">{ realtor.name }</td>
                                                    <td className="border px-4 py-2">{ realtor.company }</td>
                                                    <td className="border px-4 py-2">{ realtor.address }</td>
                                                    <td className="border px-4 py-2">{ realtor.phone_number }</td>
                                                    <td className="border px-4 py-2 w-auto">{ realtor.emaill }</td>
                                                    <td className="border px-4 py-2">
                                                    <InertiaLink href={`/tenant-uses/${realtor.tenant_use_id}`} >
                                                        { realtor.tenant_use }
                                                        </InertiaLink> 
                                                    </td>
                                                    
                                                    <td className="border px-4 py-2">        
                                                        <InertiaLink href={`/realtors/${realtor.id}`} >
                                                        <i className="fa fa-edit text-success"></i>
                                                        </InertiaLink> 
                                                      </td>
                                                      <td className="border px-4 py-2">
                                                        <form onSubmit={deleteFunc} id={realtor.id}>
                                                              <button
                                                                className="flex items-center px-3 py-1 text-sm font-medium text-indigo-500 hover:text-indigo-600"
                                                                type="submit"
                                                              >
                                                              <i className="fa fa-trash text-danger"></i>
                                                              </button>
                                                        </form>
                                                       </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <Pagination class="mt-6" links={realtors.links} />
          
                                </div>
                            </div>
                        </div> 
            </Layout>
        </div>
    )
}

export default Index
