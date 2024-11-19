import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

// Données des produits avec IDs fixes
const initialProducts = [
  {
    id: 1,
    name: "Produit A",
    category: "Catégorie 1",
    price: 50,
    stock: 200,
    supplier: "Fournisseur A",
  },
  {
    id: 2,
    name: "Produit B",
    category: "Catégorie 2",
    price: 30,
    stock: 150,
    supplier: "Fournisseur B",
  },
  {
    id: 3,
    name: "Produit C",
    category: "Catégorie 3",
    price: 70,
    stock: 100,
    supplier: "Fournisseur C",
  },
  {
    id: 4,
    name: "Produit D",
    category: "Catégorie 1",
    price: 40,
    stock: 250,
    supplier: "Fournisseur A",
  },
  {
    id: 5,
    name: "Produit E",
    category: "Catégorie 2",
    price: 60,
    stock: 300,
    supplier: "Fournisseur B",
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
        name: "",
        category: "",
        price: "",
        stock: "",
        supplier: "",
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Product
      </Button>
    </GridToolbarContainer>
  );
}

export function ProductPage() {
  const [products, setRows] = React.useState(initialProducts);
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
    setRows(products.filter((product) => product.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedProduct = products.find((product) => product.id === id);
    if (editedProduct.isNew) {
      setRows(products.filter((product) => product.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(
      products.map((product) =>
        product.id === newRow.id ? updatedRow : product
      )
    );
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: "name", headerName: "Nom du produit", width: 200, editable: true },
    { field: "category", headerName: "Catégorie", width: 150, editable: true },
    {
      field: "price",
      headerName: "Prix",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "supplier",
      headerName: "Fournisseur",
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
        <ProductionQuantityLimitsIcon sx={{ marginRight: 1 }} />
        <h2>Product Management</h2>
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
          rows={products}
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
            toolbar: { setRows, setRowModesModel, rows: products },
          }}
        />
      </Box>
    </Box>
  );
}
