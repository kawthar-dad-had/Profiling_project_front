import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

// Données des utilisateurs avec IDs fixes
const initialUsers = [
  {
    id: 1, // ID fixe
    lastName: "Dupont",
    firstName: "Jean",
    age: 30,
    email: "jean.dupont@example.com",
    role: "Admin",
  },
  {
    id: 2, // ID fixe
    lastName: "Martin",
    firstName: "Marie",
    age: 25,
    email: "marie.martin@example.com",
    role: "User",
  },
  {
    id: 3, // ID fixe
    lastName: "Durand",
    firstName: "Paul",
    age: 35,
    email: "paul.durand@example.com",
    role: "Manager",
  },
  {
    id: 4, // ID fixe
    lastName: "Lemoine",
    firstName: "Sophie",
    age: 28,
    email: "sophie.lemoine@example.com",
    role: "User",
  },
  {
    id: 5, // ID fixe
    lastName: "Petit",
    firstName: "Luc",
    age: 40,
    email: "luc.petit@example.com",
    role: "Admin",
  },
];

function EditToolbar(props) {
  const { setRows, setRowModesModel, rows } = props;

  const handleClick = () => {
    const id = Math.max(...rows.map((row) => row.id)) + 1; // Générer un nouvel ID basé sur les IDs existants
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        lastName: "",
        firstName: "",
        age: "",
        email: "",
        role: "",
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "lastName" },
    }));
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
  const [users, setRows] = React.useState(initialUsers);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(users.filter((user) => user.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedUser = users.find((user) => user.id === id);
    if (editedUser.isNew) {
      setRows(users.filter((user) => user.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(users.map((user) => (user.id === newRow.id ? updatedRow : user)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: "lastName", headerName: "Nom", width: 180, editable: true },
    { field: "firstName", headerName: "Prénom", width: 180, editable: true },
    {
      field: "age",
      headerName: "Âge",
      type: "number",
      width: 100,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      editable: true,
    },
    {
      field: "role",
      headerName: "Rôle",
      width: 150,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

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
      {/* Titre avec icône */}
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
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel, rows: users },
          }}
        />
      </Box>
    </Box>
  );
}
