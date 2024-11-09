import React,{useEffect} from "react"

function App() {

  // set title web
  useEffect(() => {
    document.title = 'Home'
  }, [])
  

  return (
    <section className="relative w-full h-[100vh]  overflow-x-hidden overflow-y-auto p-5 bg-[#ade8f4] flex justify-center items-center">
      {/*//! container */}
      <section className="max-w-[800px] border-2 border-red-500">

      </section>
    </section>
  )
}

export default App
