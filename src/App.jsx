import React,{useEffect, useState,useRef} from "react"

// import utils
import { useQuery,useMutation,useQueryClient} from "@tanstack/react-query"
import {  Dialog, DialogPanel, DialogTitle,Input } from '@headlessui/react'
import { FaPen } from "react-icons/fa6";
function App() {
  let queryClient = useQueryClient()

  // state nama input nama lokasi
  let inputNamaLokasi = useRef()
  // state nama input kode lokasi
  let inputKodeLokasi = useRef()
  // STATE LIST LOKASI
  let [lisLokasi,setListLokasi] = useState([])
  // state detail cuaca lokasi
  let [detailCuacaLokasi,setDetailCuacaLokasi] = useState([])
  // state show modal edit
   let [isOpenEdit, setIsOpenEdit] = useState({
    status:false,
    id:'',
    title:"",
    kode:''
   })
  // state detail cuaca
  let [detailCurrentCuacaLokasi,setdetailCurrentCuacaLokasi] = useState({
    id:'',
    title:''
  })

  // set title web
  useEffect(() => {
    document.title = 'Home'
  }, [])


  //! query get lokasi
  const {isFetching:isFetchingListLokasi,isFetched:isFetchedListLokasi} = useQuery({
    queryKey:['getLokasi'],
    queryFn:()=>{
      return fetch(`${import.meta.env.VITE_BASEURL_API}/api/lokasi`,{
        method:'GET',
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        }),
      }).then(response =>{
        return response.json()
      })
    },
    onSuccess(dataResponse){
      setListLokasi(dataResponse?.data)
    },
    onError(err){
      setListLokasi([])
      return err
    },
    retry:1
  })

  //! query get detail cuaca lokasi
  const {isFetching:isFetchingCuacaLokasi,isFetched:isFetchedCuacaLokasi} = useQuery({
    queryKey:['getCuacaLokasi',detailCurrentCuacaLokasi.title],
    queryFn:()=>{
      return fetch(`${import.meta.env.VITE_BASEURL_API}/api/cuaca/${detailCurrentCuacaLokasi.title}`,{
        method:'GET',
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        }),
      }).then(response =>{
        return response.json()
      })
    },
    onSuccess(dataResponse){
      setDetailCuacaLokasi(dataResponse)
    },
    onError(err){
      setDetailCuacaLokasi([])
      return err
    },
    retry:1,
    enabled:detailCurrentCuacaLokasi?.id !== '' ? true : false
  })

  //! mutation tambah lokasi
  const {mutateAsync,isLoading:isLoadingPostNewLokasi,isError:isErrorPostNewLokasi} = useMutation({
    mutationFn(dataLokasiBaru){
      return fetch(`${import.meta.env.VITE_BASEURL_API}/api/lokasi`,{
        method:"POST",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
          'Content-Type':'application/json'
        }),
        body:JSON.stringify(dataLokasiBaru)
      }).then(response => response.json())
    },
    onSuccess(response){
      queryClient.invalidateQueries(['getLokasi'])
    },
    onError(err){
      return err
    },
    onSettled(){
      inputNamaLokasi.current.value = ''
      inputKodeLokasi.current.value = ''
    }
  })

  //! mutation edit lokasi
  const {mutateAsync:mutateEditLokasi,isLoading:isLoadingEditLokasi,isError:isErrorEditLokasi} = useMutation({
    mutationFn(dataEditLokasi){
      return fetch(`${import.meta.env.VITE_BASEURL_API}/api/lokasi/${dataEditLokasi.id}`,{
        method:"PUT",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
          'Content-Type':'application/json'
        }),
        body:JSON.stringify(dataEditLokasi.detail)
      }).then(response => response.json())
    },
    onSuccess(response){
      queryClient.invalidateQueries(['getLokasi'])
    },
    onError(err){
      return err
    },
    onSettled(){
      setIsOpenEdit(state => ({
        id:'',
        status:false,
        title:'',
        kode:''
      }))
    }
  })


  //! handle post lokasi
  const _handlePostLokasi = async (event)=>{
    event.preventDefault()
    try{
      await mutateAsync({
        nama_kota:inputNamaLokasi.current.value,
        kode_negara:inputKodeLokasi.current.value
      })
    }
    catch(err){
      return err
    }
  }

   //! handle edit lokasi
   const _handleEditLokasi = async (value)=>{
    try{
      await mutateEditLokasi({
        id:value.id,
       detail:{
        nama_kota:value.title,
        kode_negara:inputKodeLokasi.current.value
       }
      })
    }
    catch(err){
      return err
    }
  }

  return (
    <>
      {/* // modal edit  */}
      <Dialog open={isOpenEdit.status} as="div" className="relative z-10 focus:outline-none" onClose={()=>{return}}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-slate-900/80 p-6 backdrop-blur-sm duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                Edit Lokasi
              </DialogTitle>
              <input
              defaultValue={isOpenEdit.title}
                className={
                  `mt-3 block w-full rounded-lg border-none bg-white/10 py-1.5 px-3 text-sm/6 text-white
                  focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25`
                }
                onChange={(event)=>{
                  setIsOpenEdit(state => ({
                    ...state,
                    title:event.target.value
                  }))
                }}
                />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  disabled={isLoadingEditLokasi ? true : false}
                  className="inline-flex items-center gap-2 rounded-md bg-gray-600 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={()=>{
                    setIsOpenEdit({
                      status:false,
                      id:'',
                      title:"",
                      kode:''
                    })
                  }}
                >
                 Cancel
                </button>

                <button
                disabled={isLoadingEditLokasi ? true : false}
                  className="inline-flex items-center gap-2 rounded-md bg-gray-600 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700 "
                  onClick={()=>{
                    _handleEditLokasi(isOpenEdit)
                  }}
                >
                  {
                    isLoadingEditLokasi ?
                    'loading..'
                    :
                    'Submit'
                  }
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>


    <section className="relative w-full h-[100vh]  overflow-x-hidden overflow-y-auto p-5 bg-white-500/50 flex justify-center items-center">
      {/*//! container */}
      <section className="relative w-[800px] ">
        {/*//! TITLE */}
        <h2 className="text-center text-3xl text-[#344e41] font-bold">
          Aplikasi Prediksi cuaca
        </h2>


        {/*//! detail lokasi */}
        {
          isFetchingCuacaLokasi ? <p className="text-center my-5">loading...</p>:
          (isFetchedCuacaLokasi) && detailCuacaLokasi?.length === 0 ? <p className="text-center my-5">data tidak ditemukan</p>
          :
          detailCurrentCuacaLokasi?.id !== '' &&
          [detailCuacaLokasi].map((el,i) =>{
            return (
              <div key={i} className="w-full my-5 p-2 text-[#344e41] ring-2 ring-blue-500 bg-white rounded-md text-center font-semibold text-[15px]">
                <h2 className="text-center text-xl text-[#344e41]">
                  Prediksi cuaca {el.lokasi}
                </h2>
                <p className="my-3 text-center text-md text-[#344e41]">Deskripsi : {el.deskripsi}</p>
                <p className="my-3 text-center text-md text-[#344e41]">Kecepatan Angin : {el.kecepatan_angin} m/s</p>
                <p className="my-3 text-center text-md text-[#344e41]">Temperatur : {el.temperatur} <sup>0</sup>C</p>
              </div>
            )
          })
        }
        {/*//! input aadd lokasi */}
        <div className="relative mt-5">
            {/* inputGroup */}
            <form onSubmit={_handlePostLokasi} action="" autoComplete="off" className="flex justify-center items-center gap-2 flex-col min-[400px]:flex-row">
              <input type="text"
              ref={inputNamaLokasi}
              className="w-full relative px-3 py-2 caret-[#344e41] text-[13px] border-none outline-none rounded-md ring-1 ring-[#344e41] min-[400px]:w-auto" placeholder="Nama Lokasi" />
              <input type="text"
              ref={inputKodeLokasi}
              className="w-full relative px-3 py-2 caret-[#344e41] text-[13px] border-none outline-none rounded-md ring-1 ring-[#344e41] min-[400px]:w-[60px]" placeholder="Kode Lokasi" />

              <button
              disabled={isLoadingPostNewLokasi || isFetchingListLokasi  ? true : false}
              className={`w-full bg-blue-500 text-white border-0 rounded-md font-semibold p-2 text-[13px] min-[400px]:w-auto
              ${isLoadingPostNewLokasi || isFetchingListLokasi && 'opacity-50 cursor-not-allowed'}
              `}>
                Tambah Lokasi
              </button>
            </form>
        </div>

        {/*//! list lokasi */}
        <div className="relative w-full h-[300px]  mt-5 flex flex-col gap-3 overflow-x-hidden overflow-y-auto p-1">
          {
            isFetchingListLokasi ? <p className="text-center">isloading</p>:
            (isFetchedListLokasi) && lisLokasi.length == 0 ? <p className="text-center">data tidak ditemukan</p>
            :
            lisLokasi?.map((el)=>{
              return (
                <button key={el.id}
                onClick={()=>{
                  setdetailCurrentCuacaLokasi({
                    id:el.id,
                    title:el.nama_kota
                  })
                }}
                className={`w-full  p-2 text-[#344e41] ring-2 ring-blue-500  rounded-md text-center font-semibold text-[15px] flex flex-row items-center
                ${el.id == detailCurrentCuacaLokasi.id ?  'bg-blue-500' : 'bg-white'}
                `}>
                <p className="flex-1">
                {el.nama_kota}
                </p>
                <button
                onClick={(event)=>{
                  event.stopPropagation()
                  setIsOpenEdit({
                    status:true,
                    id:el.id,
                    title:el.nama_kota,
                    kode:el.kode_negara
                  })
                }}
                className="border-0 p-2 bg-yellow-200 rounded-md">
                      <FaPen className=""/>
                </button>
              </button>
              )
            })
          }


        </div>

      </section>
    </section>
    </>
  )
}

export default App
