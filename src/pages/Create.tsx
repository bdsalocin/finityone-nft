// import React, { useState } from "react";
// import { Container, Typography, TextField, Button, Box } from "@mui/material";
// import { styled } from "@mui/system";
// // import blockchainService from "../services/blockchainService";

// const Input = styled("input")({
//   display: "none",
// });

// const Create: React.FC = () => {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState<File | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setFile(event.target.files[0]);
//     }
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!file) return;

//     try {
//       // Connect wallet
//       await blockchainService.connectWallet();

//       // TODO: Implement NFT creation logic
//       // This would involve:
//       // 1. Uploading the file to IPFS
//       // 2. Creating metadata and uploading to IPFS
//       // 3. Minting the NFT on the blockchain
//       console.log("Creating NFT:", { name, description, file });

//       // Reset form
//       setName("");
//       setDescription("");
//       setFile(null);

//       alert("NFT created successfully!");
//     } catch (error) {
//       console.error("Error creating NFT:", error);
//       alert("Failed to create NFT. Please try again.");
//     }
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" component="h1" gutterBottom>
//         Create New NFT
//       </Typography>
//       <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           id="name"
//           label="NFT Name"
//           name="name"
//           autoFocus
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           name="description"
//           label="Description"
//           id="description"
//           multiline
//           rows={4}
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//         <label htmlFor="contained-button-file">
//           <Input
//             accept="image/*"
//             id="contained-button-file"
//             multiple
//             type="file"
//             onChange={handleFileChange}
//           />
//           <Button
//             variant="outlined"
//             component="span"
//             fullWidth
//             sx={{ mt: 2, mb: 2 }}
//           >
//             Upload Image
//           </Button>
//         </label>
//         {file && (
//           <Typography variant="body2" sx={{ mb: 2 }}>
//             Selected file: {file.name}
//           </Typography>
//         )}
//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           sx={{ mt: 3, mb: 2 }}
//         >
//           Create NFT
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default Create;

export {};
