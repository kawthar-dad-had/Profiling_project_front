import * as React from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

// Rest of the code remains the same as in the previous artifact

// Fetch Users from Backend
const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Please log in first");
      return [];
    }
    const response = await axios.get('http://localhost:8080/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Create User
const createUser = async (user) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("Please log in first");
    return null;
  }

  try {
    const response = await axios.post("http://localhost:8080/api/users", user, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    alert("User created successfully!");
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error.response ? error.response.data : error.message);
    return null;
  }
};

// Update User
const updateUser = async (id, user) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("Please log in first");
    return null;
  }

  try {
    const response = await axios.put(`http://localhost:8080/api/users/${id}`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    alert("User updated successfully!");
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error.response ? error.response.data : error.message);
    return null;
  }
};

// Delete User
const deleteUser = async (id) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("Please log in first");
    return;
  }

  try {
    await axios.delete(`http://localhost:8080/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("User deleted successfully!");
  } catch (error) {
    console.error("Error deleting user:", error.response ? error.response.data : error.message);
  }
};

// Toolbar Component
function EditToolbar(props) {
  const { openAddDialog, setOpenAddDialog } = props;

  const handleClick = () => {
    setOpenAddDialog(true);
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add User
      </Button>
    </GridToolbarContainer>
  );
}

export function UserPage() {
  const [users, setUsers] = React.useState([]);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [newUser, setNewUser] = React.useState({
    name: "",
    age: "",
    email: "",
    password: "",
  });
  const [editingUser, setEditingUser] = React.useState(null);

  // Fetch users when component mounts
  React.useEffect(() => {
    const loadUsers = async () => {
      const usersFromBackend = await fetchUsers();
      setUsers(usersFromBackend);
    };

    loadUsers();
  }, []);

  // Add User
  const handleAddUser = async () => {
    const createdUser = await createUser(newUser);
    if (createdUser) {
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
      setOpenAddDialog(false);
      setNewUser({ name: "", age: "", email: "", password: "" });
    }
  };

  // Edit User Logic
  const handleEditClick = (id) => async () => {
    const userToEdit = users.find((user) => user.id === id);
    setEditingUser(userToEdit);
    setOpenEditDialog(true);
  };

  // Update User Logic
  const handleUpdateUser = async () => {
    if (!editingUser) return;
    const updatedUser = await updateUser(editingUser.id, editingUser);
    if (updatedUser) {
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
      setOpenEditDialog(false);
    }
  };

  // Handle Product Deletion
  const handleDeleteClick = (id) => async () => {
    await deleteUser(id);
    const updatedUsers = await fetchUsers();
    setUsers(updatedUsers);
  };

  // Handle form field changes for add user
  const handleNewUserChange = (event) => {
    const { name, value } = event.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  // Handle form field changes for edit user
  const handleEditUserChange = (event) => {
    const { name, value } = event.target;
    setEditingUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Columns configuration for DataGrid
  const columns = [
    { field: "name", headerName: "Name", width: 200, editable: true },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ margin: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <PersonAddIcon sx={{ marginRight: 1 }} />
        <h2>User Management</h2>
      </Box>

      <Box
        sx={{
          height: 500,
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { openAddDialog, setOpenAddDialog },
          }}
        />
      </Box>

      {/* Dialog for adding a user */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={newUser.name}
            onChange={handleNewUserChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Age"
            name="age"
            value={newUser.age}
            onChange={handleNewUserChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={newUser.email}
            onChange={handleNewUserChange}
            type="email"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            value={newUser.password}
            onChange={handleNewUserChange}
            type="password"
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleAddUser} startIcon={<SaveIcon />}>
            Add User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for editing a user */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={editingUser?.name || ""}
            onChange={handleEditUserChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Age"
            name="age"
            value={editingUser?.age || ""}
            onChange={handleEditUserChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={editingUser?.email || ""}
            onChange={handleEditUserChange}
            type="email"
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleUpdateUser} startIcon={<SaveIcon />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}