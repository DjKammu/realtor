import React from 'react';
import Layout from '../../layouts/Layout';
import {Inertia} from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'

const Index = (props) => {
      const deleteFunc = (e) => {
      e.preventDefault()
      
      if(!confirm('Are you sure?')){
        return;
      }

      const id = e.target.id;
      Inertia.post('/roles/'+id, {
          _method: 'delete',
          preserveScroll: true,
        },{
          onError: () => id.current.focus(),
        })
    }

     const { roles } = usePage().props  

    return (
        <div>
            <Layout>
                {/* check app.css for related css */}
                <div className="header">
                    <h1 className="header-text">Roles</h1>
                </div>
                       <div className="">
                           <div className="p-6 bg-white border-b border-gray-200">
                            <InertiaLink href="/roles/create" className="p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                            Create Role
                            </InertiaLink>
                            </div>
                
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
          
                                    <table className="table-fixed w-full">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="px-4 py-2 w-20">No.</th>
                                                <th className="px-4 py-2">Name</th>
                                                <th className="px-4 py-2">Permission</th>
                                                <th className="px-4 py-2">Edit</th>
                                                <th className="px-4 py-2">Delete</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roles.map((role,key) => (
                                                <tr key={key}>
                                                    <td className="border px-4 py-2">{ role.id }</td>
                                                    <td className="border px-4 py-2">{ role.name }</td>
                                                    <td className="border px-4 py-2">{ role.permissions }
                                                    </td>
                                                    <td className="border px-4 py-2">        
                                                        <InertiaLink href={`/roles/${role.id}`} >
                                                        <i className="fa fa-edit text-success"></i>
                                                        </InertiaLink> 
                                                      </td>
                                                      <td className="border px-4 py-2">
                                                        <form onSubmit={deleteFunc} id={role.id}>
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
          
                                </div>
                            </div>
                        </div> 
            </Layout>
        </div>
    )
}

export default Index
