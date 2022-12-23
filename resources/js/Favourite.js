import React , { useEffect, useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
import Modal from '@/Pages/profile/components/FModal'
  
export default function Favourite() {
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({
              url: window.location.pathname+window.location.search+window.location.hash,
              checked:  false,
              name: ''
            })

    const handleFavSubmit = e => {
         e.preventDefault()

         axios.post('/favourites',form)
          .then(response => {
            if(response.data.message) {
               alert(response.data.message)
              }
              setModal(false)
          })
          .catch(response => {
            console.log(response)
            setModal(false)
            this.setState({errors: ['Try it again later please.']})
          });

    }

     const checkFavourite = e => {
         axios.post('/favourite',
            {url : window.location.pathname+window.location.search+window.location.hash}
         ).then(response => {
             if(response.data.data && response.data.data.status  == 1) {
                setChecked(!checked);
              }
          });

    }
     const openModel = e => {
        setModal(true)
    }
    
    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        setChecked(!checked);
         setForm(form => ({
              ...form,
              checked: !checked
          }));
     };

      // This function will called only once
      useEffect(() => {
         checkFavourite();
      }, [])
     
  
    return (
        <div>
             <div className="py-3 text-right">
                 <label className="p-2 mt-8">
                    <input
                      className="p-2 mt-8"
                      type="checkbox"
                      checked={checked}
                      onChange={handleChange}
                    />
                      Mark/ Unmark 
                  </label>
                  <button type="submit"
                      onClick={openModel}
                      className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase bg-gray-800 border border-transparent rounded-md hover:bg-gray-700">
                      Set as Favourite
                    </button>
                </div>
           
             {/* delete account confirmation modal */}
              <Modal show={modal} setShow={setModal} title='Make Favourite'>
                <form>
                <div className="mt-4">
                      <input id="name" 
                        className="w-full px-3 py-2 mt-1 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="Name"
                        onChange={(e) => setForm(form => ({
                                      ...form,
                                      name: e.target.value
                                  })
                          )}
                      />
                </div>
                <div className="flex items-center justify-end mt-4">
                    <button type="submit"
                      onClick={handleFavSubmit}
                      className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase bg-gray-800 border border-transparent rounded-md">
                      Set as Favourite
                    </button>
                </div>
                </form>
              </Modal>

           </div>     
         );
}