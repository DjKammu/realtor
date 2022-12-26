import React , { useEffect, useState } from 'react';
import {Inertia} from '@inertiajs/inertia';
import { Link, usePage} from '@inertiajs/inertia-react';
import Modal from '@/Pages/profile/components/QuickModal'
  
export default function QuickAdd(props) {
    const errors = usePage().props.errors;
    const [quickModal, setQuickModal] = useState(false);
    const [form, setForm] = useState({
              name: ''
            })

    const handleQuickSubmit = e => {
         e.preventDefault()
         let url = props.url;
         Inertia.post(url, form,
          {
            onSuccess: () => setQuickModal(false)
          });
    }

  
     const openModel = e => {
        setQuickModal(true)
    }
  
    return (
        <div className="w-1/4 pl-1 float-left">
                  <button type="button"
                      onClick={openModel}
                      className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase bg-gray-800 border border-transparent rounded-md hover:bg-gray-700">
                      Quick Add
                    </button>
             
           
             {/* delete account confirmation modal */}
              <Modal show={quickModal} setShow={setQuickModal} title={'Quick Add ' + props.title}>
                <form>
                <div className="mt-4">
                      <input id="name" 
                        className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder={props.title +' Name'}
                        onChange={(e) => setForm(form => ({
                                      ...form,
                                      name: e.target.value
                                  })
                          )}
                      />
                      {errors.name && <div className="text-sm text-red-500">{errors.name}</div>}
                </div>
                <div className="flex items-center justify-end mt-4">
                    <button type="submit"
                      onClick={handleQuickSubmit}
                      className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase bg-gray-800 border border-transparent rounded-md">
                      Quick Add
                    </button>
                </div>
                </form>
              </Modal>

           </div>     
         );
}