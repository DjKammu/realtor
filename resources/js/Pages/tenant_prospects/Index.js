import React , { useState } from 'react';
import Layout from '../../layouts/Layout';
import {Inertia} from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'
import { sortOrderBy } from '@/hooks/constants';
import Pagination from '@/Pagination';
import Select from 'react-select';

const Index = (props) => {
      
      const { tenantSuit, date, property, suite, shown_by, leasing_agent, tenantProspects, properties, users, showingStatus, leasingStatus, dateArr } = usePage().props  

      const selectedOption  =  properties.filter(item =>
               item.value == property); 

      const selectedDateOption = dateArr.filter(item =>
               item.value == date); 
      const [selectedSuiteOption, setSelectedSuiteOption]  = useState(tenantSuit);

     const selectedShownByOption  =  users.filter(item =>
               item.value == shown_by); 
     const selectedLeasingAgentOption  =  users.filter(item =>
               item.value == leasing_agent); 


      const [suites, setSuites] = useState([]);

      const [form, setForm] = useState({
              date: date,
              property:  property,
              suite: suite,
              shown_by: shown_by,
              leasing_agent: leasing_agent
            })

      const deleteFunc = (e) => {
        e.preventDefault()
        
        if(!confirm('Are you sure?')){
          return;
        }

        const id = e.target.id;
        Inertia.post('/tenant-prospects/'+id, {
            _method: 'delete',
            preserveScroll: true,
          },{
            onError: () => id.current.focus(),
          })
      }


    const handleSubmit = e => {
              e.preventDefault()

              Inertia.get('/tenant-prospects', {
                  date: form.date,
                  property: form.property,
                  suite: form.suite,
                  shown_by: form.shown_by,
                  leasing_agent: form.leasing_agent
              })

    }


       const handleSelectChange = (selectedOption) => {
         setForm(form => ({
              ...form,
              property: selectedOption.value,
              suite_id   : (property == selectedOption.value)  ? suite : null
          }));
          setSuites([]);
           setSelectedSuiteOption((property == selectedOption.value)  ? tenantSuit : []);

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

    const handleChange = e =>   {
      const key = e.target.id;
      const value = e.target.value;
      setForm(form => ({
          ...form,
          [key]: value,
      }));
    }

  const handleSelectSuitChange = (option) => {
     setForm(form => ({
          ...form,
          suite: option.value
      }));
     setSelectedSuiteOption(option);
  }
      
  const handleSelectShownByChange = (option) => {
     setForm(form => ({
          ...form,
          shown_by: option.value
      }));
  }

  const handleSelectLeasingAgentChange = (option) => {
     setForm(form => ({
          ...form,
          leasing_agent: option.value
      }));
  }

  const handleSelectDateChange = (option) => {
     setForm(form => ({
          ...form,
          date: option.value
      }));
  }
     
    return (
        <div>
            <Layout>
                {/* check app.css for related css */}
                <div className="header">
                    <h1 className="header-text">Tenant Prospects</h1>
                </div>
                       <div className="">
                           <div className="p-6 bg-white border-b border-gray-200">
                            <InertiaLink href="/tenant-prospects/create" className="p-2 mt-8 text-lg font-bold text-white bg-black hover:bg-gray-700">
                            Create Tenant Prospect
                            </InertiaLink>
                            </div>
                             <div className="flex items-center">
                                       <Select 
                                            placeholder="Select Date"
                                            defaultValue={selectedDateOption}
                                            onChange={handleSelectDateChange}
                                            options={dateArr}
                                        /> 
                                        <Select 
                                            placeholder="Select Property"
                                            defaultValue={selectedOption}
                                            onChange={handleSelectChange}
                                            options={properties}
                                        /> 
                                        <Select
                                        placeholder="Select Suite"
                                        defaultValue={selectedSuiteOption}
                                        onChange={handleSelectSuitChange}
                                        options={suites}
                                        />  
                                        <Select
                                        placeholder="Select Shown By"
                                        defaultValue={selectedShownByOption}
                                        onChange={handleSelectShownByChange}
                                        options={users}
                                        />  

                                        <Select
                                        placeholder="Select Leasing Agent"
                                        defaultValue={selectedLeasingAgentOption}
                                        onChange={handleSelectLeasingAgentChange}
                                        options={users}
                                        />  
                                <div className="flex border border-purple-200 rounded">
                                    
                                    <button onClick={handleSubmit} className="block w-full px-4 py-2 text-white bg-black border-l rounded ">
                                        Search
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 bg-white border-b border-gray-200">
                                   
                                    <table className="table-fixed w-full">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="px-4 py-2 w-20">No.</th>
                                                <th className="px-4 py-2">Date
                                                 <i onClick={sortOrderBy('date', 'asc')} 
                                                className="fa fa-sort-asc"></i>
                                                <i onClick={sortOrderBy('date', 'desc')}  
                                                className="fa fa-sort-desc"></i>
                                                </th>
                                                <th className="px-4 py-2">Showing Date
                                                 <i onClick={sortOrderBy('showing_date', 'asc')} 
                                                className="fa fa-sort-asc"></i>
                                                <i onClick={sortOrderBy('showing_date', 'desc')}  
                                                className="fa fa-sort-desc"></i>
                                                </th>
                                                <th className="px-4 py-2">Name
                                                 <i onClick={sortOrderBy('tenant_name', 'asc')} 
                                                className="fa fa-sort-asc"></i>
                                                <i onClick={sortOrderBy('tenant_name', 'desc')}  
                                                className="fa fa-sort-desc"></i></th>
                                                <th className="px-4 py-2">Edit</th>
                                                <th className="px-4 py-2">Delete</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tenantProspects.data.map((tenantPro,key) => (
                                                <tr key={key}>
                                                    <td className="border px-4 py-2">{ tenantPro.id }</td>
                                                    <td className="border px-4 py-2">{ tenantPro.date }</td>
                                                    <td className="border px-4 py-2">{ tenantPro.showing_date }</td>
                                                    <td className="border px-4 py-2">{ tenantPro.tenant_name }</td>
                                                    <td className="border px-4 py-2">        
                                                        <InertiaLink href={`/tenant-prospects/${tenantPro.id}`} >
                                                        <i className="fa fa-edit text-success"></i>
                                                        </InertiaLink> 
                                                      </td>
                                                      <td className="border px-4 py-2">
                                                        <form onSubmit={deleteFunc} id={tenantPro.id}>
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

                                    <Pagination class="mt-6" links={tenantProspects.links} />
          
                                </div>
                            </div>
                        </div> 
            </Layout>
        </div>
    )
}

export default Index
