import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FuelPage = () => {
  const { lorryId } = useParams();
  const [fuelDetails, setFuelDetails] = useState([]);
  const [fuelData, setFuelData] = useState({
    registration_number: "",
    date_filled: "",
    bunk_name: "",
    litres_filled: "",
    price_per_litre: "",
    amount_paid: "",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFuelData({ ...fuelData, [name]: value });
  };

  const handleDateChange = (date, type) => {
    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const addFuelDetails = async () => {
    if (
      !fuelData.registration_number ||
      !fuelData.date_filled ||
      !fuelData.bunk_name ||
      !fuelData.litres_filled ||
      !fuelData.price_per_litre ||
      !fuelData.amount_paid
    ) {
      alert("Please fill in all fields correctly.");
      return;
    }

    try {
      console.log("Sending Data:", fuelData);
      await axios.post("http://localhost:5001/api/fuel/add", fuelData);
      alert("Fuel details added successfully!");
    } catch (error) {
      console.error("Error adding fuel details:", error);
      alert("Failed to add fuel details. Please try again.");
    }
  };

  const fetchFuelDetails = useCallback(async () => {
    if (!fuelData.registration_number) {
      alert("Registration number is missing!");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5001/api/fuel/byRegistration/${fuelData.registration_number}`,
        {
          params: {
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          },
        }
      );
      setFuelDetails(response.data);
    } catch (error) {
      console.error("Error fetching fuel details:", error);
      alert("Failed to fetch fuel details. Please try again.");
    }
  }, [fuelData.registration_number, startDate, endDate]);

  return (
    <StyledContainer>
      <Typography variant="h4" align="center" gutterBottom>
        Fuel Management for Lorry ID: {lorryId}
      </Typography>

      <Section>
        <Typography variant="h6">Add Fuel Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Registration Number"
              variant="outlined"
              fullWidth
              name="registration_number"
              value={fuelData.registration_number}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date Filled"
              type="date"
              variant="outlined"
              fullWidth
              name="date_filled"
              value={fuelData.date_filled}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Bunk Name"
              variant="outlined"
              fullWidth
              name="bunk_name"
              value={fuelData.bunk_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Litres Filled"
              type="number"
              variant="outlined"
              fullWidth
              name="litres_filled"
              value={fuelData.litres_filled}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price Per Litre"
              type="number"
              variant="outlined"
              fullWidth
              name="price_per_litre"
              value={fuelData.price_per_litre}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount Paid"
              type="number"
              variant="outlined"
              fullWidth
              name="amount_paid"
              value={fuelData.amount_paid}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={addFuelDetails}>
              Add Fuel
            </Button>
          </Grid>
        </Grid>
      </Section>

      <Section>
        <Typography variant="h6">Filter by Date Range</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <DatePicker
              selected={startDate}
              onChange={(date) => handleDateChange(date, "start")}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="Start Date"
              customInput={<StyledInput />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              selected={endDate}
              onChange={(date) => handleDateChange(date, "end")}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="End Date"
              customInput={<StyledInput />}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={fetchFuelDetails}>
              Fetch Details
            </Button>
          </Grid>
        </Grid>
      </Section>

      <Section>
        <Typography variant="h6">Fuel Details</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Bunk Name</TableCell>
                <TableCell>Litres Filled</TableCell>
                <TableCell>Price/Litre</TableCell>
                <TableCell>Amount Paid</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Remaining Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fuelDetails.length > 0 ? (
                fuelDetails.map((fuel, index) => (
                  <TableRow key={index}>
                    <TableCell>{fuel.date_filled}</TableCell>
                    <TableCell>{fuel.bunk_name}</TableCell>
                    <TableCell>{fuel.litres_filled}</TableCell>
                    <TableCell>{fuel.price_per_litre}</TableCell>
                    <TableCell>{fuel.amount_paid}</TableCell>
                    <TableCell>{fuel.total_amount}</TableCell>
                    <TableCell>{fuel.remaining_amount}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No fuel details available for the selected date range.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>
    </StyledContainer>
  );
};

export default FuelPage;

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const StyledInput = styled(TextField)`
  width: 100%;
`;