import React, {
  useState,
  useCallback
} from "react";

import {
  useParams
} from "react-router-dom";

import axios from "axios";

import styled from "styled-components";

import {
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid
} from "@mui/material";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";


const FuelPage = () => {

  const { lorryId } = useParams();


  // =====================================================
  // STATES
  // =====================================================

  const [fuelDetails, setFuelDetails] =
    useState([]);


  const [fuelData, setFuelData] =
    useState({

      registration_number: "",

      date_filled: "",

      bunk_name: "",

      litres_filled: "",

      price_per_litre: "",

      amount_paid: ""

    });


  const [startDate, setStartDate] =
    useState(null);


  const [endDate, setEndDate] =
    useState(null);


  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFuelData(
      (previousData) => ({

        ...previousData,

        [name]: value

      })
    );

  };


  // =====================================================
  // DATE CHANGE
  // =====================================================

  const handleDateChange = (
    date,
    type
  ) => {

    if (type === "start") {

      setStartDate(date);

    } else {

      setEndDate(date);

    }

  };


  // =====================================================
  // ADD FUEL
  // =====================================================

  const addFuelDetails = async () => {

    if (
      !fuelData.registration_number ||
      !fuelData.date_filled ||
      !fuelData.bunk_name ||
      !fuelData.litres_filled ||
      !fuelData.price_per_litre ||
      !fuelData.amount_paid
    ) {

      alert(
        "Please fill in all fields correctly."
      );

      return;

    }


    try {

      setLoading(true);


      const response =
        await axios.post(
          "http://localhost:5001/api/fuel/add",
          fuelData
        );


      console.log(
        "Fuel added:",
        response.data
      );


      alert(
        "Fuel details added successfully!"
      );


      // Clear entered fields

      setFuelData(
        (previousData) => ({

          ...previousData,

          date_filled: "",

          bunk_name: "",

          litres_filled: "",

          price_per_litre: "",

          amount_paid: ""

        })
      );


    } catch (error) {

      console.error(
        "Error adding fuel:",
        error
      );


      alert(
        error.response?.data?.error ||
        "Failed to add fuel details."
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // FETCH FUEL DETAILS
  // =====================================================

  const fetchFuelDetails =
    useCallback(async () => {

      if (
        !fuelData.registration_number
      ) {

        alert(
          "Registration number is missing!"
        );

        return;

      }


      if (
        !startDate ||
        !endDate
      ) {

        alert(
          "Please select both start and end dates."
        );

        return;

      }


      try {

        setLoading(true);


        const formattedStartDate =
          startDate
            .toISOString()
            .split("T")[0];


        const formattedEndDate =
          endDate
            .toISOString()
            .split("T")[0];


        const response =
          await axios.get(

            `http://localhost:5001/api/fuel/byRegistration/${encodeURIComponent(
              fuelData.registration_number
            )}`,

            {

              params: {

                startDate:
                  formattedStartDate,

                endDate:
                  formattedEndDate

              }

            }

          );


        console.log(
          "Fuel details:",
          response.data
        );


        setFuelDetails(
          response.data
        );


      } catch (error) {

        console.error(
          "Error fetching fuel:",
          error
        );


        setFuelDetails([]);


        alert(
          error.response?.data?.error ||
          "Failed to fetch fuel details."
        );


      } finally {

        setLoading(false);

      }

    }, [
      fuelData.registration_number,
      startDate,
      endDate
    ]);


  // =====================================================
  // CLEAR ONE FUEL RECORD
  // =====================================================

  const clearFuelRecord =
    async (fuelId) => {

      const confirmed =
        window.confirm(

          "Are you sure you want to mark this fuel record as cleared?\n\n" +

          "The fuel record will NOT be deleted."

        );


      if (!confirmed) {

        return;

      }


      try {

        setLoading(true);


        await axios.put(

          `http://localhost:5001/api/fuel/clear/${fuelId}`

        );


        // Change ONLY the selected row
        // from pending -> cleared

        setFuelDetails(
          (previousDetails) =>

            previousDetails.map(
              (fuel) => {

                if (
                  fuel.id === fuelId
                ) {

                  return {

                    ...fuel,

                    status: "cleared"

                  };

                }


                return fuel;

              }
            )
        );


        alert(
          "Fuel record marked as cleared."
        );


      } catch (error) {

        console.error(
          "Error clearing fuel record:",
          error
        );


        alert(
          error.response?.data?.error ||
          "Failed to clear fuel record."
        );


      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <StyledContainer>

      <Typography
        variant="h4"
        align="center"
        gutterBottom
      >

        Fuel Management for Lorry ID: {lorryId}

      </Typography>


      {/* =================================================
          ADD FUEL
      ================================================= */}

      <Section>

        <Typography variant="h6">
          Add Fuel Details
        </Typography>


        <Grid
          container
          spacing={2}
        >

          <Grid
            item
            xs={12}
            sm={6}
          >

            <TextField

              label="Registration Number"

              variant="outlined"

              fullWidth

              name="registration_number"

              value={
                fuelData.registration_number
              }

              onChange={
                handleChange
              }

            />

          </Grid>


          <Grid
            item
            xs={12}
            sm={6}
          >

            <TextField

              label="Date Filled"

              type="date"

              variant="outlined"

              fullWidth

              name="date_filled"

              value={
                fuelData.date_filled
              }

              onChange={
                handleChange
              }

              InputLabelProps={{
                shrink: true
              }}

            />

          </Grid>


          <Grid
            item
            xs={12}
            sm={6}
          >

            <TextField

              label="Bunk Name"

              variant="outlined"

              fullWidth

              name="bunk_name"

              value={
                fuelData.bunk_name
              }

              onChange={
                handleChange
              }

            />

          </Grid>


          <Grid
            item
            xs={12}
            sm={6}
          >

            <TextField

              label="Litres Filled"

              type="number"

              variant="outlined"

              fullWidth

              name="litres_filled"

              value={
                fuelData.litres_filled
              }

              onChange={
                handleChange
              }

            />

          </Grid>


          <Grid
            item
            xs={12}
            sm={6}
          >

            <TextField

              label="Price Per Litre"

              type="number"

              variant="outlined"

              fullWidth

              name="price_per_litre"

              value={
                fuelData.price_per_litre
              }

              onChange={
                handleChange
              }

            />

          </Grid>


          <Grid
            item
            xs={12}
            sm={6}
          >

            <TextField

              label="Amount Paid"

              type="number"

              variant="outlined"

              fullWidth

              name="amount_paid"

              value={
                fuelData.amount_paid
              }

              onChange={
                handleChange
              }

            />

          </Grid>


          <Grid
            item
            xs={12}
          >

            <Button

              variant="contained"

              color="primary"

              fullWidth

              onClick={
                addFuelDetails
              }

              disabled={
                loading
              }

            >

              {loading
                ? "Processing..."
                : "Add Fuel"}

            </Button>

          </Grid>

        </Grid>

      </Section>


      {/* =================================================
          DATE FILTER
      ================================================= */}

      <Section>

        <Typography variant="h6">
          Filter by Date Range
        </Typography>


        <Grid
          container
          spacing={2}
          alignItems="center"
        >

          <Grid
            item
            xs={12}
            sm={6}
          >

            <DatePicker

              selected={
                startDate
              }

              onChange={(date) =>
                handleDateChange(
                  date,
                  "start"
                )
              }

              selectsStart

              startDate={
                startDate
              }

              endDate={
                endDate
              }

              dateFormat="yyyy-MM-dd"

              placeholderText="Start Date"

              customInput={
                <StyledInput />
              }

            />

          </Grid>


          <Grid
            item
            xs={12}
            sm={6}
          >

            <DatePicker

              selected={
                endDate
              }

              onChange={(date) =>
                handleDateChange(
                  date,
                  "end"
                )
              }

              selectsEnd

              startDate={
                startDate
              }

              endDate={
                endDate
              }

              minDate={
                startDate
              }

              dateFormat="yyyy-MM-dd"

              placeholderText="End Date"

              customInput={
                <StyledInput />
              }

            />

          </Grid>


          <Grid
            item
            xs={12}
          >

            <Button

              variant="contained"

              color="primary"

              fullWidth

              onClick={
                fetchFuelDetails
              }

              disabled={
                loading
              }

            >

              {loading
                ? "Loading..."
                : "Fetch Details"}

            </Button>

          </Grid>

        </Grid>

      </Section>


      {/* =================================================
          FUEL TABLE
      ================================================= */}

      <Section>

        <Typography variant="h6">
          Fuel Details
        </Typography>


        <TableContainer
          component={Paper}
        >

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>
                  Date
                </TableCell>

                <TableCell>
                  Bunk Name
                </TableCell>

                <TableCell>
                  Litres Filled
                </TableCell>

                <TableCell>
                  Price/Litre
                </TableCell>

                <TableCell>
                  Amount Paid
                </TableCell>

                <TableCell>
                  Total Amount
                </TableCell>

                <TableCell>
                  Remaining Amount
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

              </TableRow>

            </TableHead>


            <TableBody>

              {fuelDetails.length > 0 ? (

                fuelDetails.map(
                  (fuel) => (

                    <TableRow
                      key={fuel.id}
                    >

                      <TableCell>
                        {fuel.date_filled}
                      </TableCell>


                      <TableCell>
                        {fuel.bunk_name}
                      </TableCell>


                      <TableCell>
                        {fuel.litres_filled}
                      </TableCell>


                      <TableCell>
                        ₹
                        {Number(
                          fuel.price_per_litre
                        ).toFixed(2)}
                      </TableCell>


                      <TableCell>
                        ₹
                        {Number(
                          fuel.amount_paid
                        ).toFixed(2)}
                      </TableCell>


                      <TableCell>
                        ₹
                        {Number(
                          fuel.total_amount
                        ).toFixed(2)}
                      </TableCell>


                      <TableCell>
                        ₹
                        {Number(
                          fuel.remaining_amount
                        ).toFixed(2)}
                      </TableCell>


                      {/* STATUS */}

                      <TableCell>

                        {fuel.status ===
                        "cleared" ? (

                          <ClearedLabel>
                            Cleared
                          </ClearedLabel>

                        ) : (

                          <ClearButton

                            variant="contained"

                            onClick={() =>
                              clearFuelRecord(
                                fuel.id
                              )
                            }

                            disabled={
                              loading
                            }

                          >

                            Clear

                          </ClearButton>

                        )}

                      </TableCell>

                    </TableRow>

                  )

                )

              ) : (

                <TableRow>

                  <TableCell
                    colSpan={8}
                    align="center"
                  >

                    No fuel details available
                    for the selected date range.

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


// =====================================================
// STYLES
// =====================================================

const StyledContainer = styled.div`

  max-width: 1400px;

  margin: 0 auto;

  padding: 20px;

`;


const Section = styled.div`

  margin-bottom: 40px;

`;


const StyledInput = styled(TextField)`

  width: 100%;

`;


const ClearButton = styled(Button)`

  && {

    background-color: #f44336;

    color: white;

    font-weight: bold;

    min-width: 80px;

  }


  &&:hover {

    background-color: #d32f2f;

  }

`;


const ClearedLabel = styled.span`

  display: inline-block;

  padding: 8px 14px;

  border-radius: 5px;

  background-color: #4caf50;

  color: white;

  font-weight: bold;

  font-size: 14px;

`;