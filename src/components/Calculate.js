import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Stack,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Results from "./Results";
import bg from "../assets/Circuit-PNG-Images.png";
import threeTransmissionline from "../assets/transmission-line-with-three-insulators-svgrepo-com.png";
import fourTransmissionline from "../assets/power-line-svgrepo-com.png";

const ACSR = require("../assets/ACSR.json"); //with path
const clearanceToGroundJson = require("../assets/clearanceToGround.json");
const spacingBetweenConductorsJson = require("../assets/spacingBetweenConductors.json");
const coronaRatios = require("../assets/corona.json");

// const poles = [
//   { pole: "wooden", voltage: 20 },
//   { pole: "RCC", voltage: 33 },
//   { pole: "latticedPoles", voltage: 33 },
//   { pole: "wooden", voltage: 20 }
// ];

class ComplexNumber {
  constructor(magnitude, angleDegrees) {
    const angle = (angleDegrees * Math.PI) / 180;
    this.angle = (angleDegrees * Math.PI) / 180; // Convert angle to radians
    this.real = magnitude * Math.cos(angle);
    this.imaginary = magnitude * Math.sin(angle);
    this.magnitude = Math.sqrt(this.real ** 2 + this.imaginary ** 2);
  }
  multiply(other) {
    const resultReal =
      this.real * other.real - this.imaginary * other.imaginary;
    const resultImaginary =
      this.real * other.imaginary + this.imaginary * other.real;

    return new ComplexNumber(resultReal, resultImaginary);
  }
}

class Complex {
  constructor(real, imaginary) {
    this.real = real;
    this.imaginary = imaginary;
    this.magnitude = Math.sqrt(this.real ** 2 + this.imaginary ** 2);
    this.angle = Math.atan2(this.imaginary, this.real);
  }

  multiply(other) {
    const resultReal =
      this.real * other.real - this.imaginary * other.imaginary;
    const resultImaginary =
      this.real * other.imaginary + this.imaginary * other.real;

    return new Complex(resultReal, resultImaginary);
  }
  divideByScalar(scalar) {
    if (scalar === 0) {
      throw new Error("Cannot divide by zero.");
    }

    const resultReal = this.real / scalar;
    const resultImaginary = this.imaginary / scalar;

    return new Complex(resultReal, resultImaginary);
  }

  addScalar(scalar) {
    return new Complex(this.real + scalar, this.imaginary);
  }
  multiplyByScalar(scalar) {
    return new Complex(this.real * scalar, this.imaginary * scalar);
  }
  add(other) {
    return new Complex(
      this.real + other.real,
      this.imaginary + other.imaginary
    );
  }
}

const calculateVoltage = (length, power) => {
  let voltage = 5.5 * (length / 1.6 + power / 100) ** 0.5;
  if (voltage < 66) {
    voltage = 66;
  } else if (voltage > 66 && voltage < 132) {
    voltage = 132;
  } else if (voltage > 132 && voltage <= 220) {
    voltage = 220;
  } else if (voltage > 220 && voltage <= 400) {
    voltage = 400;
  }
  return voltage;
};

const calculateSIL = (voltage) => {
  const zc = 400;
  const SIL = voltage ** 2 / zc;
  return SIL;
};

const calculateCurrent = (power, voltage, pf) => {
  const current = power / (Math.sqrt(3) * voltage * pf);
  return current;
};

const selectWire = (current, ambientTemperature) => {
  let currentCarryingCapacityAtAmbientTemperature =
    "Approx Current Carrying Capacity amps at 40˚C amb temp";
  if (ambientTemperature == 40) {
    currentCarryingCapacityAtAmbientTemperature =
      "Approx Current Carrying Capacity amps at 40˚C amb temp";
  } else if (ambientTemperature == 45) {
    currentCarryingCapacityAtAmbientTemperature =
      "Approx Current Carrying Capacity amps 45˚ amb temp";
  }
  for (const wire of ACSR) {
    if (wire[currentCarryingCapacityAtAmbientTemperature] > current) {
      return wire;
    }
  }
  return ACSR[-1];
};

const calculateEfficiency = (
  outputPower,
  length,
  current,
  heatingTemperature,
  wire
) => {
  const sigma = 228;
  const resistance =
    ((228 + heatingTemperature) / (228 + 20)) *
    wire[
      "Calculate resistance at 20˚C when corrected to standard weight ohms/km"
    ] *
    length;
  const powerLoss = 3 * current ** 2 * resistance;
  const efficiency =
    ((outputPower * 10 ** 3) / (outputPower * 10 ** 3 + powerLoss)) * 100;
  wire["efficiency"] = efficiency.toFixed(3);
  wire["resistance"] = resistance.toFixed(3);
  // console.log(resistance, "resistance is");
  return efficiency;
};

const selectEfficientWire = (
  outputPower,
  length,
  current,
  heatingTemperature,
  givenEfficiency
) => {
  for (const wire of ACSR) {
    const efficiency = calculateEfficiency(
      outputPower,
      length,
      current,
      heatingTemperature,
      wire
    );
    if (efficiency >= givenEfficiency) {
      return { ...wire, efficiency };
    }
  }
  const efficiency = calculateEfficiency(
    outputPower,
    length,
    current,
    heatingTemperature,
    ACSR[22]
  );
  return { ...ACSR[22], efficiency };
};

const calculateSpacingBetweenConductors = (voltage) => {
  for (const space of spacingBetweenConductorsJson) {
    if (space["Line voltage"] == voltage) {
      return space["Spacing (m)"];
    }
  }
};

const calculateFForCorona = (ratio) => {
  for (const coronaRatio of coronaRatios) {
    if (coronaRatio.ratio == ratio) {
      return coronaRatio.F;
    }
  }
  return 8;
};

const calculateDeq = (configuration, spacingBetweenConductors) => {
  if (configuration == "horizontal") {
    const deq = Math.cbrt(
      spacingBetweenConductors *
        spacingBetweenConductors *
        2 *
        spacingBetweenConductors
    );
    return deq;
  }
};

const calculateVs = (
  voltage,
  current,
  pf,
  configuration,
  spacingBetweenConductor,
  wire,
  length
) => {
  //Vs = Vr(1+ZY/2)+IrZ
  const deq = calculateDeq(configuration, spacingBetweenConductor);
  const Vr = (voltage * 10 ** 3) / Math.sqrt(3);
  const radius = (wire["Conductor Dia Mm"] / 2) * 10 ** -3;
  const radiusDash = radius * Math.exp(-1 / 4);
  const inductance = 2 * 10 ** -7 * Math.log(deq / radiusDash);
  const impedence = new Complex(
    wire.resistance,
    2 * Math.PI * 50 * (inductance * length * 10 ** 3)
  );
  const capacitance = 0.02412 / Math.log10(deq / radius);
  const admittance = new Complex(
    0,
    2 * Math.PI * 50 * capacitance * length * 10 ** -6
  );

  const Ir = new ComplexNumber(current, -(Math.acos(pf) * 180) / Math.PI);
  const Vs = impedence
    .multiply(admittance)
    .divideByScalar(2)
    .addScalar(1)
    .multiplyByScalar(Vr)
    .add(impedence.multiply(Ir));

  const Is = impedence
    .multiply(admittance)
    .divideByScalar(4)
    .addScalar(1)
    .multiply(admittance.multiplyByScalar(Vr))
    .add(
      impedence.multiply(admittance).divideByScalar(2).addScalar(1).multiply(Ir)
    );

  const vrAtNoLoad =
    Vs.magnitude / (1 + (admittance.magnitude * impedence.magnitude) / 2);

  const sendingEndParameters = {
    Vs,
    Is,
    vrAtNoLoad,
    capacitance,
    impedence,
    admittance,
    Ir,
    inductance,
    radius,
  };
  return sendingEndParameters;
};

const calculateClearanceToGround = (voltage) => {
  for (const details of clearanceToGroundJson) {
    if (details.KV == voltage) {
      return details;
    }
  }
  return {
    // KV: 220.0,
    "Across Street (m)": 7.0,
    "Along Street (m)": 7.0,
    "Other Areas (m)": 7.0,
  };
};

// const

const Calculate = (props) => {
  const [results, setResults] = useState();
  const [seeWire, setSeeWire] = useState(false);
  const [seeEfficientWire, setSeeEfficientWire] = useState(false);
  const [seeClearanceToGround, setSeeClearanceToGround] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const [geometry, setGeometry] = useState(false);

  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const checkDeviceType = () => {
      setIsPhone(window.innerWidth <= 690);
    };
    checkDeviceType();
  }, []);

  const configuration = "horizontal";

  const calculateEverything = ({
    length,
    outputPower,
    pf,
    ambientTemperature,
    givenEfficiency,
    heatingTemperature,
    // givenWire
    wire,
  }) => {
    if (heatingTemperature > 100) {
      heatingTemperature = 100;
    }
    outputPower = outputPower * 10 ** 3;
    console.log("inside calculate everything");
    const voltage = calculateVoltage(length, outputPower);
    const SIL = calculateSIL(voltage);
    const current = calculateCurrent(outputPower, voltage, pf);
    // const wire = selectWire(current, ambientTemperature);
    let mostEfficientWire = wire;
    const wireEfficiency = calculateEfficiency(
      outputPower,
      length,
      current,
      heatingTemperature,
      wire
    );
    const spacingBetweenConductor = calculateSpacingBetweenConductors(voltage);
    if (wireEfficiency < givenEfficiency) {
      mostEfficientWire = selectEfficientWire(
        outputPower,
        length,
        current,
        heatingTemperature,
        givenEfficiency
      );
    }
    const clearanceToGround = calculateClearanceToGround(voltage);

    console.log(configuration, spacingBetweenConductor);
    const deq = calculateDeq(configuration, spacingBetweenConductor);
    const sendingEndParameters = calculateVs(
      voltage,
      current,
      pf,
      configuration,
      spacingBetweenConductor,
      wire,
      length
    );
    const sendingEndPf = Math.cos(
      sendingEndParameters.Vs.angle * sendingEndParameters.Is.angle
    );

    const sendingEndPower =
      3 *
      sendingEndParameters.Vs.magnitude *
      sendingEndParameters.Is.magnitude *
      0.941 *
      10 ** -6;

    const efficiency = ((outputPower * 10 ** -3) / sendingEndPower) * 100;
    const volatgeRegulation =
      ((sendingEndParameters.vrAtNoLoad - (voltage * 10 ** 3) / Math.sqrt(3)) *
        100) /
      ((voltage * 10 ** 3) / Math.sqrt(3));

    const sigma = 0.884;

    const vd =
      ((3 * 10 ** 6) / Math.sqrt(2)) *
      ((wire["Conductor Dia Mm"] * 10 ** -3) / 2) *
      sigma *
      0.84 *
      Math.log(deq / ((wire["Conductor Dia Mm"] * 10 ** -3) / 2));

    const ratio = (voltage * 10 ** 3) / Math.sqrt(3) / vd;

    const F = calculateFForCorona(Math.ceil(ratio));

    const coronaLoss =
      (21 * 10 ** -6 * 50 * (voltage / Math.sqrt(3)) ** 2 * F) /
      Math.log10(deq / ((wire["Conductor Dia Mm"] * 10 ** -3) / 2)) ** 2;
    const totalCoronaLoss = coronaLoss * 3 * length;
    const calculatedResults = {
      length,
      pf,
      wireEfficiency,
      outputPower,
      voltage,
      SIL,
      current,
      wire,
      mostEfficientWire,
      spacingBetweenConductor,
      clearanceToGround,
      deq,
      sendingEndParameters,
      sendingEndPf,
      sendingEndPower,
      efficiency,
      volatgeRegulation,
      coronaLoss,
      ratio,
      totalCoronaLoss,
    };
    console.log(calculatedResults);

    setResults(calculatedResults);
    setAllResults((prev) => [...prev, calculatedResults]);
  };

  const formik = useFormik({
    initialValues: {
      outputPower: 100,
      length: 200,
      pf: 0.9,
      ambientTemperature: 40,
      heatingTemperature: 75,
      givenEfficiency: 94,
      wire: ACSR[17],
    },
    onSubmit: calculateEverything,
  });

  const tower132KV = () => {
    // Change the value of the field on button click
    formik.setValues({
      ...formik.values,
      outputPower: 50,
      length: 100,
      pf: 0.6,
    });
    setGeometry(true);
  };

  const tower220KV = () => {
    // Change the value of the field on button click
    formik.setValues({
      ...formik.values,
      outputPower: 100,
      length: 200,
      pf: 0.9,
    });
    setGeometry(true);
  };

  return (
    <React.Fragment>
      <div
        style={{
          position: "relative",
          backgroundImage: `url(${bg})`,
          backgroundSize: "fit",
          width: "100%",
          // backgroundRepeat: "no-repeat",
          height: "100%",
          paddingTop: "40px",
        }}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{
            backgroundColor: "#ffffff",
            margin: "auto",
            width: isPhone ? "100%" : "40%",
            paddingY: "20px",
            borderRadius: "24px",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "24px",
              borderRadius: "24px",
            }}
          >
            Geometry
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <img
                src={threeTransmissionline}
                style={{ width: "80%" }}
                alt="132KV Line Image"
              />
              <Typography>Output Power: 50MW</Typography>
              <Typography>Voltage: 132KV</Typography>
              <Typography>Length: 100KM</Typography>
              <Typography>Power Factor: 0.6</Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  borderRadius: "24px",
                }}
                onClick={() => {
                  tower132KV();
                }}
              >
                SELECT
              </Button>
            </Stack>

            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <img
                src={fourTransmissionline}
                style={{ width: "80%" }}
                alt="220KV Line Image"
              />
              <Typography>Output Power: 100MW</Typography>
              <Typography>Voltage: 220KV</Typography>
              <Typography>Length: 200KM</Typography>
              <Typography>Power Factor: 0.9</Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  borderRadius: "24px",
                }}
                onClick={() => {
                  tower220KV();
                }}
              >
                SELECT
              </Button>
            </Stack>
          </Stack>
        </Stack>

        {geometry ? (
          <form onSubmit={formik.handleSubmit}>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{
                backgroundColor: "#ffffff",
                margin: "auto",
                width: isPhone ? "100%" : "40%",
                paddingY: "20px",
                borderRadius: "24px",
                marginTop: 3,
              }}
            >
              <Typography
                // variant={isPhone ? "h5" : "h5"}
                sx={{
                  fontWeight: "bold",
                  color: "rgba(0, 0, 0, 0.87)",
                  fontSize: "20px",
                  borderRadius: "24px",
                }}
                // sx={{ fontWeight: "bold" }}
              >
                INITIAL PARAMETERS
              </Typography>
              <TextField
                id="outputPower"
                label="Output Power"
                variant="outlined"
                type="number"
                value={formik.values.outputPower}
                sx={{ m: 1, width: "50%" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">MW</InputAdornment>
                  ),
                }}
                onChange={formik.handleChange}
              />
              <TextField
                id="length"
                label="Length"
                variant="outlined"
                type="number"
                value={formik.values.length}
                sx={{ m: 1, width: "50%" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">KM</InputAdornment>
                  ),
                }}
                onChange={formik.handleChange}
              />
              <TextField
                id="pf"
                label="Power Factor"
                variant="outlined"
                type="number"
                value={formik.values.pf}
                sx={{ m: 1, width: "50%" }}
                onChange={formik.handleChange}
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: 1,
                    step: 0.1,
                  },
                }}
              />
              <TextField
                id="ambientTemperature"
                label="Ambient Temperature"
                variant="outlined"
                type="number"
                value={formik.values.ambientTemperature}
                sx={{ m: 1, width: "50%" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">°C</InputAdornment>
                  ),
                }}
                onChange={formik.handleChange}
              />
              <TextField
                id="heatingTemperature"
                label="Heating Temperature"
                variant="outlined"
                type="number"
                value={formik.values.heatingTemperature}
                sx={{ m: 1, width: "50%" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">°C</InputAdornment>
                  ),
                  inputProps: {
                    min: 75,
                    max: 150,
                  },
                }}
                onChange={formik.handleChange}
              />
              <TextField
                id="givenEfficiency"
                label="Required Efficiency"
                variant="outlined"
                type="number"
                value={formik.values.givenEfficiency}
                sx={{ m: 1, width: "50%" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 96,
                  },
                }}
                onChange={formik.handleChange}
              />
              <FormControl sx={{ m: 1, width: "50%" }}>
                <InputLabel id="demo-simple-select-error-label">
                  Wire
                </InputLabel>
                <Select
                  id="wire"
                  name="wire"
                  value={formik.values.wire}
                  label="wire"
                  onChange={formik.handleChange}
                  // renderValue={(value) => `⚠️  - ${value}`}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {ACSR.map((wire) => {
                    return (
                      <MenuItem value={wire}>{wire["Code Name"]}</MenuItem>
                    );
                  })}
                </Select>
                {/* <FormHelperText>Error</FormHelperText> */}
              </FormControl>
              {/* <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Selected wire"
                checked={false}
              />
            </FormGroup> */}

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  borderRadius: "24px",
                  // "&:hover": {
                  //   backgroundColor: "#36454f",
                  //   borderColor: "#0062cc",
                  //   boxShadow: "none",
                  // },
                }}
                type="submit"
              >
                Calculate
              </Button>
            </Stack>
          </form>
        ) : null}

        {results ? (
          <Results
            results={results}
            seeWire={seeWire}
            seeEfficientWire={seeEfficientWire}
            seeClearanceToGround={seeClearanceToGround}
            setSeeClearanceToGround={setSeeClearanceToGround}
            setSeeEfficientWire={setSeeEfficientWire}
            setSeeWire={setSeeWire}
            isPhone={isPhone}
            allResults={allResults}
          />
        ) : // <Typography>results</Typography>
        null}
      </div>
    </React.Fragment>
  );
};

export default Calculate;
