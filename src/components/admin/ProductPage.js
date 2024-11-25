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
  GridActionsCellItem,
  DataGrid,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

// Fonction pour récupérer les produits depuis le backend
const fetchProducts = async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Please log in first");
      return;
    }
    const response = await axios.get('http://localhost:8080/api/products', {
      headers: {
          Authorization: `Bearer ${token}`, // Ajoutez le token JWT ici
          'Content-Type': 'application/json',
      },
      withCredentials: true, // Nécessaire si "allowCredentials" est activé
  });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Fonction pour ajouter un produit
const createProduct = async (product, imageFile) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("Please log in first");
    return;
  }

  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("price", product.price);
  formData.append("expirationDate", product.expirationDate);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    await axios.post("http://localhost:8080/api/products", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    alert("Product created successfully!");
  } catch (error) {
    console.error("Error creating product:", error.response ? error.response.data : error.message);
  }
};

// Fonction pour supprimer un produit
const deleteProduct = async (id) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("Please log in first");
    return;
  }

  try {
    await axios.delete(`http://localhost:8080/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error.response ? error.response.data : error.message);
  }
};

// Fonction pour mettre à jour un produit
const updateProduct = async (id, product, imageFile) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("Please log in first");
    return;
  }

  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("price", product.price);
  formData.append("expirationDate", product.expirationDate);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    await axios.put(`http://localhost:8080/api/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Le token doit être valide
        "Content-Type": "multipart/form-data", // Correct pour l'envoi d'un FormData
      },
    });
    
    
    alert("Product updated successfully!");
  } catch (error) {
    console.error("Error updating product:", error.response ? error.response.data : error.message);
  }
};

// Fonction de la barre d'outils pour ajouter un produit
function EditToolbar(props) {
  const { openAddDialog, setOpenAddDialog } = props;

  const handleClick = () => {
    setOpenAddDialog(true); // Open the add product dialog
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
  const [products, setRows] = React.useState([]); // Initializing as empty array
  const [openAddDialog, setOpenAddDialog] = React.useState(false); // Manage add product dialog state
  const [openEditDialog, setOpenEditDialog] = React.useState(false); // Manage edit product dialog state
  const [newProduct, setNewProduct] = React.useState({
    name: "",
    price: "",
    expirationDate: "",
  });
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null); // State to store selected image file for new product

  // Fetch products when the component mounts
  React.useEffect(() => {
    const loadProducts = async () => {
      const productsFromBackend = await fetchProducts();
      setRows(productsFromBackend); // Set the products state with fetched data
    };

    loadProducts();
  }, []); // Empty dependency array means this runs once after the initial render

  // Add Product
  const handleAddProduct = async () => {
    await createProduct(newProduct, imageFile); // Pass imageFile to createProduct function
    const updatedProducts = await fetchProducts();
    setRows(updatedProducts);
    setOpenAddDialog(false);
    setNewProduct({ name: "", price: "", expirationDate: "" });
    setImageFile(null); // Reset imageFile after adding product
  };

  // Edit Product Logic
  const handleEditClick = (id) => async () => {
    const productToEdit = products.find((product) => product.id === id);
    setEditingProduct(productToEdit);
    setOpenEditDialog(true); // Open dialog to edit product
  };

  // Update Product Logic
  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, editingProduct, imageFile);
    const updatedProducts = await fetchProducts();
    setRows(updatedProducts);
    setOpenEditDialog(false);
  };

  // Handle Product Deletion
  const handleDeleteClick = (id) => async () => {
    await deleteProduct(id);
    const updatedProducts = await fetchProducts();
    setRows(updatedProducts);
  };

  // Handle form field changes for add product
  const handleNewProductChange = (event) => {
    const { name, value } = event.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  // Handle form field changes for edit product
  const handleEditProductChange = (event) => {
    const { name, value } = event.target;
    setEditingProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Handle image file selection for new product
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Columns configuration for DataGrid
  const columns = [
    { field: "name", headerName: "Nom du produit", width: 200, editable: true },
    {
      field: "price",
      headerName: "Prix",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "expirationDate",
      headerName: "Expiration Date",
      width: 100,
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
            onClick={handleEditClick(id)} // Trigger editing mode
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)} // Trigger delete
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ margin: 3 }}>
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
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { openAddDialog, setOpenAddDialog },
          }}
        />
      </Box>

      {/* Dialog for adding a product */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Product Name"
            name="name"
            value={newProduct.name}
            onChange={handleNewProductChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            value={newProduct.price}
            onChange={handleNewProductChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Expiration Date"
            name="expirationDate"
            value={newProduct.expirationDate}
            onChange={handleNewProductChange}
            type="date"
            fullWidth
            margin="normal"
          />
          {/* New field to upload image */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleAddProduct} startIcon={<SaveIcon />}>
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for editing a product */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Product Name"
            name="name"
            value={editingProduct?.name || ""}
            onChange={handleEditProductChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            value={editingProduct?.price || ""}
            onChange={handleEditProductChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Expiration Date"
            name="expirationDate"
            value={editingProduct?.expirationDate || ""}
            onChange={handleEditProductChange}
            type="date"
            fullWidth
            margin="normal"
          />
          {/* Option to upload new image for editing */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleUpdateProduct} startIcon={<SaveIcon />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
