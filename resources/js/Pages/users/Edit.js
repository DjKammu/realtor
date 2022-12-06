import React, { Component ,useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'
import {Inertia} from '@inertiajs/inertia';
import Select from 'react-select';

const Edit = (props) => {
  const errors = usePage().props.errors; 
  const { user , properties , roles } = usePage().props
  const selectedOption  =  roles.filter(item =>
               item.value == user.role); 

  const selectedPropertyOption = properties.filter(item =>
               (user.properties) ? user.properties.includes(item.value):'');

  const [form, setForm] = useState({
      name: user.name,
      email: user.email,
      password: '',
      confirm_password: "",
      role: user.role,
      properties: user.properties

    })
   
  const handleSubmit = e => {
      e.preventDefault()
   
      Inertia.post('/users/'+user.id, {
          _method: 'put',
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation : form.password_confirmation,
          role: form.role,
          properties: form.properties

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
          role: selectedOption.value,
      }));
  }

    const handleSelectPropertyChange = (selectedOption) => {
    let propertiesArr = selectedOption.map(property =>  property.id)

     setForm(form => ({
          ...form,
          properties: propertiesArr,
      }));
  }

   
    return (
        <div>
            <Layout>
                {/* check app.css for related css */}
                <div className="header">
                    <h1 className="header-text">Edit User</h1>
                </div>
                     
               <div className="md:grid md:grid-cols-4 md:gap-6">     
                            
               <div className="md:col-span-1">
                <InertiaLink href="/suites" className="p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                  Back to Users
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
                      <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                        <span>Email Addess</span>
                      </label>

                      <input type="email" id="email" placeholder="Email Addess"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"/>
                                {errors.email && <div className="text-sm text-red-500">{errors.email}</div>}

                    </div>

                  {/* password */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                        <span>Password</span>
                      </label>

                      <input type="password" id="password" placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"/>
                                {errors.password && <div className="text-sm text-red-500">{errors.password}</div>}

                    </div>

                  {/* password_confirmation */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="password_confirmation">
                        <span>Confirm Password</span>
                      </label>
                      <input type="password" id="password_confirmation" placeholder="Confirm Password"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"/>
                                {errors.password_confirmation && <div className="text-sm text-red-500">{errors.password_confirmation}</div>}

                    </div>

                  {/* role */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="role">
                        <span>Role</span>
                      </label>
                      <Select
                        defaultValue={selectedOption}
                        onChange={handleSelectChange}
                        options={roles}
                      />                   
                      </div>

                    {/* property */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="property">
                        <span>Property</span>
                      </label>
                      <Select
                        defaultValue={selectedPropertyOption}
                        onChange={handleSelectPropertyChange}
                        options={properties}
                        isMulti
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


export default Edit;
