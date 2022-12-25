import React ,{useState} from 'react';
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
        Inertia.post('/favourites/'+id, {
            _method: 'delete',
            preserveScroll: true,
          },{
            onError: () => id.current.focus(),
          })
      }
      
       const [form, setForm] = useState({
        label : '' 
      })

      const handleSubmit = e => {
          e.preventDefault()
          const id = e.target.id;
          Inertia.post('/favourites/'+id, {
              _method: 'put',
              label: form.label
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

     
     const { favourites } = usePage().props  

    return (
        <div>
            <Layout>
                {/* check app.css for related css */}
                <div className="header">
                    <h1 className="header-text">Favourite URL</h1>
                </div>
                       <div className="">
                           
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
          
                                    <table className="table-fixed w-full">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="px-4 py-2">LABEL / URL
                                                </th>
                                                <th className="px-4 py-2">UPDATE</th>
                                                <th className="px-4 py-2">Delete</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {favourites.data.map((favourite,key) => (
                                                <tr key={key}>
                                                    <td className="border px-4 py-2">
                                                    <InertiaLink target="_blank" href={`${favourite.url}`} >
                                                    { favourite.label ? favourite.label : favourite.url  }
                                                    </InertiaLink>
                                                    </td>
                                                    <td className="border px-4 py-2"> 
                                                       <form onSubmit={handleSubmit} id={favourite.id}  >
                                                       <input type="text" id="label" placeholder="Label"
                                                        value={key.label}
                                                        onChange={handleChange}
                                                        className="w-11/12 px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"/>       
                                                       <button
                                                            type="submit"
                                                            className="items-center pl-3 py-1 text-sm font-medium text-indigo-500 hover:text-indigo-600"
                                                          >
                                                        <i className="fa fa-file text-success"></i>
                                                        </button>
                                                        </form> 
                                                      </td>
                                                      <td className="border px-4 py-2">
                                                        <form onSubmit={deleteFunc} id={favourite.id}>
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

                                    <Pagination class="mt-6" links={favourites.links} />
          
                                </div>
                            </div>
                        </div> 
            </Layout>
        </div>
    )
}

export default Index
