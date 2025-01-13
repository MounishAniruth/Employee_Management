import { useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
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
      fetchFuelDetails();
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

  useEffect(() => {
    if (startDate && endDate) {
      fetchFuelDetails();
    }
  }, [fetchFuelDetails, startDate, endDate]);

  return (
    <Container>
      <Header>{`Fuel Management for Lorry ID: ${lorryId}`}</Header>

      <Section>
        <h3>Add Fuel Details</h3>
        <Form>
          <Input
            type="text"
            name="registration_number"
            placeholder="Registration Number"
            value={fuelData.registration_number}
            onChange={handleChange}
            required
          />
          <Input
            type="date"
            name="date_filled"
            value={fuelData.date_filled}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="bunk_name"
            placeholder="Bunk Name"
            value={fuelData.bunk_name}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            name="litres_filled"
            placeholder="Litres Filled"
            value={fuelData.litres_filled}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            name="price_per_litre"
            placeholder="Price Per Litre"
            value={fuelData.price_per_litre}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            name="amount_paid"
            placeholder="Amount Paid"
            value={fuelData.amount_paid}
            onChange={handleChange}
            required
          />
          <Button onClick={addFuelDetails}>Add Fuel</Button>
        </Form>
      </Section>

      <Section>
        <h3>Filter by Date Range</h3>
        <DatePickerContainer>
          <DatePicker
            selected={startDate}
            onChange={(date) => handleDateChange(date, "start")}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM-dd"
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => handleDateChange(date, "end")}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy-MM-dd"
            placeholderText="End Date"
          />
          <Button onClick={fetchFuelDetails}>Fetch Details</Button>
        </DatePickerContainer>
      </Section>

      <Section>
        <h3>Fuel Details</h3>
        <Table>
        <thead>
  <tr>
    <th>Date</th>
    <th>Bunk Name</th>
    <th>Litres Filled</th>
    <th>Price/Litre</th>
    <th>Amount Paid</th>
    <th>Total Amount</th>
    <th>Remaining Amount</th>
  </tr>
</thead>

<tbody>
  {fuelDetails.length > 0 ? (
    fuelDetails.map((fuel, index) => (
      <tr key={index}>
        <td>{fuel.date_filled}</td>
        <td>{fuel.bunk_name}</td>
        <td>{fuel.litres_filled}</td>
        <td>{fuel.price_per_litre}</td>
        <td>{fuel.amount_paid}</td>
        <td>{fuel.total_amount}</td>
        <td>{fuel.remaining_amount}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7">No fuel details available for the selected date range.</td>
    </tr>
  )}
</tbody>
        </Table>
      </Section>
    </Container>
  );
};

export default FuelPage;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  grid-column: span 2;
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const DatePickerContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;

  th, td {
    padding: 10px;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f4f4f4;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;
