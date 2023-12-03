import { useEffect, useState } from "react";
import axios from "axios";


function App() {

  const [Fulldata, setFullData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [checkedArray, setCheckedArray] = useState(Array(pageLimit).fill(false));


  const updatePagination = (fullData, pageNumber, pageLimit)=> {
    let startPageNumber =  pageLimit*(pageNumber-1);
    let endPageNumber = startPageNumber + pageLimit;
    setPaginatedData(fullData.slice(startPageNumber, endPageNumber));
  } 

  useEffect(() => {

    axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
      .then(res => {
        console.log(res.data, "This is the response");
        setFullData(res.data);
        updatePagination(res.data, pageNo, pageLimit);
      })
      .catch(err => {
        console.log(err, "This is the error");
      })

  }, []);

  let onDeleteSingle = (index)=>{
    setFullData(Fulldata.filter(item => item.id !== paginatedData[index].id));
  } 

  let onDeleteMultiple = (event)=> {
    
    let idsToDelete = paginatedData.filter((id, index) => checkedArray[index]).map(item => item.id);;

    console.log(idsToDelete, "Delete this yo");
   
    setFullData(Fulldata.filter(item => !idsToDelete.includes(item.id)));

    setCheckedArray(Array(pageLimit).fill(false));
  }

  useEffect(()=>{
    updatePagination(Fulldata, pageNo, pageLimit);
  }, [Fulldata, pageLimit, pageNo]);

  const checkedStyle = "dark:bg-gray-600";

  return (
    <div className="p-10 text-3xl bg-black">


      
        <div class="flex mb-5">

          <div class="flex gap-2 w-full">
            <input type="search" id="search-dropdown" class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-s-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Enter Value" />
            <button onClick={onDeleteMultiple} disabled={checkedArray.every(element => element === false)} type="submit" class="p-2.5 text-sm font-medium h-full text-white bg-red-400 rounded-e-lg border border-blue-700 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Delete
            </button>
          </div>
        </div>


        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="p-4">
                  <div class="flex items-center">
                    <input onChange={(event)=>{
                        setCheckedArray(Array(pageLimit).fill(event.target.checked || false))
                    }} id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label for="checkbox-all-search" class="sr-only">checkbox</label>
                  </div>
                </th>
                <th scope="col" class="px-6 py-3">
                  ID
                </th>
                <th scope="col" class="px-6 py-3">
                  Name
                </th>
                <th scope="col" class="px-6 py-3">
                  Email
                </th>
                <th scope="col" class="px-6 py-3">
                  Role
                </th>
                <th scope="col" class="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((elm, index) => {

                return (
                  <tr class={`${checkedArray[index]? checkedStyle : ""} bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}>
                    <td class="w-4 p-4">
                      <div class="flex items-center">
                        <input 
                          onChange={(event)=>{
                            console.log(event.target.checked);
                            setCheckedArray(prev=>{ 
                              let temp = [...prev];
                              temp[index] = event.target.checked || false; 
                              return temp;
                            })
                          } } 
                          checked={checkedArray[index]} 
                          id="checkbox-table-search-1" 
                          type="checkbox" 
                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                      </div>
                    </td>
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {elm.id}
                    </th>
                    <td class="px-6 py-4">
                    {elm.name}
                    </td>
                    <td class="px-6 py-4">
                    {elm.email}
                    </td>
                    <td class="px-6 py-4">
                    {elm.role}
                    </td>
                    <td class="px-6 py-4">
                      <button class="font-medium text-blue-600 dark:text-blue-500 hover:underline me-3">Edit</button>
                      <button class="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={(event)=>onDeleteSingle(index)}>Delete</button>
                    </td>
                  </tr>
                )
              })}
      
            </tbody>
          </table>
          <nav class="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
              Showing <span class="font-semibold text-gray-900 dark:text-white">{(pageNo-1)*pageLimit+1}-{((pageNo-1)*pageLimit)+ paginatedData.length}</span> of <span class="font-semibold text-gray-900 dark:text-white">{Fulldata.length}</span>
            </span>
            <ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
              <li>
                <button class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={()=> setPageNo(prev=> Math.max(prev-1, 1))}>Previous</button>
              </li>
        
              <li>
                <a href="#" aria-current="page" class="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">{pageNo}</a>
              </li>
              {/* <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
              </li> */}
         
              <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={()=> setPageNo(prev=> Math.min(prev+1, Math.ceil(Fulldata.length/pageLimit)))}>Next</a>
              </li>
            </ul>
          </nav>
        </div>



    </div>
  );
}

export default App;
