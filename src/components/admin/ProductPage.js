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
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("frontend-service"); // Initialize tracer

// Fetch products from the backend
const fetchProducts = async () => {
  const span = tracer.startSpan("fetchProducts"); // Trace name
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Please log in first");
      span.setStatus({ code: 2, message: "No token found" }); // Error status
      return [];
    }

    span.setAttribute("user.action", "fetch_products"); // Custom attribute
    span.setAttribute("auth.token", token ? "present" : "absent"); // Token presence

    const response = await axios.get("http://localhost:8080/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    span.setAttribute("http.status_code", response.status); // HTTP status code
    span.setAttribute("http.url", "http://localhost:8080/api/products"); // URL called
    return response.data;
  } catch (error) {
    span.setStatus({ code: 2, message: error.message });
    console.error("Error fetching products:", error);
    return [];
  } finally {
    span.end(); // End the trace
  }
};

// Add a new product
const createProduct = async (product, imageFile) => {
  const span = tracer.startSpan("createProduct");
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Please log in first");
      span.setStatus({ code: 2, message: "No token found" });
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("expirationDate", product.expirationDate);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    span.setAttribute("user.action", "create_product");
    span.setAttribute("product.name", product.name);

    await axios.post("http://localhost:8080/api/products", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    span.setStatus({ code: 1, message: "Product created successfully" }); // Success
    alert("Product created successfully!");
  } catch (error) {
    span.setStatus({ code: 2, message: error.message });
    console.error("Error creating product:", error);
  } finally {
    span.end();
  }
};

// Delete a product
const deleteProduct = async (id) => {
  const span = tracer.startSpan("deleteProduct");
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Please log in first");
      span.setStatus({ code: 2, message: "No token found" });
      return;
    }

    span.setAttribute("user.action", "delete_product");
    span.setAttribute("product.id", id);

    await axios.delete(`http://localhost:8080/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    span.setStatus({ code: 1, message: "Product deleted successfully" });
    alert("Product deleted successfully!");
  } catch (error) {
    span.setStatus({ code: 2, message: error.message });
    console.error("Error deleting product:", error);
  } finally {
    span.end();
  }
};

// Update a product
const updateProduct = async (id, product, imageFile) => {
  const span = tracer.startSpan("updateProduct");
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Please log in first");
      span.setStatus({ code: 2, message: "No token found" });
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("expirationDate", product.expirationDate);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    span.setAttribute("user.action", "update_product");
    span.setAttribute("product.id", id);

    await axios.put(`http://localhost:8080/api/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    span.setStatus({ code: 1, message: "Product updated successfully" });
    alert("Product updated successfully!");
  } catch (error) {
    span.setStatus({ code: 2, message: error.message });
    console.error("Error updating product:", error);
  } finally {
    span.end();
  }
};

// Toolbar for adding products
function EditToolbar(props) {
  const { openAddDialog, setOpenAddDialog } = props;

  const handleClick = () => {
    setOpenAddDialog(true);
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Product
      </Button>
    </GridToolbarContainer>
  );
}

// Main ProductPage component
export function ProductPage() {
  const [products, setRows] = React.useState([]);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [newProduct, setNewProduct] = React.useState({
    name: "",
    price: "",
    expirationDate: "",
  });
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null);

  React.useEffect(() => {
    const loadProducts = async () => {
      const productsFromBackend = await fetchProducts();
      setRows(productsFromBackend);
    };

    loadProducts();
  }, []);

  const handleAddProduct = async () => {
    await createProduct(newProduct, imageFile);
    const updatedProducts = await fetchProducts();
    setRows(updatedProducts);
    setOpenAddDialog(false);
    setNewProduct({ name: "", price: "", expirationDate: "" });
    setImageFile(null);
  };

  const handleEditClick = (id) => async () => {
    const productToEdit = products.find((product) => product.id === id);
    setEditingProduct(productToEdit);
    setOpenEditDialog(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, editingProduct, imageFile);
    const updatedProducts = await fetchProducts();
    setRows(updatedProducts);
    setOpenEditDialog(false);
  };

  const handleDeleteClick = (id) => async () => {
    await deleteProduct(id);
    const updatedProducts = await fetchProducts();
    setRows(updatedProducts);
  };

  const handleNewProductChange = (event) => {
    const { name, value } = event.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleEditProductChange = (event) => {
    const { name, value } = event.target;
    setEditingProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const columns = [
    { field: "name", headerName: "Nom du produit", width: 200 },
    { field: "price", headerName: "Prix", type: "number", width: 100 },
    { field: "expirationDate", headerName: "Expiration Date", width: 100 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={handleEditClick(id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ margin: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <ProductionQuantityLimitsIcon sx={{ marginRight: 1 }} />
        <h2>Product Management</h2>
      </Box>

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={products}
          columns={columns}
          slots={{ toolbar: EditToolbar }}
          slotProps={{ toolbar: { openAddDialog, setOpenAddDialog } }}
        />
      </Box>

      {/* Add Product Dialog */}
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

      {/* Edit Product Dialog */}
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
