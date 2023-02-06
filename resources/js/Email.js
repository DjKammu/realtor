import React , { useEffect, useState } from 'react';
import {Inertia} from '@inertiajs/inertia';
import { Link, usePage} from '@inertiajs/inertia-react';
import Modal from '@/Pages/profile/components/EmailModal'
  
export default function Email(props) {
    const errors = usePage().props.errors;
    const [quickModal, setQuickModal] = useState(false);
    const [form, setForm] = useState({
              id:  '',
              recipient:  '',
              subject:  '',
              message:  ''
      })



    const handleQuickSubmit = e => {
         e.preventDefault()
         let url = props.url;
         Inertia.post(url, form,
          {
            onSuccess: () => {
                alert('Sent Succussfully!')
                setQuickModal(false)
            }
          });
    }

  
     const openModel = e => {
       const mProperty = props.id;
       if(!mProperty){
       alert('Please select '+props.title);
         return;
       }
        setForm(form => ({
            ...form,
            id: mProperty
        }))

        setQuickModal(true)
    }
  
    return (
        <div className="">
                  <button type="button"
                      onClick={openModel}
                      className="block w-full px-4 py-2 text-white bg-black border-l rounded">
                      Email
                    </button>
             
           
             {/* delete account confirmation modal */}
              <Modal show={quickModal} setShow={setQuickModal} title={'Mail ' + props.title}>
                <form>
                <div className="mt-4">
                      <input id="recipient" 
                        className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type="mail"
                        placeholder='Recipient'
                        onChange={(e) => setForm(form => ({
                                      ...form,
                                      recipient: e.target.value
                                  })
                          )}
                      />
                      {errors.recipient && <div className="text-sm text-red-500">{errors.recipient}</div>}
                </div>
                <div className="mt-4">
                      <input id="subject" 
                        className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder='Subject'
                        onChange={(e) => setForm(form => ({
                                      ...form,
                                      subject: e.target.value
                                  })
                          )}
                      />
                      {errors.subject && <div className="text-sm text-red-500">{errors.subject}</div>}
                </div>
                <div className="mt-4">
                <textarea id="message" placeholder="Message"
                                value={form.notes}
                                onChange={(e) => setForm(form => ({
                                          ...form,
                                          message: e.target.value
                                      })
                              )}
                            className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            ></textarea>
                </div>
                <div className="flex items-center justify-end mt-4">
                    <button type="submit"
                      onClick={handleQuickSubmit}
                      className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase bg-gray-800 border border-transparent rounded-md">
                      Send
                    </button>
                </div>
                </form>
              </Modal>

           </div>     
         );
}