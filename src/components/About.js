import React, { useState, useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import bassam from "/Users/erlystagestudios/ept-cep/src/assets/bassam.png";
import pole from "/Users/erlystagestudios/ept-cep/src/assets/pole.png";
const About = (props) => {
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const checkDeviceType = () => {
      setIsPhone(window.innerWidth <= 690);
    };
    checkDeviceType();
  }, []);
  return (
    <React.Fragment>
      <div
        style={{
          padding: "20px",
          //   backgroundImage: `url(${pole})`
        }}
      >
        <Typography
          variant="h3"
          color="white"
          textAlign={"center"}
          marginBottom={"40px"}
        >
          ABOUT
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{
            width: isPhone ? "100%" : "50%",
            backgroundColor: "background.paper",
            height: "80%",
            borderRadius: "24px",
          }}
          margin="auto"
        >
          {!isPhone ? (
            <img src={bassam} width="50%" style={{ borderRadius: "24px" }} />
          ) : null}
          <Typography color="black" padding="12px">
            Hello, I'm Bassam Ejaz, and this represents my assignment on complex
            engineering problems. Volt Vision serves as a versatile solution,
            proficient in executing intricate numerical calculations vital for
            power transmission projects. From wire selection to ensuring optimal
            efficiency, this software identifies and determines all the
            essential parameters needed to initiate a successful project,
            showcasing my commitment to advancing engineering problem-solving.
            In this project, I am reading various CSV files, filtering them
            based on required parameters. This endeavor has enhanced my
            understanding of data processing and cleansing, enabling me to
            obtain the desired results.
          </Typography>
        </Stack>
      </div>
    </React.Fragment>
  );
};

export default About;
