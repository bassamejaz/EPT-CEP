import React from "react";
import {
  List,
  ListSubheader,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  Typography,
  Stack,
  Grid,
  Item,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { BarChart, ChartsYAxis } from "@mui/x-charts";

const Results = ({
  results,
  seeWire,
  seeClearanceToGround,
  seeEfficientWire,
  setSeeClearanceToGround,
  setSeeEfficientWire,
  setSeeWire,
  isPhone,
  allResults,
}) => {
  console.log("inside results", results);
  const createBarSeries = (property) => {};
  return (
    <React.Fragment>
      <List
        sx={{
          backgroundColor: "background.paper",
          margin: "auto",
          width: isPhone ? "100%" : "40%",
          borderRadius: "24px",
          mt: "50px",
          //   transform: "translate(0, -1100px)",
        }}
      >
        <ListSubheader
          sx={{
            fontWeight: "bold",
            color: "rgba(0, 0, 0, 0.87)",
            fontSize: "20px",
            borderRadius: "24px",
          }}
        >
          Results
        </ListSubheader>
        <ListItem>
          <ListItemText>Voltage</ListItemText>
          <Typography>{results.voltage} KV</Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>Power Factor</ListItemText>
          <Typography>{results.pf}</Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>Efficiency </ListItemText>
          <Typography>{results.efficiency.toFixed(2)} %</Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>Output Power</ListItemText>
          <Typography>{results.outputPower / 1000} MW</Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>SIL</ListItemText>
          <Typography>{results.SIL} MW</Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>Current</ListItemText>
          <Typography>{results.current.toFixed(2)} A</Typography>
        </ListItem>
        <Divider />
        {/* deq,
      sendingEndParameters,
      sendingEndPf,
      sendingEndPower,
      efficiency,
      volatgeRegulation,
      coronaLoss,
      ratio,
      totalCoronaLoss, */}
        <ListItem>
          <ListItemText>Deq</ListItemText>
          <Typography>{results.deq.toFixed(2)} mm</Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>Sending end voltage</ListItemText>
          <Typography>
            {(results.sendingEndParameters.Vs.magnitude / 1000).toFixed(2)}∠
            {results.sendingEndParameters.Vs.angle.toFixed(2)} KV
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>Sending end current</ListItemText>
          <Typography>
            {results.sendingEndParameters.Is.magnitude.toFixed(2)}∠
            {results.sendingEndParameters.Is.angle.toFixed(2)} A
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>Receiving end current</ListItemText>
          <Typography>
            {results.sendingEndParameters.Ir.magnitude.toFixed(2)}∠
            {results.sendingEndParameters.Ir.angle.toFixed(2)} A
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>Admittance</ListItemText>
          <Typography>
            {/* {results.sendingEndParameters.admittance.real} */}
            {results.sendingEndParameters.admittance.magnitude.toFixed(7)}∠
            {results.sendingEndParameters.admittance.angle.toFixed(2)} ℧
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>Capacitance</ListItemText>
          <Typography>
            {results.sendingEndParameters.capacitance.toFixed(7)} F
            {/* {results.sendingEndParameters.capacitance.real} */}
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>Impedence</ListItemText>
          <Typography>
            {results.sendingEndParameters.impedence.magnitude.toFixed(2)}∠
            {results.sendingEndParameters.impedence.angle.toFixed(2)} Z
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>Inductance</ListItemText>
          <Typography>
            {results.sendingEndParameters.inductance.toFixed(7)} H
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Divider />
          <ListItemText>Vr at no load</ListItemText>
          <Typography>
            {(results.sendingEndParameters.vrAtNoLoad / 1000).toFixed(3)} KV
          </Typography>
        </ListItem>
        <Divider />

        <ListItem>
          <ListItemText>Sending end power factor</ListItemText>
          <Typography>{results.sendingEndPf.toFixed(7)}</Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>Sending end power</ListItemText>
          <Typography>{results.sendingEndPower.toFixed(2)} MW</Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>Total corona loss</ListItemText>
          <Typography>{results.totalCoronaLoss.toFixed(2)} KW</Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText>Voltage Regulation</ListItemText>
          <Typography>{results.volatgeRegulation.toFixed(2)} %</Typography>
        </ListItem>
        <Divider />

        <ListItemButton
          onClick={() => {
            setSeeWire((prev) => {
              return !prev;
            });
          }}
        >
          <ListItemText>Wire</ListItemText>
          {seeWire ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Divider />

        <Collapse in={seeWire} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }}>
            {Object.keys(results.wire).map((key) => (
              <ListItem>
                <ListItemText>{key}</ListItemText>
                <Typography>{results.wire[key]}</Typography>
              </ListItem>
            ))}
            <Button
              onClick={() => {
                setSeeWire(false);
              }}
              sx={{
                color: "black",
              }}
            >
              Close
            </Button>
            {/* <ExpandLess /> */}
          </List>
          <Divider />
        </Collapse>
        <ListItemButton
          onClick={() => {
            setSeeEfficientWire((prev) => {
              return !prev;
            });
          }}
        >
          <ListItemText>Efficient Wire</ListItemText>
          {seeEfficientWire ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Divider />

        <Collapse in={seeEfficientWire}>
          <List sx={{ pl: 4 }}>
            {Object.keys(results.mostEfficientWire).map((key) => (
              <ListItem>
                <ListItemText>{key}</ListItemText>
                <Typography>{results.mostEfficientWire[key]}</Typography>
              </ListItem>
            ))}
            <Button
              onClick={() => {
                setSeeEfficientWire(false);
              }}
              sx={{
                color: "black",
              }}
            >
              Close
            </Button>
          </List>
          <Divider />
        </Collapse>
        <ListItemButton
          onClick={() => {
            setSeeClearanceToGround((prev) => !prev);
          }}
        >
          <ListItemText>Clearance to ground</ListItemText>
          {seeClearanceToGround ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Divider />
        <Collapse in={seeClearanceToGround}>
          <List sx={{ pl: 4 }}>
            {Object.keys(results.clearanceToGround).map((key) => (
              <ListItem>
                <ListItemText>{key}</ListItemText>
                <Typography>{results.clearanceToGround[key]}</Typography>
              </ListItem>
            ))}
            <Button
              onClick={() => {
                setSeeClearanceToGround(false);
              }}
              sx={{
                color: "black",
              }}
            >
              Close
            </Button>
          </List>
          <Divider />
        </Collapse>
        <ListItem>
          <ListItemText>Spacing between conductors</ListItemText>
          <Typography>{results.spacingBetweenConductor} m</Typography>
        </ListItem>
      </List>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{
          width: isPhone ? "100%" : "50%",
          margin: "auto",
          marginTop: 3,
          backgroundColor: "white",
          borderRadius: "24px",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            color: "rgba(0, 0, 0, 0.87)",
            fontSize: "20px",
            borderRadius: "24px",
          }}
        >
          Graphs
        </Typography>
        {/* <Stack
          direction={isPhone ? "column" : "row"}
          justifyContent="center"
          alignItems="center"
          spacing={2}
        > */}
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>
            <BarChart
              xAxis={[{ scaleType: "band", data: ["Wire Efficiency"] }]}
              series={allResults.map((results) => {
                return {
                  data: [results.wire.efficiency],
                  label: results.wire["Code Name"],
                };
              })}
              width={250}
              height={300}
            />
          </Grid>
          <Grid item>
            <BarChart
              xAxis={[{ scaleType: "band", data: ["Corona Loss"] }]}
              series={allResults.map((results) => {
                return {
                  data: [results.totalCoronaLoss],
                  label: results.wire["Code Name"],
                };
              })}
              width={250}
              height={300}
            />
          </Grid>
          <Grid item>
            <BarChart
              xAxis={[{ scaleType: "band", data: ["System Efficiency"] }]}
              series={allResults.map((results) => {
                return {
                  data: [results.efficiency],
                  label: `${results.pf} PF`,
                };
              })}
              width={250}
              height={300}
            />
          </Grid>
          <Grid item>
            <BarChart
              xAxis={[{ scaleType: "band", data: ["Voltage Regulation"] }]}
              series={allResults.map((results) => {
                return {
                  data: [results.volatgeRegulation],
                  label: `${results.wire["Code Name"]} ${results.pf}PF`,
                };
              })}
              width={250}
              height={300}
            />
          </Grid>
        </Grid>

        <Stack sx={{ width: "90%" }} spacing={2}>
          <Typography
          // sx={{
          //   // fontWeight: "bold",
          //   color: "rgba(0, 0, 0, 0.87)",
          //   fontSize: "18px",
          //   borderRadius: "24px",
          // }}
          >
            The above graphs show that selecting a good conductor increases the
            efficiency of the wire and the system. Additionally, increasing the
            power factor (pf) enhances the efficiency of the system, while
            voltage regulation decreases.
          </Typography>
          <Typography
          // sx={{
          //   // fontWeight: "bold",
          //   color: "rgba(0, 0, 0, 0.87)",
          //   fontSize: "18px",
          //   borderRadius: "24px",
          //   // padding: 3,
          // }}
          >
            The reason for these observed effects can be explained as follows:
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "18px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            1. Selection of a Good Conductor:{" "}
          </Typography>
          <Typography>
            Good conductors have lower electrical resistance. When a wire has
            lower resistance, less energy is dissipated as heat during the
            transmission of electrical current. This results in a more efficient
            transfer of electrical power, leading to increased overall
            efficiency in the wire and the system.
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "18px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            2. Increasing Power Factor (pf):
          </Typography>
          <Typography>
            Power factor is the ratio of real power to apparent power in an
            electrical system. A higher power factor indicates that a greater
            proportion of the electrical power is effectively utilized for
            useful work. When the power factor is increased, less power is
            wasted as reactive power, contributing to improved efficiency in the
            system.
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "18px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            3. Voltage Regulation:
          </Typography>
          <Typography sx={{ paddingBottom: 3 }}>
            Voltage regulation refers to the ability of a system to maintain a
            steady voltage output under varying load conditions. A decrease in
            voltage regulation implies that the system is better able to
            maintain a consistent voltage level even when subjected to changes
            in load. This can lead to a more stable and efficient operation of
            the electrical system.
          </Typography>
        </Stack>
        <Stack sx={{ width: "90%" }} spacing={2}>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "32px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            Environmental Effects:
          </Typography>
          <Typography
            sx={{
              // fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "18px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            The described improvements in the electrical system, specifically
            upgrading the wire and enhancing the power factor, can have several
            environmental effects, both positive and potentially negative. Here
            are some considerations:
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "24px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            Positive Environmental Effects:
          </Typography>

          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "18px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            1. Increased Efficiency:
          </Typography>
          <Typography>
            The overall increase in system efficiency implies that less energy
            is wasted during the transmission and distribution of electrical
            power. This can lead to a reduction in the total amount of energy
            required, contributing to lower overall energy consumption and
            potentially decreasing the environmental impact associated with
            power generation.
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "18px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            2. Decreased Losses:
          </Typography>
          <Typography>
            The reduction in corona losses and improved efficiency in the system
            mean less energy is dissipated in the form of heat during power
            transmission. This contributes to a more effective utilization of
            energy resources and can result in a decrease in greenhouse gas
            emissions associated with power generation.
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "18px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            3. Lower Voltage Regulation:
          </Typography>
          <Typography sx={{ paddingBottom: 3 }}>
            The decrease in voltage regulation signifies a more stable voltage
            supply. This stability can improve the overall reliability of the
            electrical grid and reduce the need for excess power generation to
            compensate for voltage fluctuations, potentially leading to lower
            environmental impact.
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "24px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            Positive Environmental Effects:
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "18px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            1. Materials and Manufacturing Impact:
          </Typography>
          <Typography>
            The production and manufacturing processes involved in creating new
            wires, such as the transition from Rabbit ACSR to GOAT ACSR, may
            have environmental implications. These could include resource
            extraction, energy consumption, and waste generation associated with
            the production of new materials.
          </Typography>

          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "18px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            2. End-of-Life Disposal:
          </Typography>
          <Typography>
            The disposal of old wires and materials from the Rabbit ACSR could
            have environmental consequences if not handled properly. Recycling
            or appropriate disposal methods should be considered to minimize the
            environmental impact.
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "18px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            3. Power Factor Correction Devices:
          </Typography>
          <Typography>
            While improving the power factor contributes to efficiency, the
            installation of power factor correction devices might have
            associated environmental considerations. The production and
            operation of such devices could have environmental implications.
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "24px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            Considerations for Safety:
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "18px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            1. Installation and Maintenance:
          </Typography>
          <Typography>
            The process of upgrading wires and implementing power factor
            correction measures may involve installation and maintenance
            activities. Ensuring that these activities are carried out following
            proper safety protocols is essential to prevent accidents and
            injuries.
          </Typography>

          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "18px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            2. Training and Awareness:
          </Typography>
          <Typography>
            Personnel involved in the upgrade and maintenance activities should
            receive adequate training to handle the new equipment and systems.
            Increased awareness of the changes and potential safety risks is
            crucial for maintaining a safe working environment.
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "18px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            3. Emergency Preparedness:
          </Typography>
          <Typography>
            It's important to have emergency response plans in place in case of
            unforeseen events. This includes procedures for handling power
            outages, equipment failures, or other emergencies to minimize risks
            and ensure the safety of both personnel and the public.
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "18px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            4. Compliance with Standards:
          </Typography>
          <Typography>
            Adhering to safety standards and regulations in the electrical
            industry is critical. Compliance helps ensure that the implemented
            changes meet recognized safety criteria and guidelines.
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "rgba(0, 0, 0, 0.87)",
              fontSize: "24px",
              borderRadius: "24px",
              // padding: 3,
            }}
          >
            Conclusion:
          </Typography>
          <Typography sx={{ paddingBottom: 2 }}>
            In conclusion, while the overall trend suggests positive
            environmental effects due to increased efficiency and reduced
            losses, it is crucial to consider the entire life cycle of the
            system improvements, including manufacturing, operation, and
            disposal, to accurately assess the environmental impact.
          </Typography>
        </Stack>
      </Stack>
    </React.Fragment>
  );
};

export default Results;
