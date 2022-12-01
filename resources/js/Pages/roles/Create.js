import React, { Component ,useState } from 'react';
import Layout from '../../layouts/Layout';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'
import {Inertia} from '@inertiajs/inertia';


const Create = () => {
  const [permissions, setPermissions] = useState([]);
  const [form, setForm] = useState({
      name: "",
      permissions: "",
    })
   
  const handleSubmit = e => {
      e.preventDefault()
      Inertia.post('/roles', {
          name: form.name,
          permissions: form.permissions
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

    const handleCheckboxChange = event => {
      let permissionsArray = [...permissions, event.target.id];
      if (permissions.includes(event.target.id)) {
          permissionsArray = permissionsArray.filter(permission => permission !== event.target.id);
       } 
      setPermissions(permissionsArray);
      setForm(form => ({
          ...form,
          permissions: permissionsArray,
      }));
    };

  const errors = usePage().props.errors;
   
    return (
        <div>
            <Layout>
                {/* check app.css for related css */}
                <div className="header">
                    <h1 className="header-text">Create Role</h1>
                </div>
                     
               <div className="md:grid md:grid-cols-4 md:gap-6">     
                            
               <div className="md:col-span-1">
                <InertiaLink href="/roles" className="p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                  Back to Roles
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

                    {/* email */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="permissions">
                        <span>Permissions</span>
                      </label>
                      {errors.permissions && <div className="text-sm text-red-500">{errors.permissions}</div>}
                      <label className=" text-sm font-medium text-gray-700 mr-1" htmlFor="view">
                        <span className="mr-1">View</span>
                        <input type="checkbox" id="view"  
                           value="view"
                           onChange={handleCheckboxChange}
                          />
                      </label>
                      <label className=" text-sm font-medium text-gray-700 mr-1" htmlFor="add">
                        <span className="mr-1">Add</span>
                        <input type="checkbox" id="add"  
                           value="add"
                           onChange={handleCheckboxChange}
                          />
                      </label>

                      <label className=" text-sm font-medium text-gray-700 mr-1" htmlFor="edit">
                        <span className="mr-1">Edit</span>
                        <input type="checkbox" id="edit"  
                           value="edit"
                           onChange={handleCheckboxChange}
                          />
                      </label>
                      <label className=" text-sm font-medium text-gray-700 mr-1" htmlFor="update">
                        <span className="mr-1">Update</span>
                        <input type="checkbox" id="update"  
                           value="update"
                           onChange={handleCheckboxChange}
                          />
                      </label> 

                      <label className=" text-sm font-medium text-gray-700 mr-1" htmlFor="delete">
                        <span className="mr-1">Delete</span>
                        <input type="checkbox" id="delete"  
                           value="delete"
                           onChange={handleCheckboxChange}
                          />
                      </label>
                      <label className=" text-sm font-medium text-gray-700 mr-1" htmlFor="add_users">
                        <span className="mr-1">Add Users</span>
                        <input type="checkbox" id="add_users"  
                           value="add_users"
                           onChange={handleCheckboxChange}
                          />
                      </label>

                       
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
