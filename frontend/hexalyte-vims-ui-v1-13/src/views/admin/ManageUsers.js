import { useAuth } from "context/AuthContext";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import handleUserLogout from "api/logout";
import checkToken from "api/checkToken";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";
import UserEditModal from "components/Modal/UserEditModel";
import UserAddModal from "components/Modal/UserAddModel";
import UserInfoModel from "components/Modal/UserInfoModal";
import { createAxiosInstance } from "api/axiosInstance";
import { getStoredTokens } from "auth/tokenService";


// const BASE_URL = process.env.REACT_APP_BASE_URL;

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openEditUserModal, setOpenEditUserModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("All");
  const [openModal, setOpenModal] = useState(null);
  const [currUserRole, setCurrUserRole] = useState(null);


  const { setAuth } = useAuth();
  const history = useHistory();


  useEffect(() => {
    // const sessionUser = JSON.parse(sessionStorage.getItem('user'))?.user;

    const sessionUser = getStoredTokens?.user

    if (sessionUser) {
      setCurrUserRole(sessionUser.role);
    }
  },);

  // Example user data structure - replace with your actual API call
  async function loadUsers() {
    setIsLoading(true);
    try {

      // const userData = await axios.get(`${BASE_URL}user`, { withCredentials: true });
      const api = createAxiosInstance();
      const userData = await api.get(`user`)
      // const userData = await axios.get(`${BASE_URL}user`, { withCredentials: true });
      // console.log(userData.data.users);


      if (userData.status === 200) {
        setUsers(() => [...userData.data.users]);
        setIsLoading(false)
      }

    } catch (error) {
      console.error("Error loading users:", error);
      setIsLoading(false);

      // if (error.status === 500 && error.response?.data?.error.includes("Please authenticate")) {
      //   sessionStorage.clear();
      //   history.push('/auth/login');
      // }
    }
  }

  async function deleteUser(userRow) {
    try {
      Swal.fire({
        title: "Confirm Delete",
        text: `Are you sure to delete the User: #${userRow.id} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          async function deleteUserRequest(user) {
            try {
              // const deleteReq = await axios.delete(
              //   `${BASE_URL}category/${category.CategoryID}`, { withCredentials: true }
              // );
              const updateBody = {
                deleted: "1",
              }
              // const res = await axios.put(`${BASE_URL}user/${user.id}`, updateBody, { withCredentials: true });
              // console.log(res)
              // const res = await axios.put(`${BASE_URL}user/${user.id}`, updateBody, { withCredentials: true });
              // console.log(res);

              const api = createAxiosInstance()
              const res = await api.put(`user/${user.id}`, updateBody)

              if (res.status === 200) {
                sessionStorage.setItem('user', JSON.stringify(res.data.user))
                setAuth(() => true);
                loadUsers()
              }
            } catch (error) {
              console.log(error);
            }
          }

          deleteUserRequest(userRow);
          loadUsers()
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function editUser(userData) {

    const updatedData = {
      firstname: userData.firstname,
      lastname: userData.lastname,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      active: userData.active,
      birthday: userData.birthday,
      gender: userData.gender,

    }
    // console.log(updatedData.role);


    // const res = await axios.put(`${BASE_URL}user/${userData.id}`, updatedData, { withCredentials: true });
    // const res = await axios.put(`${BASE_URL}user/${userData.id}`, updatedData, { withCredentials: true });

    const api = createAxiosInstance()
    const res = await api.put(`user/${userData.id}`, updatedData)

    if (res.status === 200) {
      setOpenEditUserModal(() => false);
      Swal.fire({
        title: "Success",
        text: "User Details Updated successfully",
        icon: "success"
      })
      // sessionStorage.setItem('user', JSON.stringify(res.data.user))
      // console.log(res.data);
      // console.log(sessionStorage.getItem('user'))
      setAuth(() => true);
      loadUsers();
    } else {
      Swal.fire({
        title: "Error",
        text: "User Details Update Failed",
        icon: "error"
      })
    }
    // console.log(res)
  }

  // Filter users based on search query and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "All" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  useEffect(() => {
    // if (!checkToken()) {
    //   handleUserLogout().then(() => setAuth(() => false)).then(() => history.push("/auth/login"));
    //   return;
    // }

    loadUsers();
  }, []);

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f9fafb",
        borderRadius: "8px 8px 0 0",
        border: "none",
        minHeight: "56px",
      },
    },
    headCells: {
      style: {
        color: "#4b5563",
        fontSize: "14px",
        fontWeight: "600",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        minHeight: "60px",
        borderBottom: "1px solid #f3f4f6",
        "&:last-of-type": {
          borderBottom: "none",
        },
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f3f4f6",
        cursor: "pointer",
        transitionDuration: "0.15s",
        transitionProperty: "background-color",
        borderBottomColor: "#f3f4f6",
        outlineColor: "transparent",
      },
    },
    pagination: {
      style: {
        border: "none",
        backgroundColor: "#fff",
        borderRadius: "0 0 8px 8px",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
    },
  };

  const StatusBadge = ({ status }) => {
    let badgeClass = "px-3 py-1 rounded-full text-xs font-medium ";

    if (status.toLowerCase() === "active") {
      badgeClass += "bg-green-100 text-green-800";
    } else if (status.toLowerCase() === "inactive") {
      badgeClass += "bg-gray-100 text-gray-800";
    } else if (status.toLowerCase() === "suspended") {
      badgeClass += "bg-red-100 text-red-800";
    } else {
      badgeClass += "bg-blue-100 text-blue-800";
    }

    return <span className={badgeClass}>{status}</span>;
  };

  const RoleBadge = ({ role }) => {
    let badgeClass = "px-3 py-1 rounded-full text-xs font-medium ";

    if (role === "Administrator") {
      badgeClass += "bg-purple-100 text-purple-800";
    } else if (role === "Manager") {
      badgeClass += "bg-blue-100 text-blue-800";
    } else if (role === "Staff") {
      badgeClass += "bg-indigo-100 text-indigo-800";
    } else {
      badgeClass += "bg-gray-100 text-gray-800";
    }

    return <span className={badgeClass}>{role}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
      width: "80px",
      style: {
        fontWeight: 600,
        color: "#1f2937",
      },
    },
    {
      name: "User",
      cell: row => (
        <div className="flex items-center py-2">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            {row.firstname.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{row.firstname} {row.lastname} </div>
            <div className="text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => a.fullName.localeCompare(b.fullName),
      // grow: 2,
    },
    {
      name: "Username",
      selector: row => row.username,
      sortable: true,
      style: {
        color: "#6b7280",
      },
    },
    // {
    //   name: "Department",
    //   selector: row => row.department,
    //   sortable: true,
    //   style: {
    //     color: "#6b7280",
    //   },
    // },
    {
      name: "Role",
      selector: row => <RoleBadge role={row.role} />,
      sortable: true,
      sortFunction: (a, b) => a.role.localeCompare(b.role),
    },
    // {
    //   name: "Status",
    //   selector: row => <StatusBadge status={row.active} />,
    //   sortable: true,
    //   sortFunction: (a, b) => a.status.localeCompare(b.status),
    // },
    // {
    //   name: "Last Login",
    //   selector: row => formatDate(row.lastLogin),
    //   sortable: true,
    //   sortFunction: (a, b) => new Date(a.lastLogin) - new Date(b.lastLogin),
    //   style: {
    //     color: "#6b7280",
    //   },
    // },
    {
      name: "Actions",
      cell: row => (
        <div className="flex space-x-2">
          <button
            className="bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
            onClick={() => setOpenEditUserModal(row)}
            title="Edit User"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          {/* <button
            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              deleteUser(row);
            }}
            title="Delete User"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button> */}
        </div>
      ),
      button: `true`,
      width: "120px",
    },
  ];

  // User roles for filter dropdown
  const userRoles = ["All", "user", "admin"];

  return (
    <>
      <div className="w-full min-h-screen p-6">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage user accounts and permissions
              </p>
            </div>
            <button
              onClick={() => setOpenAddUserModal(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New User
            </button>
            {currUserRole === "admin" && (
              <button
                onClick={() => setOpenAddUserModal(true)}
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New User
              </button>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search users by name, email, or username"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  {userRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <button
                  onClick={loadUsers}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            {/* User Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">{users.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Active Users</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">
                      {users.filter(user => user.status === "Active").length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-purple-100">
                    <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">User Roles</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">
                      {new Set(users.map(user => user.role)).size}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

          </div>



          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredUsers}
              customStyles={customStyles}
              onRowClicked={(row) => setOpenModal(row)}
              highlightOnHover
              pointerOnHover
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
              progressPending={isLoading}
              progressComponent={
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }
              noDataComponent={
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-500">No users found</p>
                  <p className="mt-1 text-sm text-gray-400">Try adjusting your search or add a new user</p>
                </div>
              }
            />
          </div>


        </div>
      </div>

      {/* Add User Modal would go here */}
      {/* Edit User Modal would go here */}



      {
        openEditUserModal ? <UserEditModal setOpenModal={setOpenEditUserModal} userDataInfo={openEditUserModal} editUser={editUser} /> : null
      }

      {openModal && (
        <UserInfoModel setOpenModal={setOpenModal} userInfoModel={openModal} />
      )}

      {
        openAddUserModal ? <UserAddModal setOpenModal={setOpenAddUserModal} loadUserData={loadUsers} /> : null
      }

    </>
  );
}

export default ManageUsers;