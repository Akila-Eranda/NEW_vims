// import React from "react";
// import IconButton from "@mui/material/IconButton";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import Divider from "@mui/material/Divider";
// import Typography from "@mui/material/Typography";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from '@mui/icons-material/Edit';
//
// // eslint-disable-next-line react/prop-types
// export default function ActionMenu({ row, deleteProduct, editProduct }) {
//   const [anchorEl, setAnchorEl] = React.useState(null);
//
//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//
//   const handleClose = () => {
//     setAnchorEl(null);
//   };
//
//   const handleDelete = (row) => {
//     deleteProduct(row);
//     handleClose()
//   }
//
//   const handleEdit = (row) => {
//     editProduct(row)
//     handleClose()
//   }
//
//   return (
//     <div>
//       <IconButton
//         aria-label="more"
//         aria-controls="long-menu"
//         aria-haspopup="true"
//         onClick={handleClick}
//         // size={size}
//       >
//         <MoreVertIcon />
//       </IconButton>
//
//       <Menu
//         id="menu"
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "center",
//         }}
//         transformOrigin={{
//           vertical: "top",
//           horizontal: "center",
//         }}
//       >
//         <MenuItem onClick={() => handleEdit(row)} >
//           <ListItemIcon>
//             <EditIcon fontSize="small" color="error" />
//           </ListItemIcon>
//           <Typography variant="inherit">Edit</Typography>
//         </MenuItem>
//         <MenuItem onClick={() => handleDelete(row)} >
//           <ListItemIcon>
//             <DeleteIcon fontSize="small" color="error" />
//           </ListItemIcon>
//           <Typography variant="inherit">Delete</Typography>
//         </MenuItem>
//       </Menu>
//     </div>
//   );
// }
