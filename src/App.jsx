import React,{useEffect} from "react"

function App() {

  // set title web
  useEffect(() => {
    document.title = 'Home'
  }, [])
  

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
            <form action="" className="flex justify-center items-center gap-2 flex-col min-[400px]:flex-row">
              <input type="text" className="w-full relative px-3 py-2 caret-[#344e41] text-[13px] border-none outline-none rounded-md ring-1 ring-[#344e41] min-[400px]:w-auto" placeholder="Nama Lokasi" />
              <button className="w-full bg-[#007f5f] text-white border-0 rounded-md font-semibold p-2 text-[13px] min-[400px]:w-auto">
                Tambah Lokasi
              </button>
            </form>
        </div>

        {/*//! list lokasi */}
        <div className="relative w-full h-[200px]  mt-5 flex flex-col gap-3 overflow-x-hidden overflow-y-auto p-1">
          {/* card lokasi */}
          <button className="w-full  p-2 text-[#344e41] ring-2 ring-[#52b788] bg-white rounded-md text-center font-semibold text-[15px]">
            Bogor

          </button>

        </div>

      </section>
    </section>
  )
}

export default App
