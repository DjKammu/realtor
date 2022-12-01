import React, { Component ,useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'
import {Inertia} from '@inertiajs/inertia';


const Edit = (props) => {
  const errors = usePage().props.errors;  
  const { property } = usePage().props  

  const [form, setForm] = useState({
      name: property.name,
      account_number: property.account_number
    })
   
  const handleSubmit = e => {
      e.preventDefault()
   
      Inertia.post('/properties/'+property.id, {
          _method: 'put',
          name: form.name,
          account_number: form.account_number
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
                    <h1 className="header-text">Edit Property</h1>
                </div>
                     
               <div className="md:grid md:grid-cols-4 md:gap-6">     
                            
               <div className="md:col-span-1">
                <InertiaLink href="/properties" className="p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                  Back to Properties
                  </InertiaLink>
              </div>
              {/* right side */}
              <div className="mt-5 md:mt-0 md:col-span-2">
                         
               <form>
                <div className="px-4 py-5 bg-white shadow sm:p-6 sm:rounded-tl-md sm:rounded-tr-md">
                  <div className="grid grid-cols-6 gap-6">

                    {/* name */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                        <span>Name</span>
                      </label>

                      <input type="text" id="name" placeholder="Name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"/>
                                {errors.name && <div className="text-sm text-red-500">{errors.name}</div>}

                    </div>

                    
                  {/* account_number */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="account_number">
                        <span>Account Number</span>
                      </label>

                      <input type="text" id="account_number" placeholder="Account Number"
                                value={form.account_number}
                                onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"/>
                                {errors.account_number && <div className="text-sm text-red-500">{errors.account_number}</div>}

                    </div>
                    

                  </div>
                </div>
                {/* actions */}
                <div className="flex items-center justify-end px-4 py-3 text-right border-t shadow bg-gray-50 sm:px-6 sm:rounded-bl-md sm:rounded-br-md">
                    <button type="submit"
                      onClick={handleSubmit}
                      className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase bg-gray-800 border border-transparent rounded-md hover:bg-gray-700">
                      save
                    </button>
                </div>
              </form>
              </div>
              </div>
                           
            </Layout>
        </div>
    )
}


export default Edit;
