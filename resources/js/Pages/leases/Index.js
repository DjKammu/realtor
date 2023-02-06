import React , { useState } from 'react';
import Layout from '../../layouts/Layout';
import {Inertia} from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'
import { sortOrderBy } from '@/hooks/constants';
import Select from 'react-select';
import Email from '@/Email';
import Favourite from '@/Favourite';
import Pagination from '@/Pagination';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Index = (props) => {
      
      let { statuses, status , showing_date, property, leases, properties} = usePage().props  
      
      let propertyNullArr = [{'label' : 'Select Property' , 'value' : null}];
      let statusNullArr = [{'label' : 'Select Stattus' , 'value' : null}];

      const selectedOption  =  properties.filter(item =>
               item.value == property); 

      const selectedStatusOption  =  statuses.filter(item =>
               item.value == status); 

      const [showingDate, setShowingDate] = useState(new Date(showing_date));

      const [checkedState, setCheckedState] = useState(
        new Array(leases.data.length).fill(false)
        );

      const [mailProperty, setMailProperty] = useState(null)

      const [form, setForm] = useState({
              property:  property,
              status: status
            })

    
      const deleteFunc = (e) => {
        e.preventDefault()
        
        if(!confirm('Are you sure?')){
          return;
        }

        const id = e.target.id;
        Inertia.post('/leases/'+id, {
            _method: 'delete',
            preserveScroll: true,
          },{
            onError: () => id.current.focus(),
          })
      }

    const handleSubmit = e => {
              e.preventDefault()
              Inertia.get('/leases', {
                  showing_date: form.showing_date,
                  property: form.property,
                  status: form.status
              })
    }

   const handleSelectChange = (selectedOption) => {
     setForm(form => ({
          ...form,
          property: selectedOption.value,
          // suite_id   : null
      }));

    } 


  const handleOnChange = (e) => {
      const key = e.target.name;
      const value = e.target.value;
      const updatedCheckedState = checkedState.map((item, index) =>
        index == key ? !item : false
      );
     setCheckedState(updatedCheckedState);
     setMailProperty(value);
  };


    const handleChange = e =>   {
      const key = e.target.id;
      const value = e.target.value;
      setForm(form => ({
          ...form,
          [key]: value,
      }));
    }

    const handleSelectDateChange = (option) => {
       setForm(form => ({
            ...form,
            date: option.value
        }));
    }

  const handleShowingDateChange = (date) => {
     setShowingDate(date);

     console.log(date);
     setForm(form => ({
          ...form,
          showing_date: date
      }));
  }

   const handleSelectStatusChange = (option) => {
     setForm(form => ({
          ...form,
          status: option.value
      }));
  }

    return (
        <div>
            <Layout>
               <Favourite />
                {/* check app.css for related css */}
                <div className="header">
                    <h1 className="header-text">Leases</h1>
                </div>
                       <div className="">
                           <div className="p-6 bg-white border-b border-gray-200">
                            <InertiaLink href="/leases/create" className="p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                            Create Lease
                            </InertiaLink>

                            </div>
                             <div className="flex items-center">    
                                <Select 
                                    placeholder="Select Property"
                                    defaultValue={selectedOption}
                                    onChange={handleSelectChange}
                                    options={ (properties.length > 0) ? [...propertyNullArr, ...properties] : []}
                                /> 

                                <Select
                                    defaultValue={selectedStatusOption}
                                    onChange={handleSelectStatusChange}
                                    options={ (statuses.length > 0) ? [...statusNullArr, ...statuses] : []}
                                  /> 
                                      
                                         
                                   <div className="flex border border-purple-200 rounded">
                                    
                                    <button onClick={handleSubmit} className="block w-full px-4 py-2 text-white bg-black border-l rounded ">
                                        Search
                                    </button>
                                    <a href="/download/leases"  className="block w-full px-4 py-2 text-white bg-black border-l rounded ">
                                        Download
                                    </a>
                                    <Email url="leases/send-mail" id={mailProperty} title='Lease' />
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                   
                                    <table className="table-fixed w-full">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="w-12">
                                                </th>
                                                <th className="px-4 py-2">Property
                                                 <i onClick={sortOrderBy('property_id', 'asc')} 
                                                className="fa fa-sort-asc"></i>
                                                <i onClick={sortOrderBy('property_id', 'desc')}  
                                                className="fa fa-sort-desc"></i>
                                                </th>
                                                <th className="px-4 py-2">Suite
                                                 <i onClick={sortOrderBy('suite_id', 'asc')} 
                                                className="fa fa-sort-asc"></i>
                                                <i onClick={sortOrderBy('suite_id', 'desc')}  
                                                className="fa fa-sort-desc"></i>
                                                </th>
                                                <th className="px-4 py-2">Tenant
                                                 <i onClick={sortOrderBy('tenant_name', 'asc')} 
                                                className="fa fa-sort-asc"></i>
                                                <i onClick={sortOrderBy('tenant_name', 'desc')}  
                                                className="fa fa-sort-desc"></i></th>

                                                 <th className="px-4 py-2">Start Date
                                                 <i onClick={sortOrderBy('date', 'asc')} 
                                                className="fa fa-sort-asc"></i>
                                                <i onClick={sortOrderBy('date', 'desc')}  
                                                className="fa fa-sort-desc"></i>
                                                </th>
                                                <th className="px-4 py-2">End Date
                                                 <i onClick={sortOrderBy('showing_date', 'asc')} 
                                                className="fa fa-sort-asc"></i>
                                                <i onClick={sortOrderBy('showing_date', 'desc')}  
                                                className="fa fa-sort-desc"></i>
                                                </th>
                                                <th className="px-4 py-2">Attachments</th>
                                                <th className="px-4 py-2">Notes</th>
                                              
                                                <th className="px-4 py-2">Action</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leases.data.map((lease,key) => (
                                                <tr key={key}>
                                                    <td className="border px-4 py-2">
                                                     <input className="form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 my-1 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer" 
                                                      type="checkbox"
                                                      id={`custom-checkbox-${key}`}
                                                      name={key}
                                                      value={lease.id}
                                                      checked={checkedState[key]}
                                                      onChange={handleOnChange}
                                                       />
  
                                                    </td>
                                                    <td className="border px-4 py-2">{ lease.property }</td>
                                                    <td className="border px-4 py-2">{ lease.suite }</td>
                                                    <td className="border px-4 py-2">{ lease.tenant_name }</td>
                                                    <td className="border px-4 py-2">{ lease.date }</td>
                                                    <td className="border px-4 py-2">{ lease.showing_date }</td>
                                                    <td className="border px-4 py-2">

                    {lease.media && lease.media.length > 0 && 
                       lease.media.map((element, index) => (
                         <a className="attachments-files" key={index} href={element.file} target="_new" >
                         <span className="text-xs"> {element.nick_name} </span> 
                           <img src={`/images/${element.ext}.png`} />
                         </a>
                      ))
                    }</td>
                                                    <td className="border px-4 py-2">{ lease.notes }</td>
                                                    <td className="border px-4 py-2">        
                                                        <InertiaLink  className="float-left" href={`/leases/${lease.id}`} >
                                                        <i className="fa fa-edit text-success"></i>
                                                        </InertiaLink> 
                                                        <form onSubmit={deleteFunc} id={lease.id}>
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

                                    <Pagination class="mt-6" links={leases.links} />
          
                                </div>
                            </div>
                        </div> 
            </Layout>
        </div>
    )
}

export default Index
