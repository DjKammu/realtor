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
        Inertia.post('/suites/'+id, {
            _method: 'delete',
            preserveScroll: true,
          },{
            onError: () => id.current.focus(),
          })
      }
     
 

     const { suites } = usePage().props  

    return (
        <div>
            <Layout>
                {/* check app.css for related css */}
                <div className="header">
                    <h1 className="header-text">Suites</h1>
                </div>
                       <div className="">
                           <div className="p-6 bg-white border-b border-gray-200">
                            <InertiaLink href="/suites/create" className="p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                            Create Suite
                            </InertiaLink>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
          
                                    <table className="table-fixed w-full">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="px-4 py-2 w-20">No.</th>
                                                <th className="px-4 py-2">Name<i onClick={sortOrderBy('name', 'asc')} 
                                                className="fa fa-sort-asc"></i>
                                                <i onClick={sortOrderBy('name', 'desc')}  
                                                className="fa fa-sort-desc"></i>
                                                </th>
                                                <th className="px-4 py-2">Account Number<i onClick={sortOrderBy('account_number', 'asc')} 
                                                className="fa fa-sort-asc"></i>
                                                <i onClick={sortOrderBy('account_number', 'desc')}  
                                                className="fa fa-sort-desc"></i></th>
                                                <th className="px-4 py-2">Property<i onClick={sortOrderBy('property_id', 'asc')} 
                                                className="fa fa-sort-asc"></i>
                                                <i onClick={sortOrderBy('property_id', 'desc')}  
                                                className="fa fa-sort-desc"></i></th>
                                                <th className="px-4 py-2">Edit</th>
                                                <th className="px-4 py-2">Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {suites.data.map((suite,key) => (
                                                <tr key={key}>
                                                    <td className="border px-4 py-2">{ suite.id }</td>
                                                    <td className="border px-4 py-2">{ suite.name }</td>
                                                    <td className="border px-4 py-2">{ suite.account_number }
                                                    </td>
                                                    <td className="border px-4 py-2">{ suite.property }</td>
                                                    <td className="border px-4 py-2">        
                                                        <InertiaLink href={`/suites/${suite.id}`} >
                                                        <i className="fa fa-edit text-success"></i>
                                                        </InertiaLink> 
                                                      </td>
                                                      <td className="border px-4 py-2">
                                                        <form onSubmit={deleteFunc} id={suite.id}>
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

                                    <Pagination class="mt-6" links={suites.links} />
          
                                </div>
                            </div>
                        </div> 
            </Layout>
        </div>
    )
}

export default Index
