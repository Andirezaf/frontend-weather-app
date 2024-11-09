import React,{useEffect, useState,useRef} from "react"

// import utils
import { useQuery,useMutation,useQueryClient} from "@tanstack/react-query"

function App() {
  let queryClient = useQueryClient()

  // state nama input nama lokasi
  let inputNamaLokasi = useRef()
  // state nama input kode lokasi
  let inputKodeLokasi = useRef()
  // STATE LIST LOKASI
  let [lisLokasi,setListLokasi] = useState([])


  // set title web
  useEffect(() => {
    document.title = 'Home'
  }, [])


  //! query get lokasi
  const {isFetching:isFetchingListLokasi,isFetched:isFetchedListLokasi} = useQuery({
    queryKey:['getLokasi'],
    queryFn:()=>{
      return fetch('https://887c-2a09-bac5-3a07-15f-00-23-220.ngrok-free.app/api/lokasi',{
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

  //! mutation tambah lokasi
  const {mutateAsync,isLoading:isLoadingPostNewLokasi,isError:isErrorPostNewLokasi} = useMutation({
    mutationFn(dataLokasiBaru){
      return fetch('https://887c-2a09-bac5-3a07-15f-00-23-220.ngrok-free.app/api/lokasi',{
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


  //! handle post lokasi 
  const _handlePostLokasi = async (event)=>{
    event.preventDefault()
    try{
      console.log(inputNamaLokasi.current.value)
      await mutateAsync({
        nama_kota:inputNamaLokasi.current.value,
        kode_negara:inputKodeLokasi.current.value
      })
    }
    catch(err){
      console.log(err)
    }
  }

  return (
    <section className="relative w-full h-[100vh]  overflow-x-hidden overflow-y-auto p-5 bg-[#ade8f4]/50 flex justify-center items-center">
      {/*//! container */}
      <section className="relative w-[800px] ">
        {/*//! TITLE */}
        <h2 className="text-center text-3xl text-[#344e41] font-bold">
          Aplikasi Cuaca
        </h2>

        {/*//! input search */}
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
              disabled={isLoadingPostNewLokasi || isFetchingListLokasi ? true : false}
              className={`w-full bg-[#007f5f] text-white border-0 rounded-md font-semibold p-2 text-[13px] min-[400px]:w-auto
              ${isLoadingPostNewLokasi || isFetchingListLokasi && 'opacity-50 cursor-not-allowed'}
              `}>
                Tambah Lokasi
              </button>
            </form>
        </div>

        {/*//! list lokasi */}
        <div className="relative w-full h-[200px]  mt-5 flex flex-col gap-3 overflow-x-hidden overflow-y-auto p-1">
          {
            isFetchingListLokasi ? <p className="text-center">isloading</p>:
            (isFetchedListLokasi) && lisLokasi.length == 0 ? <p className="text-center">data tidak ditemukan</p>

            :
            lisLokasi?.map((el)=>{
              return (
                <button key={el.id} className="w-full  p-2 text-[#344e41] ring-2 ring-[#52b788] bg-white rounded-md text-center font-semibold text-[15px]">
                {el.nama_kota}
              </button>
              )
            })
           
          }
        

        </div>

      </section>
    </section>
  )
}

export default App
