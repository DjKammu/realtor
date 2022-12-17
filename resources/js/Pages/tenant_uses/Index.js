import React from 'react';
import Layout from '../../layouts/Layout';
import {Inertia} from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'
import { sortOrderBy } from '@/hooks/constants';
import Pagination from '@/Pagination';

const Index = (props) => {
      const deleteFunc = (e) => {
        e.preventDefault()
        
        if(!confirm('Are you sure?')){
          return;
        }

        const id = e.target.id;
        Inertia.post('/tenant-uses/'+id, {
            _method: 'delete',
            preserveScroll: true,
          },{
            onError: () => id.current.focus(),
          })
      }
     
 

     const { tenantUses } = usePage().props  

    return (
        <div>
            <Layout>
                {/* check app.css for related css */}
                <div className="header">
                    <h1 className="header-text">Tenant Uses</h1>
                </div>
                       <div className="">
                           <div className="p-6 bg-white border-b border-gray-200">
                            <InertiaLink href="/tenant-uses/create" className="p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                            Create Tenant Use
                            </InertiaLink>
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
                                                <th className="px-4 py-2">Edit</th>
                                                <th className="px-4 py-2">Delete</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tenantUses.data.map((tenantUse,key) => (
                                                <tr key={key}>
                                                    <td className="border px-4 py-2">{ tenantUse.name }</td>
                                                    <td className="border px-4 py-2">        
                                                        <InertiaLink href={`/tenant-uses/${tenantUse.id}`} >
                                                        <i className="fa fa-edit text-success"></i>
                                                        </InertiaLink> 
                                                      </td>
                                                      <td className="border px-4 py-2">
                                                        <form onSubmit={deleteFunc} id={tenantUse.id}>
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

                                    <Pagination class="mt-6" links={tenantUses.links} />
          
                                </div>
                            </div>
                        </div> 
            </Layout>
        </div>
    )
}

export default Index
