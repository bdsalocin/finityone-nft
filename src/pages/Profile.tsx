// import React, { useState, useEffect } from "react";
// import { Container, Typography, Grid, Box, Button } from "@mui/material";
// import NFTCard from "../components/NFTCard";
// import { NFT } from "../types";
// // import blockchainService from "../services/blockchainService";

// const Profile: React.FC = () => {
//   const [address, setAddress] = useState<string | null>(null);
//   const [nfts, setNfts] = useState<NFT[]>([]);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const provider = await blockchainService.connectWallet();
//         const signer = provider.getSigner();
//         const address = await signer.getAddress();
//         setAddress(address);

//         // TODO: Fetch user's NFTs from the blockchain or your backend
//         // This is a placeholder. Replace with actual data fetching logic
//         const mockNFTs: NFT[] = [
//           {
//             id: "1",
//             name: "My NFT 1",
//             description: "This is my first NFT",
//             image: "https://via.placeholder.com/300",
//             price: "0.1",
//           },
//           {
//             id: "2",
//             name: "My NFT 2",
//             description: "This is my second NFT",
//             image: "https://via.placeholder.com/300",
//             price: "0.2",
//           },
//         ];
//         setNfts(mockNFTs);
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       }
//     };

//     fetchProfile();
//   }, []);

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" component="h1" gutterBottom>
//         My Profile
//       </Typography>
//       {address ? (
//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h6" gutterBottom>
//             Wallet Address:
//           </Typography>
//           <Typography variant="body1">{address}</Typography>
//         </Box>
//       ) : (
//         <Button
//           variant="contained"
//           onClick={() => blockchainService.connectWallet()}
//         >
//           Connect Wallet
//         </Button>
//       )}
//       <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
//         My NFTs
//       </Typography>
//       <Grid container spacing={4}>
//         {nfts.map((nft) => (
//           <Grid item key={nft.id} xs={12} sm={6} md={4}>
//             <NFTCard nft={nft} />
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default Profile;

export {};
