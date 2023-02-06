import React, { Component ,useState } from 'react';
import Layout from '../../layouts/Layout';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'
import DatePicker from "react-datepicker";
import {Inertia} from '@inertiajs/inertia';
import QuickAdd from '@/QuickAdd';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
const Edit = (props) => {

  const errors = usePage().props.errors;

  const { realtors, tenantUses, tenants, tenantSuit, lease, properties, users, showingStatus, leasingStatus,statuses } = usePage().props;

  const selectedOption  =  properties.filter(item =>
               item.value == lease.property_id); 
  const selectedTenantNameOption  =  tenants.filter(item =>
               item.value == lease.tenant_name); 
  const selectedStatusOption  =  statuses.filter(item =>
               item.value == lease.status); 

  const [selectedSuiteOption, setSelectedSuiteOption]  = useState(tenantSuit);

  const [startDate, setStartDate] = useState(new Date(lease.date));
  const [showingDate, setShowingDate] = useState(new Date(lease.showing_date));
  const [suites, setSuites] = useState([]);

  const [fileValues, setFileValues] = useState([{ name: "", nick_name: "", file : ""}])

  const [formOpen, setFormOpen] = useState(false)

  const [form, setForm] = useState({
      date: lease.date,
      showing_date: lease.showing_date,
      property_id:  lease.property_id,
      suite_id: lease.suite_id,
      tenant_name:   lease.tenant_name,
      status:    lease.status,
      file:     lease.file,
      media:    lease.media,
      notes:    lease.notes
    })  

  const [edit, setEdit] = useState({
      file     : '',
      name     : '',
      nick_name: ''
    })

    const deleteFunc = (e) => {
        e.preventDefault()
        
        if(!confirm('Are you sure?')){
          return;
        }

        const file = e.target.id;

        Inertia.get('/leases-attachment/delete/'+lease.id+'?file='+file, {
            preserveScroll: true,
          },{
            onError: () => id.current.focus(),
          })
      }

    const editFunc = (e) => {
        e.preventDefault()
        setFormOpen(true)
        setEdit(edit => ({
          ...edit,
          file     : e.target.id,
          name     : e.target.getAttribute('name'),
          nick_name: e.target.getAttribute('nick_name')
      }));
    }

    const handleEditSubmit  = (e) => {
         e.preventDefault()
         
       axios.post('/leases-attachment/update/'+lease.id,edit)
      .then(response => {
        // ? returns undefined if variable is undefined
         if( response.data?.error  ) {
            alert(response.data?.error);
         }
          
         if(response.data?.data?.media?.length) { 
            alert('File updated');
            setForm(form => ({
               ...form,
               media : response.data.data.media
            }));
          }

          setFormOpen(false)
      })
      .catch(response => {
        console.log(response)
        this.setState({errors: ['Try it again later please.']})
      });
    }


    const handleEditCancel  = (e) => {
        e.preventDefault()
        setFormOpen(false)
        setEdit(edit => ({
          ...edit,
          file     : '',
          name     : '',
          nick_name: ''
      }));
    }

    const handleSubmit = e => {
      e.preventDefault()
      Inertia.post('/leases/'+lease.id, {
          _method: 'put',
          date: form.date,
           showing_date: form.showing_date,
          property_id: form.property_id,
          suite_id: form.suite_id,
          tenant_name: form.tenant_name,
          status: form.status,
          file: form.file,
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

    const handleEditChange = e =>   {
      const key = e.target.id;
      const value = e.target.value;
      setEdit(edit => ({
          ...edit,
          [key]: value,
      }));
    }

  const handleSelectChange = (selectedOption) => {
     setForm(form => ({
          ...form,
          property_id: selectedOption.value,
          suite_id   : (lease.property_id == selectedOption.value)  ? lease.suite_id : null
      }));
      setSuites([]);
      setSelectedSuiteOption((lease.property_id == selectedOption.value)  ? tenantSuit : []);

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
   
 const handleSelectStatusChange = (option) => {
     setForm(form => ({
          ...form,
          status: option.value
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


   
    return (
        <div>
            <Layout>
                {/* check app.css for related css */}
                <div className="header">
                    <h1 className="header-text">Edit Lease</h1>
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
                      <div className="form-inline">
                      <Select
                        className="w-3/4 float-left"
                        defaultValue={selectedOption}
                        onChange={handleSelectChange}
                        options={properties}
                      />    
                      <QuickAdd url='/properties/quick-add' title='Property'/>               
                      </div>                  
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
                        <span>Files</span>
                      </label>
                    </div>
                   
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

               {/* attached file */}
               
                {formOpen && 
                     <div className="px-4 py-5 bg-white shadow sm:p-6 sm:rounded-tl-md sm:rounded-tr-md">

                    <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="file">
                        <span>Edit File</span>
                      </label>

                    </div>
                   <div className="form-inline" >
             
                      <input className="w-1/2 px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" 
                      placeholder="File Name" type="text" id="name" value={edit.name || ""} onChange={handleEditChange} />
                     
                     <input className="w-1/2 px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" 
                      placeholder="File Nick Name" type="text" id="nick_name" value={edit.nick_name || ""} onChange={ handleEditChange} />
          
                    </div>


                    <div className="flex items-center justify-end px-4 py-3 text-right border-t shadow sm:px-6 sm:rounded-bl-md sm:rounded-br-md">
                        <button type="button"
                          onClick={handleEditCancel}
                          className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase bg-gray-800 border border-transparent rounded-md hover:bg-gray-700">
                          cancel
                        </button>

                        <button type="submit"
                          onClick={handleEditSubmit}
                          className="inline-flex items-center px-4  mx-2 py-2 text-xs font-semibold tracking-widest text-white uppercase bg-gray-800 border border-transparent rounded-md hover:bg-gray-700">
                          save
                        </button>
                    </div>


               </div>
                  
                }
                    
               <div className="px-4 py-5 bg-white shadow sm:p-6 sm:rounded-tl-md sm:rounded-tr-md">


               <div className="grid grid-cols-6 gap-6">
                   <div className="col-span-12 sm:col-span-12">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="file">
                        <span>Attached Files</span>
                      </label>

                    </div>
                       
                       {form.media && form.media.length > 0 && 
                       
                       form.media.map((element, index) => (
                         <a key={index} className="col-span-3 sm:col-span-3 delete-file" href={element.file} target="_new" >
                           <span className="text-xs"> {element.nick_name} </span> 
                           <img src={`/images/${element.ext}.png`} />
                            <span className="text-xs"> {element.name} </span> 
                            <span className="edit" onClick={editFunc}><i 
                              id={element.file}
                              name={element.name}
                              nick_name={element.nick_name}
                              className="fa fa-edit"></i></span>
                            <span className="cross">
                             <form onSubmit={deleteFunc} id={element.file}>
                                    <button
                                      className="text-gray-800"
                                      type="submit"
                                    >
                                    <i className="fa fa-trash"></i>
                                    </button>
                              </form>
                           </span>
                         </a>
                      ))
                    }
                </div>
                </div>

              </div>
              </div>
                           
            </Layout>
        </div>
    )
}

export default Edit;
