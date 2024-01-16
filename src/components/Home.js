import React from "react";
import bg from "/Users/erlystagestudios/ept-cep/src/assets/_4bde3a4f-61c8-46a8-a4a5-f3d44b71de60.jpeg";
import { Button, Stack, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = (props) => {
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const checkDeviceType = () => {
      setIsPhone(window.innerWidth <= 690);
    };
    checkDeviceType();
  }, []);
  const navigate = useNavigate();

  return (
    <React.Fragment>
      {!isPhone ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ height: "100%", padding: "30px" }}
        >
          <Stack spacing={2}>
            <Typography sx={{ color: "white", textAlign: "left" }} variant="h3">
              VOLT VISION
            </Typography>
            <Typography
              sx={{ color: "white", textAlign: "left" }}
              variant="subtitle2"
            >
              Maximize Efficiency, Minimize Complexity: Redefining Energy
              Management with Precision.
            </Typography>
            <Button
              variant="contained"
              sx={{
                borderRadius: "24px",
                backgroundColor: "white",
                color: "black",
                width: "170px",
                justifyContent: "space-between",
              }}
              onClick={() => {
                navigate("/calculate");
              }}
            >
              Start Now
              <PlayArrowIcon />
            </Button>
          </Stack>
          <img
            src={bg}
            alt="Main"
            width="47%"
            style={{ borderRadius: "100px" }}
          />
        </Stack>
      ) : (
        <Stack margin="auto" spacing={2}>
          <img src={bg} width="100%" style={{ borderRadius: "24px" }} />
          <Typography sx={{ color: "white", textAlign: "left" }} variant="h3">
            VOLT VISION
          </Typography>
          <Typography
            sx={{ color: "white", textAlign: "left" }}
            variant="subtitle2"
          >
            Maximize Efficiency, Minimize Complexity: Redefining Energy
            Management with Precision.
          </Typography>
          <Button
            variant="contained"
            sx={{
              borderRadius: "24px",
              backgroundColor: "white",
              color: "black",
              width: "170px",
              justifyContent: "space-between",
            }}
            onClick={() => {
              navigate("/calculate");
            }}
          >
            Start Now
            <PlayArrowIcon />
          </Button>
        </Stack>
      )}
    </React.Fragment>
  );
};

export default Home;
