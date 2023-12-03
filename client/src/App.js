import { useEffect, useState } from "react";
import axios from "axios";


function App() {

  const [Fulldata, setFullData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [checkedArray, setCheckedArray] = useState(Array(pageLimit).fill(false));
  const [viewModal, setViewModal] = useState(false);

  const [editIndex, setEditIndex] = useState(0);
  const [id, setId] = useState("0");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");


  const updatePagination = (fullData, pageNumber, pageLimit) => {
    let startPageNumber = pageLimit * (pageNumber - 1);
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

  let onDeleteSingle = (index) => {
    setFullData(Fulldata.filter(item => item.id !== paginatedData[index].id));
  }

  let onDeleteMultiple = (event) => {

    let idsToDelete = paginatedData.filter((id, index) => checkedArray[index]).map(item => item.id);;

    console.log(idsToDelete, "Delete this yo");

    setFullData(Fulldata.filter(item => !idsToDelete.includes(item.id)));

    setCheckedArray(Array(pageLimit).fill(false));
  }

  let onEditData = (index) => {

    setViewModal(true);

    setEditIndex(index);
    setName(paginatedData[index].name);
    setRole(paginatedData[index].role);
    setEmail(paginatedData[index].email);
    setId(paginatedData[index].id);
  }

  let onSubmitData = (event)=> {
    event.preventDefault();

    const newData = {
      id,
      name,
      email,
      role
    };

    

    // paginatedData[editIndex] = newData;

    const tempData = [...Fulldata];

    for(let i=0; i<tempData.length; i++) {

      if(tempData[i].id === newData.id) {
        tempData[i] = newData;
        break;
      }
    }

    setFullData(tempData);

    setEditIndex(0);
    setName("");
    setRole("");
    setEmail("");
    setId("0");

    setViewModal(false);
  }

  useEffect(() => {
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
                  <input onChange={(event) => {
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
                <tr class={`${checkedArray[index] ? checkedStyle : ""} bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}>
                  <td class="w-4 p-4">
                    <div class="flex items-center">
                      <input
                        onChange={(event) => {
                          console.log(event.target.checked);
                          setCheckedArray(prev => {
                            let temp = [...prev];
                            temp[index] = event.target.checked || false;
                            return temp;
                          })
                        }}
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
                    <button class="font-medium text-blue-600 dark:text-blue-500 hover:underline me-3" onClick={(event)=>{ onEditData(index) }} >Edit</button>
                    <button class="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={(event) => onDeleteSingle(index)}>Delete</button>
                  </td>
                </tr>
              )
            })}

          </tbody>
        </table>
        <nav class="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
          <span class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
            Showing <span class="font-semibold text-gray-900 dark:text-white">{(pageNo - 1) * pageLimit + 1}-{((pageNo - 1) * pageLimit) + paginatedData.length}</span> of <span class="font-semibold text-gray-900 dark:text-white">{Fulldata.length}</span>
          </span>
          <ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
              <button class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => setPageNo(prev => Math.max(prev - 1, 1))}>Previous</button>
            </li>

            <li>
              <a href="#" aria-current="page" class="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">{pageNo}</a>
            </li>
            {/* <li>
                <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
              </li> */}

            <li>
              <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => setPageNo(prev => Math.min(prev + 1, Math.ceil(Fulldata.length / pageLimit)))}>Next</a>
            </li>
          </ul>
        </nav>
      </div>

      <div id="authentication-modal" tabindex="-1" class={`${viewModal ? "" : "hidden"} flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)]`}>
        <div class="relative p-4 w-full max-w-md max-h-full">

          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">

            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Data
              </h3>
              <button type="button" onClick={(event)=>setViewModal(false)} class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>

            <div class="p-4 md:p-5">
              <form class="space-y-4" action="#" onSubmit={onSubmitData}>
                <div>
                  <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                  <input type="text" value={name} onInput={(event)=>setName(event.target.value)} name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Your Name" required />
                </div>
                <div>
                  <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                  <input type="email" value={email} onInput={(event)=>setEmail(event.target.value)} name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
                </div>
                <div>
                  <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                  <input type="text" value={role} onInput={(event)=>setRole(event.target.value)} name="role" id="role" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Your Role" required />
                </div>
                
                <button type="submit" class="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                  Confirm
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
