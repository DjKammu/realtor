import React, { Component ,useState } from 'react';
import Layout from '../../layouts/Layout';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'
import DatePicker from "react-datepicker";
import {Inertia} from '@inertiajs/inertia';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";

const Create = (props) => {

  const selectedOption  = null;
  const [selectedSuiteOption, setSelectedSuiteOption]  = useState([]);
  const selectedTenantNameOption  =  null; 
  const selectedStatusOption  =  null; 

  const [startDate, setStartDate] = useState(new Date());
  const [showingDate, setShowingDate] = useState(new Date());
  const [suites, setSuites] = useState([]);
  const [fileValues, setFileValues] = useState([{ name: "",nick_name: "", file : ""}])

  const [form, setForm] = useState({
      date: new Date(),
      showing_date: new Date(),
      account_number: "",
      property_id: "",
      suite_id: "",
      tenant_name: "",
      status: "",
      notes: ""
    })
   
  const handleSubmit = e => {
      e.preventDefault()
      Inertia.post('/leases', {
          date: form.date,
          showing_date: form.showing_date,
          property_id: form.property_id,
          suite_id: form.suite_id,
          tenant_name: form.tenant_name,
          status: form.status,
          notes: form.notes,
          files: form.files
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
          property_id: selectedOption.value,
          suite_id   : null
      }));
      setSuites([]);
      setSelectedSuiteOption([]);

     axios({
        url: '/get-suites/?id='+selectedOption.value,
        headers: {
          'Content-Type': 'text/html'
        }
      })
      .then(response => {
        // ? returns undefined if variable is undefined
        // if( response.data?.errors?.length ) this.setState({errors: response.data.errors})
          
        if(response.data.data.length) { setSuites(response.data.data) }
      })
      .catch(response => {
        console.log(response)
        this.setState({errors: ['Try it again later please.']})
      });


  } 

  const handleSelectSuitChange = (option) => {
     setForm(form => ({
          ...form,
          suite_id: option.value
      }));
     setSelectedSuiteOption(option);
  }

  const handleSelectStatusChange = (option) => {
     setForm(form => ({
          ...form,
          status: option.value
      }));
  }

  const handleDateChange = (date) => {
    setStartDate(date);
     setForm(form => ({
          ...form,
          date: date
      }));
  } 

  const handleShowingDateChange = (date) => {
    setShowingDate(date);
     setForm(form => ({
          ...form,
          showing_date: date
      }));
  }

    const handleSelectTenantNameChange = (option) => {
     setForm(form => ({
          ...form,
          tenant_name: option.value
      }));
  }


const handleFileChange = (i, e) => {
    let newFileValues = [...fileValues];
    newFileValues[i][e.target.name] = (e.target.name == 'name' || e.target.name == 'nick_name' ) ? e.target.value : e.target.files[0] ;
    setFileValues(newFileValues);
    setForm(form => ({
          ...form,
          files:  [...fileValues]
    }));
 }
    
let addFormFields = () => {
    setFileValues([...fileValues, { name: "", file: "" }])
 }

let removeFormFields = (i) => {
    let newFileValues = [...fileValues];
    newFileValues.splice(i, 1);
    setFileValues(newFileValues)
}

  const errors = usePage().props.errors;

  const { tenants, properties , statuses } = usePage().props;
   
    return (
        <div>
            <Layout>
                {/* check app.css for related css */}
                <div className="header">
                    <h1 className="header-text">Create Lease</h1>
                </div>
                     
               <div className="md:grid md:grid-cols-4 md:gap-6">     
                            
               <div className="md:col-span-1">
                <InertiaLink href="/leases" className="p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                  Back to Leases
                  </InertiaLink>
              </div>
              {/* right side */}
              <div className="mt-5 md:mt-0 md:col-span-2">
                           
               <form>
                <div className="px-4 py-5 bg-white shadow sm:p-6 sm:rounded-tl-md sm:rounded-tr-md">
                  <div className="grid grid-cols-6 gap-6">

                   {/* property */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="property">
                        <span>Property</span>
                      </label>
                      <Select
                        defaultValue={selectedOption}
                        onChange={handleSelectChange}
                        options={properties}
                      />                   
                      </div>

                    {/* suite_id */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="suite_id">
                        <span>Suite</span>
                      </label>
                      <Select
                        defaultValue={selectedSuiteOption}
                        onChange={handleSelectSuitChange}
                        options={suites}
                      />                   
                      </div>

                     {/* tenant_name */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="tenant_name">
                        <span>Tenant</span>
                      </label>
                       
                       <Select
                        defaultValue={selectedTenantNameOption}
                        onChange={handleSelectTenantNameChange}
                        options={tenants}
                      />  

                   
                    </div>
                   
                    {/* date */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="date">
                        <span>Start Date</span>
                      </label>
                       <DatePicker selected={startDate} onChange={handleDateChange} />                 
                      </div>  

                    {/* showing_date */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="showing_date">
                        <span>End Date</span>
                      </label>
                       <DatePicker selected={showingDate} onChange={handleShowingDateChange} />                 
                      </div>

                   
                       {/* status */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="status">
                        <span>Status </span>
                      </label>
                      <Select
                        defaultValue={selectedStatusOption}
                        onChange={handleSelectStatusChange}
                        options={statuses}
                      />                   
                      </div>

                       {/* notes */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="notes">
                        <span>Notes</span>
                      </label>
                      <textarea id="notes" placeholder="Notes"
                                value={form.notes}
                                onChange={handleChange} 
                                className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                ></textarea>
                    </div>

                    {/* file */}
                     <div className="col-span-12 sm:col-span-12">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="file">
                          <span>Lease Attachments</span>
                        </label>
                      </div>
                       {form.media && <a href={form.media} target="_new" >Attachment </a>}

                  </div>

                  {fileValues.map((element, index) => (
                    <div className="form-inline" key={index}>
                     
                      <input className="w-1/2 px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" 
                      placeholder="File Name" type="text" name="name" value={element.name || ""} onChange={e => handleFileChange(index, e)} />
                     
                     <input className="w-1/2 px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" 
                      placeholder="File Nick Name" type="text" name="nick_name" value={element.nick_name || ""} onChange={e => handleFileChange(index, e)} />
                     
                      <input type="file" className="w-10/12 px-3 py-2" name="file"  onChange={e => handleFileChange(index, e)} />
                      {
                        index ? 
                          <button type="button"  className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase bg-gray-800 border border-transparent rounded-md hover:bg-gray-700 remove" onClick={() => removeFormFields(index)}>X</button> 
                        : null
                      }
                    </div>
                  ))}

                   <div className="text-right">
                      <button className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase bg-gray-800 border border-transparent rounded-md hover:bg-gray-700 add" type="button" onClick={() => addFormFields()}>
                      <i className="fa fa-plus"></i></button>
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
