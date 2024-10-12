import React from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { styled } from "@mui/system";

const HeroSection = styled("div")`
  background-color: ${(props) => props.theme.palette.primary.main};
  color: ${(props) => props.theme.palette.primary.contrastText};
  padding: ${(props) => props.theme.spacing(8, 0, 6)};
`;

const FeaturedNFTCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Home: React.FC = () => {
  return (
    <>
      <HeroSection>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="inherit"
            gutterBottom
          >
            Welcome to FinityOne NFT
          </Typography>
          <Typography variant="h5" align="center" color="inherit" paragraph>
            Discover, create, and trade unique digital assets on the ONEFINITY
            network.
          </Typography>
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              href="/explore"
            >
              Explore NFTs
            </Button>
          </div>
        </Container>
      </HeroSection>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Typography
          component="h2"
          variant="h4"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Featured NFTs
        </Typography>
        <Grid container spacing={4}>
          {[1, 2, 3].map((card) => (
            <Grid item key={card} xs={12} sm={6} md={4}>
              <FeaturedNFTCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={`https://source.unsplash.com/random?nft&${card}`}
                  alt="Random NFT"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    NFT #{card}
                  </Typography>
                  <Typography>
                    This is a featured NFT on our platform. Click to view
                    details and place your bid.
                  </Typography>
                </CardContent>
              </FeaturedNFTCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Home;
