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
  const selectedLeasingOption = null;
  const selectedShowingOption = null;
  const selectedShownByOption = null;
  const selectedLeasingAgentOption = null;

  const [startDate, setStartDate] = useState(new Date());
  const [showingDate, setShowingDate] = useState(new Date());
  const [suites, setSuites] = useState([]);

  const [form, setForm] = useState({
      date: new Date(),
      showing_date: new Date(),
      account_number: "",
      property_id: "",
      suite_id: "",
      showing_status_id: "",
      leasing_status_id: "",
      leasing_agent_id: "",
      shown_by_id: "",
      tenant_name: "",
      tenant_use: "",
    })
   
  const handleSubmit = e => {
      e.preventDefault()
      Inertia.post('/tenant-prospects', {
          date: form.date,
          showing_date: form.showing_date,
          property_id: form.property_id,
          suite_id: form.suite_id,
          showing_status_id: form.showing_status_id,
          leasing_status_id: form.leasing_status_id,
          shown_by_id: form.shown_by_id,
          leasing_agent_id: form.leasing_agent_id,
          tenant_name: form.tenant_name,
          tenant_use: form.tenant_use
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

  const handleSelectShowingChange = (option) => {
     setForm(form => ({
          ...form,
          showing_status_id: option.value
      }));
  }

  const handleSelectLeasingChange = (option) => {
     setForm(form => ({
          ...form,
          leasing_status_id: option.value
      }));
  } 

  const handleSelectShownByChange = (option) => {
     setForm(form => ({
          ...form,
          shown_by_id: option.value
      }));
  }

  const handleSelectLeasingAgentChange = (option) => {
     setForm(form => ({
          ...form,
          leasing_agent_id: option.value
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

  const errors = usePage().props.errors;

  const { properties, users, showingStatus, leasingStatus } = usePage().props;
   
    return (
        <div>
            <Layout>
                {/* check app.css for related css */}
                <div className="header">
                    <h1 className="header-text">Create Tenant Prospect</h1>
                </div>
                     
               <div className="md:grid md:grid-cols-4 md:gap-6">     
                            
               <div className="md:col-span-1">
                <InertiaLink href="/tenant-prospects" className="p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                  Back to Tenant Prospects
                  </InertiaLink>
              </div>
              {/* right side */}
              <div className="mt-5 md:mt-0 md:col-span-2">
                           
               <form>
                <div className="px-4 py-5 bg-white shadow sm:p-6 sm:rounded-tl-md sm:rounded-tr-md">
                  <div className="grid grid-cols-6 gap-6">
                   
                    {/* date */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="date">
                        <span>Date</span>
                      </label>
                       <DatePicker selected={startDate} onChange={handleDateChange} />                 
                      </div>  

                    {/* showing_date */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="showing_date">
                        <span>Showing Date</span>
                      </label>
                       <DatePicker selected={showingDate} onChange={handleShowingDateChange} />                 
                      </div>

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
                        <span>Name</span>
                      </label>

                      <input type="text" id="tenant_name" placeholder="Name"
                                value={form.tenant_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"/>
                                {errors.tenant_name && <div className="text-sm text-red-500">{errors.tenant_name}</div>}

                    </div>

                  {/* tenant_use */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="tenant_use">
                        <span>Tenant Use</span>
                      </label>

                      <input type="text" id="tenant_use" placeholder="Tenant Use"
                                value={form.tenant_use}
                                onChange={handleChange}
                                className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"/>
                                {errors.tenant_use && <div className="text-sm text-red-500">{errors.tenant_use}</div>}

                    </div> 
                    
                    {/* showing_status_id */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="showing_status_id">
                        <span>Showing Status </span>
                      </label>
                      <Select
                        defaultValue={selectedShowingOption}
                        onChange={handleSelectShowingChange}
                        options={showingStatus}
                      />                   
                      </div> 

                    {/* leasing_status_id */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="leasing_status_id">
                        <span>Leasing Status </span>
                      </label>
                      <Select
                        defaultValue={selectedLeasingOption}
                        onChange={handleSelectLeasingChange}
                        options={leasingStatus}
                      />                   
                      </div>
                      
                       {/* shown_by_id */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="shown_by_id">
                        <span>Showing By </span>
                      </label>
                      <Select
                        defaultValue={selectedShownByOption}
                        onChange={handleSelectShownByChange}
                        options={users}
                      />                   
                      </div> 

                       {/* leasing_agent_id */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="leasing_agent_id">
                        <span>Leasing Agent </span>
                      </label>
                      <Select
                        defaultValue={selectedLeasingAgentOption}
                        onChange={handleSelectLeasingAgentChange}
                        options={users}
                      />                   
                      </div>

                       {/* notes */}
                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="notes">
                        <span>Notes</span>
                      </label>
                      <textarea id="account_number" placeholder="Notes"
                                value={form.notes}
                                onChange={handleChange} 
                                className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                ></textarea>
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