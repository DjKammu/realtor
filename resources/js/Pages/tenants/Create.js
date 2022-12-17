import React, { Component ,useState } from 'react';
import Layout from '../../layouts/Layout';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'
import {Inertia} from '@inertiajs/inertia';
import Select from 'react-select';

const Create = (props) => {

  const selectedOption  = null;

  const [form, setForm] = useState({
      name: "",
      address: "",
      phone_number: "",
      emaill: "",
      tenant_use_id: ""
    })
   
  const handleSubmit = e => {
      e.preventDefault()
      Inertia.post('/tenants', {
          name: form.name,
          address: form.address,
          phone_number: form.phone_number,
          emaill: form.emaill,
          tenant_use_id: form.tenant_use_id
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

  const handleSelectChange = (selectedOption) => {
     setForm(form => ({
          ...form,
          tenant_use_id: selectedOption.value
      }));

  } 


  const errors = usePage().props.errors;

  const { tenantUses } = usePage().props;
      
  let useNullArr = [{'label' : 'Select Tenant Use' , 'value' : null}];
   
    return (
        <div>
            <Layout>
                {/* check app.css for related css */}
                <div className="header">
                    <h1 className="header-text">Create Tenant</h1>
                </div>
                     
               <div className="md:grid md:grid-cols-4 md:gap-6">     
                            
               <div className="md:col-span-1">
                <InertiaLink href="/tenants" className="p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                  Back to Tenants
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

                  {/* address */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="address">
                        <span>Address</span>
                      </label>

                      <input type="text" id="address" placeholder="Address"
                                value={form.address}
                                onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"/>
                                {errors.address && <div className="text-sm text-red-500">{errors.address}</div>}

                    </div> 

                  {/* phone_number */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="phone_number">
                        <span>Name</span>
                      </label>

                      <input type="number" id="phone_number" placeholder="Name"
                                value={form.phone_number}
                                onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"/>
                                {errors.phone_number && <div className="text-sm text-red-500">{errors.phone_number}</div>}

                    </div>

                  {/* emaill */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="emaill">
                        <span>Tenant Use</span>
                      </label>

                      <input type="email" id="emaill" placeholder="Tenant Use"
                                value={form.emaill}
                                onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"/>
                                {errors.emaill && <div className="text-sm text-red-500">{errors.emaill}</div>}

                    </div> 
                    
                    {/* tenant_use_id */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="tenant_use_id">
                        <span>Tenant Use</span>
                      </label>
                      <Select
                        defaultValue={selectedOption}
                        onChange={handleSelectChange}
                        options={[...useNullArr, ...tenantUses]}
                      />                   
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


export default Create;
