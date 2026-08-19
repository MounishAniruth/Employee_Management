import React, {
  useState,
  useEffect,
  useCallback
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import styled from "styled-components";

import {
  TextField
} from "@mui/material";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import api from "../utils/api";


// =====================================================
// FUEL PAGE
// =====================================================

const FuelPage = () => {

  const { lorryId } = useParams();

  const navigate = useNavigate();


  // =====================================================
  // LOGGED-IN USER
  // =====================================================

  const userType =
    localStorage.getItem("userType");

  const userName =
    localStorage.getItem("userName");


  // =====================================================
  // STATES
  // =====================================================

  const [lorry, setLorry] =
    useState(null);


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


  const [pageLoading, setPageLoading] =
    useState(true);


  // =====================================================
  // FETCH LORRY
  // =====================================================

  useEffect(() => {

    const fetchLorry = async () => {

      try {

        setPageLoading(true);


        const response =
          await api.get(
            `/lorry/${lorryId}`
          );


        setLorry(
          response.data
        );


        setFuelData(
          previousData => ({
            ...previousData,

            registration_number:
              response.data.registration_number
          })
        );


      } catch (error) {

        console.error(
          "Error fetching lorry:",
          error
        );


        if (
          error.response?.status === 401
        ) {

          handleUnauthorized();

          return;

        }


        if (
          error.response?.status === 403
        ) {

          alert(
            error.response?.data?.message ||
            "You do not have permission to access this lorry."
          );

        }

      } finally {

        setPageLoading(false);

      }

    };


    if (lorryId) {

      fetchLorry();

    }

  }, [lorryId]);


  // =====================================================
  // UNAUTHORIZED
  // =====================================================

  const handleUnauthorized = () => {

    localStorage.removeItem(
      "authToken"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "userType"
    );

    localStorage.removeItem(
      "userName"
    );

    localStorage.removeItem(
      "userId"
    );


    window.location.href =
      "/login";

  };


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFuelData(
      previousData => ({
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
  // PERMISSION CHECK
  // =====================================================

  const canManageThisLorry = () => {

    if (!lorry) {

      return false;

    }


    if (
      userType === "owner"
    ) {

      return true;

    }


    if (
      userType === "manager"
    ) {

      return true;

    }


    if (
      userType === "lorry_manager"
    ) {

      return (
        Number(
          lorry.lorry_manager_id
        ) ===
        Number(
          localStorage.getItem(
            "userId"
          )
        )
      );

    }


    return false;

  };


  // =====================================================
  // ADD FUEL
  // =====================================================

  const addFuelDetails =
    async () => {

      if (
        userType !== "owner" &&
        userType !== "manager" &&
        userType !== "lorry_manager"
      ) {

        alert(
          "You do not have permission to add fuel details."
        );

        return;

      }


      if (
        userType === "lorry_manager" &&
        !canManageThisLorry()
      ) {

        alert(
          "You are not assigned to this lorry."
        );

        return;

      }


      if (
        !fuelData.registration_number ||
        !fuelData.date_filled ||
        !fuelData.bunk_name ||
        !fuelData.litres_filled ||
        !fuelData.price_per_litre ||
        !fuelData.amount_paid
      ) {

        alert(
          "Please fill in all fuel details."
        );

        return;

      }


      if (
        Number(
          fuelData.litres_filled
        ) <= 0
      ) {

        alert(
          "Litres filled must be greater than zero."
        );

        return;

      }


      if (
        Number(
          fuelData.price_per_litre
        ) <= 0
      ) {

        alert(
          "Price per litre must be greater than zero."
        );

        return;

      }


      try {

        setLoading(true);


        const response =
          await api.post(
            "/fuel/add",
            fuelData
          );


        console.log(
          "Fuel added:",
          response.data
        );


        alert(
          "Fuel details added successfully!"
        );


        setFuelData(
          previousData => ({
            ...previousData,

            date_filled: "",
            bunk_name: "",
            litres_filled: "",
            price_per_litre: "",
            amount_paid: ""
          })
        );


        // Refresh current records
        if (
          startDate &&
          endDate
        ) {

          await fetchFuelDetails();

        }


      } catch (error) {

        console.error(
          "Error adding fuel:",
          error
        );


        if (
          error.response?.status === 401
        ) {

          alert(
            "Session expired. Please login again."
          );

          handleUnauthorized();

          return;

        }


        if (
          error.response?.status === 403
        ) {

          alert(
            error.response?.data?.message ||
            "You do not have permission to add fuel details for this lorry."
          );

          return;

        }


        alert(
          error.response?.data?.error ||
          error.response?.data?.message ||
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
    useCallback(
      async () => {

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
            await api.get(

              `/fuel/byRegistration/${encodeURIComponent(
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


          setFuelDetails(
            Array.isArray(
              response.data
            )
              ? response.data
              : []
          );


        } catch (error) {

          console.error(
            "Error fetching fuel:",
            error
          );


          if (
            error.response?.status === 401
          ) {

            alert(
              "Session expired. Please login again."
            );

            handleUnauthorized();

            return;

          }


          if (
            error.response?.status === 403
          ) {

            setFuelDetails([]);

            alert(
              error.response?.data?.message ||
              "You do not have permission to view this fuel information."
            );

            return;

          }


          setFuelDetails([]);


          alert(
            error.response?.data?.error ||
            error.response?.data?.message ||
            "Failed to fetch fuel details."
          );


        } finally {

          setLoading(false);

        }

      },

      [
        fuelData.registration_number,
        startDate,
        endDate
      ]

    );


  // =====================================================
  // CLEAR FUEL RECORD
  // =====================================================

  const clearFuelRecord =
    async (fuelId) => {

      if (
        userType !== "owner" &&
        userType !== "manager" &&
        userType !== "lorry_manager"
      ) {

        alert(
          "You do not have permission to clear fuel records."
        );

        return;

      }


      if (
        userType === "lorry_manager" &&
        !canManageThisLorry()
      ) {

        alert(
          "You are not assigned to this lorry."
        );

        return;

      }


      const confirmed =
        window.confirm(
          "Are you sure you want to mark this fuel record as cleared?\n\nThe fuel record will NOT be deleted."
        );


      if (!confirmed) {

        return;

      }


      try {

        setLoading(true);


        await api.put(
          `/fuel/clear/${fuelId}`
        );


        setFuelDetails(
          previousDetails =>

            previousDetails.map(
              fuel => {

                if (
                  fuel.id === fuelId
                ) {

                  return {
                    ...fuel,
                    status:
                      "cleared"
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


        if (
          error.response?.status === 401
        ) {

          alert(
            "Session expired. Please login again."
          );

          handleUnauthorized();

          return;

        }


        if (
          error.response?.status === 403
        ) {

          alert(
            error.response?.data?.message ||
            "You do not have permission to clear this fuel record."
          );

          return;

        }


        alert(
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to clear fuel record."
        );


      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney =
    value => {

      const number =
        Number(value) || 0;


      return number.toLocaleString(
        "en-IN",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      );

    };


  // =====================================================
  // FORMAT NUMBER
  // =====================================================

  const formatNumber =
    value => {

      const number =
        Number(value) || 0;


      return number.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 2
        }
      );

    };


  // =====================================================
  // CALCULATE SUMMARY
  // =====================================================

  const totalLitres =
    fuelDetails.reduce(
      (
        total,
        fuel
      ) =>
        total +
        (
          Number(
            fuel.litres_filled
          ) || 0
        ),
      0
    );


  const totalFuelCost =
    fuelDetails.reduce(
      (
        total,
        fuel
      ) =>
        total +
        (
          Number(
            fuel.total_amount
          ) || 0
        ),
      0
    );


  const totalPaid =
    fuelDetails.reduce(
      (
        total,
        fuel
      ) =>
        total +
        (
          Number(
            fuel.amount_paid
          ) || 0
        ),
      0
    );


  const totalPending =
    fuelDetails.reduce(
      (
        total,
        fuel
      ) =>
        total +
        (
          Number(
            fuel.remaining_amount
          ) || 0
        ),
      0
    );


  const clearedCount =
    fuelDetails.filter(
      fuel =>
        fuel.status ===
        "cleared"
    ).length;


  const pendingCount =
    fuelDetails.filter(
      fuel =>
        fuel.status !==
        "cleared"
    ).length;


  const averagePrice =
    totalLitres > 0
      ? totalFuelCost /
        totalLitres
      : 0;


  // =====================================================
  // LOADING
  // =====================================================

  if (pageLoading) {

    return (

      <LoadingScreen>

        <LoadingCard>

          <LoadingTruck>
            🚛
          </LoadingTruck>

          <LoadingTitle>
            Loading fuel management
          </LoadingTitle>

          <LoadingText>
            Preparing details for your lorry...
          </LoadingText>

        </LoadingCard>

      </LoadingScreen>

    );

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <Page>
      <ResponsiveStyle />

      {/* =================================================
          TOP NAVIGATION
      ================================================= */}

      <TopBar>

        <BackButton
          onClick={() =>
            navigate(
              `/dashboard/${lorryId}`
            )
          }
        >

          <span>
            ←
          </span>

          Dashboard

        </BackButton>


        <TopBarRight>

          <UserBadge>

            <UserAvatar>
              {(
                userName ||
                "U"
              )
                .charAt(0)
                .toUpperCase()}
            </UserAvatar>


            <div>

              <UserBadgeLabel>
                SIGNED IN AS
              </UserBadgeLabel>

              <UserBadgeName>
                {userName || "User"}
              </UserBadgeName>

            </div>

          </UserBadge>

        </TopBarRight>

      </TopBar>


      {/* =================================================
          HERO
      ================================================= */}

      <Hero>

        <HeroBackgroundCircle />

        <HeroBackgroundCircleTwo />


        <HeroContent>

          <HeroEyebrow>
            FUEL & EXPENSE MANAGEMENT
          </HeroEyebrow>


          <HeroTitle>
            Fuel Management
          </HeroTitle>


          <HeroDescription>
            Track every litre, payment and
            outstanding fuel expense for this
            drilling lorry in one place.
          </HeroDescription>


          <HeroFooter>

            <HeroLorry>

              <HeroTruckIcon>
                🚛
              </HeroTruckIcon>


              <div>

                <HeroLorryLabel>
                  CURRENT LORRY
                </HeroLorryLabel>


                <HeroLorryNumber>
                  {
                    lorry?.registration_number
                  }
                </HeroLorryNumber>

              </div>

            </HeroLorry>


            <HeroCompany>
              Sri Murugan Rig Service
            </HeroCompany>

          </HeroFooter>

        </HeroContent>

      </Hero>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <SectionHeader>

        <div>

          <SectionEyebrow>
            FUEL OVERVIEW
          </SectionEyebrow>

          <SectionTitle>
            Fuel Summary
          </SectionTitle>

          <SectionDescription>
            A quick overview of the selected
            fuel records.
          </SectionDescription>

        </div>

      </SectionHeader>


      <SummaryGrid>


        {/* TOTAL LITRES */}

        <SummaryCard>

          <SummaryIcon>
            ⛽
          </SummaryIcon>


          <SummaryContent>

            <SummaryLabel>
              TOTAL LITRES
            </SummaryLabel>


            <SummaryValue>
              {formatNumber(
                totalLitres
              )}{" "}
              L
            </SummaryValue>


            <SummaryHint>
              Fuel consumed
            </SummaryHint>

          </SummaryContent>

        </SummaryCard>


        {/* TOTAL COST */}

        <SummaryCard>

          <SummaryIcon>
            ₹
          </SummaryIcon>


          <SummaryContent>

            <SummaryLabel>
              TOTAL FUEL COST
            </SummaryLabel>


            <SummaryValue>
              ₹
              {formatMoney(
                totalFuelCost
              )}
            </SummaryValue>


            <SummaryHint>
              Total fuel value
            </SummaryHint>

          </SummaryContent>

        </SummaryCard>


        {/* PAID */}

        <SummaryCard>

          <SummaryIcon>
            ✓
          </SummaryIcon>


          <SummaryContent>

            <SummaryLabel>
              AMOUNT PAID
            </SummaryLabel>


            <SummaryValue>
              ₹
              {formatMoney(
                totalPaid
              )}
            </SummaryValue>


            <SummaryHint>
              Payments recorded
            </SummaryHint>

          </SummaryContent>

        </SummaryCard>


        {/* PENDING */}

        <SummaryCard $danger={totalPending > 0}>

          <SummaryIcon $danger={totalPending > 0}>
            !
          </SummaryIcon>


          <SummaryContent>

            <SummaryLabel>
              OUTSTANDING
            </SummaryLabel>


            <SummaryValue $danger={totalPending > 0}>
              ₹
              {formatMoney(
                totalPending
              )}
            </SummaryValue>


            <SummaryHint>
              Pending fuel amount
            </SummaryHint>

          </SummaryContent>

        </SummaryCard>


      </SummaryGrid>


      {/* =================================================
          ADD FUEL
      ================================================= */}

      {
        (
          userType === "owner" ||
          userType === "manager" ||
          userType === "lorry_manager"
        ) && (

          <Section>

            <SectionHeader>

              <div>

                <SectionEyebrow>
                  NEW ENTRY
                </SectionEyebrow>

                <SectionTitle>
                  Add Fuel Record
                </SectionTitle>

                <SectionDescription>
                  Record the fuel filled for this
                  lorry.
                </SectionDescription>

              </div>


              <PermissionBadge>

                ● Authorized
              </PermissionBadge>

            </SectionHeader>


            <FuelFormCard>


              {/* LORRY */}

              <FormLorryBanner>

                <FormLorryIcon>
                  🚛
                </FormLorryIcon>


                <div>

                  <FormLorryLabel>
                    FUEL ENTRY FOR
                  </FormLorryLabel>


                  <FormLorryNumber>
                    {
                      fuelData.registration_number
                    }
                  </FormLorryNumber>

                </div>


                <LockedBadge>
                  Locked
                </LockedBadge>

              </FormLorryBanner>


              <FormGrid>


                {/* DATE */}

                <FormField>

                  <FormLabel>
                    Date Filled
                  </FormLabel>


                  <StyledTextField

                    type="date"

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

                    fullWidth

                  />

                </FormField>


                {/* BUNK */}

                <FormField>

                  <FormLabel>
                    Fuel Station / Bunk
                  </FormLabel>


                  <StyledTextField

                    name="bunk_name"

                    value={
                      fuelData.bunk_name
                    }

                    onChange={
                      handleChange
                    }

                    placeholder="e.g. Indian Oil, HP, Bharat Petroleum"

                    fullWidth

                  />

                </FormField>


                {/* LITRES */}

                <FormField>

                  <FormLabel>
                    Litres Filled
                  </FormLabel>


                  <InputWithUnit>

                    <StyledTextField

                      type="number"

                      name="litres_filled"

                      value={
                        fuelData.litres_filled
                      }

                      onChange={
                        handleChange
                      }

                      placeholder="0.00"

                      fullWidth

                      inputProps={{
                        min: 0,
                        step: "0.01"
                      }}

                    />

                    <Unit>
                      L
                    </Unit>

                  </InputWithUnit>

                </FormField>


                {/* PRICE */}

                <FormField>

                  <FormLabel>
                    Price Per Litre
                  </FormLabel>


                  <InputWithPrefix>

                    <Prefix>
                      ₹
                    </Prefix>


                    <StyledTextField

                      type="number"

                      name="price_per_litre"

                      value={
                        fuelData.price_per_litre
                      }

                      onChange={
                        handleChange
                      }

                      placeholder="0.00"

                      fullWidth

                      inputProps={{
                        min: 0,
                        step: "0.01"
                      }}

                    />

                  </InputWithPrefix>

                </FormField>


                {/* AMOUNT PAID */}

                <FormField>

                  <FormLabel>
                    Amount Paid
                  </FormLabel>


                  <InputWithPrefix>

                    <Prefix>
                      ₹
                    </Prefix>


                    <StyledTextField

                      type="number"

                      name="amount_paid"

                      value={
                        fuelData.amount_paid
                      }

                      onChange={
                        handleChange
                      }

                      placeholder="0.00"

                      fullWidth

                      inputProps={{
                        min: 0,
                        step: "0.01"
                      }}

                    />

                  </InputWithPrefix>

                </FormField>


                {/* CALCULATED TOTAL */}

                <CalculatedCard>

                  <CalculatedLabel>
                    ESTIMATED FUEL VALUE
                  </CalculatedLabel>


                  <CalculatedValue>

                    ₹
                    {formatMoney(
                      (
                        Number(
                          fuelData.litres_filled
                        ) || 0
                      ) *
                      (
                        Number(
                          fuelData.price_per_litre
                        ) || 0
                      )
                    )}

                  </CalculatedValue>


                  <CalculatedHint>
                    Litres × price per litre
                  </CalculatedHint>

                </CalculatedCard>


              </FormGrid>


              <FormFooter>

                <FormHint>
                  Make sure the fuel station,
                  quantity and payment amount
                  are correct before saving.
                </FormHint>


                <PrimaryButton

                  onClick={
                    addFuelDetails
                  }

                  disabled={
                    loading
                  }

                >

                  {loading
                    ? "Saving..."
                    : "Add Fuel Record"}

                  <span>
                    →
                  </span>

                </PrimaryButton>

              </FormFooter>

            </FuelFormCard>

          </Section>

        )
      }


      {/* =================================================
          FILTER
      ================================================= */}

      <Section>

        <SectionHeader>

          <div>

            <SectionEyebrow>
              FUEL HISTORY
            </SectionEyebrow>

            <SectionTitle>
              Search Fuel Records
            </SectionTitle>

            <SectionDescription>
              Select a date range to view fuel
              transactions for{" "}
              <strong>
                {
                  lorry?.registration_number
                }
              </strong>
              .
            </SectionDescription>

          </div>


          {
            fuelDetails.length > 0 && (

              <RecordsBadge>

                {fuelDetails.length}

                {" "}

                Record
                {
                  fuelDetails.length !== 1
                    ? "s"
                    : ""
                }

              </RecordsBadge>

            )
          }

        </SectionHeader>


        <FilterCard>


          <FilterField>

            <FilterLabel>
              FROM DATE
            </FilterLabel>


            <DatePicker

              selected={
                startDate
              }

              onChange={
                date =>
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

              dateFormat="dd MMM yyyy"

              placeholderText="Select start date"

              customInput={
                <DateInput />
              }

            />

          </FilterField>


          <DateArrow>
            →
          </DateArrow>


          <FilterField>

            <FilterLabel>
              TO DATE
            </FilterLabel>


            <DatePicker

              selected={
                endDate
              }

              onChange={
                date =>
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

              dateFormat="dd MMM yyyy"

              placeholderText="Select end date"

              customInput={
                <DateInput />
              }

            />

          </FilterField>


          <FetchButton

            onClick={
              fetchFuelDetails
            }

            disabled={
              loading
            }

          >

            {loading
              ? "Fetching..."
              : "View Records"}

            <span>
              →
            </span>

          </FetchButton>

        </FilterCard>

      </Section>


      {/* =================================================
          FUEL HISTORY
      ================================================= */}

      <Section>

        <HistoryCard>


          <HistoryHeader>

            <div>

              <HistoryTitle>
                Fuel Transactions
              </HistoryTitle>

              <HistorySubtitle>

                {
                  fuelDetails.length > 0
                    ? `Showing ${fuelDetails.length} fuel record${
                        fuelDetails.length !== 1
                          ? "s"
                          : ""
                      }`
                    : "No records loaded yet"
                }

              </HistorySubtitle>

            </div>


            <HistoryLorry>

              🚛

              {" "}

              {
                lorry?.registration_number
              }

            </HistoryLorry>

          </HistoryHeader>


          {
            fuelDetails.length > 0 ? (

              <TableWrapper>

                <FuelTable>

                  <thead>

                    <tr>

                      <TableHeader>
                        Date
                      </TableHeader>

                      <TableHeader>
                        Fuel Station
                      </TableHeader>

                      <TableHeader>
                        Quantity
                      </TableHeader>

                      <TableHeader>
                        Price / L
                      </TableHeader>

                      <TableHeader>
                        Fuel Value
                      </TableHeader>

                      <TableHeader>
                        Paid
                      </TableHeader>

                      <TableHeader>
                        Pending
                      </TableHeader>

                      <TableHeader>
                        Status
                      </TableHeader>

                      <TableHeader>
                        Action
                      </TableHeader>

                    </tr>

                  </thead>


                  <tbody>

                    {
                      fuelDetails.map(
                        fuel => (

                          <FuelRow
                            key={
                              fuel.id
                            }
                          >

                            <TableData>

                              <DateMain>
                                {
                                  fuel.date_filled
                                }
                              </DateMain>

                            </TableData>


                            <TableData>

                              <BunkName>
                                {
                                  fuel.bunk_name
                                }
                              </BunkName>

                            </TableData>


                            <TableData>

                              <QuantityValue>
                                {
                                  formatNumber(
                                    fuel.litres_filled
                                  )
                                }

                                <QuantityUnit>
                                  L
                                </QuantityUnit>

                              </QuantityValue>

                            </TableData>


                            <TableData>

                              ₹
                              {formatMoney(
                                fuel.price_per_litre
                              )}

                            </TableData>


                            <TableData>

                              <StrongMoney>
                                ₹
                                {formatMoney(
                                  fuel.total_amount
                                )}
                              </StrongMoney>

                            </TableData>


                            <TableData>

                              <PaidMoney>
                                ₹
                                {formatMoney(
                                  fuel.amount_paid
                                )}
                              </PaidMoney>

                            </TableData>


                            <TableData>

                              {
                                Number(
                                  fuel.remaining_amount
                                ) > 0 ? (

                                  <PendingMoney>
                                    ₹
                                    {formatMoney(
                                      fuel.remaining_amount
                                    )}
                                  </PendingMoney>

                                ) : (

                                  <ZeroMoney>
                                    ₹0.00
                                  </ZeroMoney>

                                )
                              }

                            </TableData>


                            <TableData>

                              {
                                fuel.status ===
                                "cleared" ? (

                                  <StatusBadge $cleared>

                                    <StatusDot $cleared />

                                    Cleared

                                  </StatusBadge>

                                ) : (

                                  <StatusBadge>

                                    <StatusDot />

                                    Pending

                                  </StatusBadge>

                                )
                              }

                            </TableData>


                            <TableData>

                              {
                                fuel.status !==
                                  "cleared" &&
                                (
                                  userType ===
                                    "owner" ||
                                  userType ===
                                    "manager" ||
                                  userType ===
                                    "lorry_manager"
                                ) ? (

                                  <ClearAction

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

                                  </ClearAction>

                                ) : (

                                  <ActionPlaceholder>
                                    —
                                  </ActionPlaceholder>

                                )
                              }

                            </TableData>

                          </FuelRow>

                        )
                      )
                    }

                  </tbody>

                </FuelTable>

              </TableWrapper>

            ) : (

              <EmptyHistory>

                <EmptyFuelIcon>
                  ⛽
                </EmptyFuelIcon>


                <EmptyTitle>
                  No fuel records found
                </EmptyTitle>


                <EmptyDescription>

                  Select a date range above
                  and click{" "}
                  <strong>
                    View Records
                  </strong>{" "}
                  to load fuel transactions
                  for this lorry.

                </EmptyDescription>

              </EmptyHistory>

            )
          }


          {/* =================================================
              HISTORY SUMMARY
          ================================================= */}

          {
            fuelDetails.length > 0 && (

              <HistoryFooter>


                <FooterStat>

                  <FooterStatLabel>
                    RECORDS
                  </FooterStatLabel>

                  <FooterStatValue>
                    {fuelDetails.length}
                  </FooterStatValue>

                </FooterStat>


                <FooterStat>

                  <FooterStatLabel>
                    CLEARED
                  </FooterStatLabel>

                  <FooterStatValue $green>
                    {clearedCount}
                  </FooterStatValue>

                </FooterStat>


                <FooterStat>

                  <FooterStatLabel>
                    PENDING
                  </FooterStatLabel>

                  <FooterStatValue $orange>
                    {pendingCount}
                  </FooterStatValue>

                </FooterStat>


                <FooterStat>

                  <FooterStatLabel>
                    AVG. PRICE / L
                  </FooterStatLabel>

                  <FooterStatValue>
                    ₹
                    {formatMoney(
                      averagePrice
                    )}
                  </FooterStatValue>

                </FooterStat>


                <FooterStat $highlight>

                  <FooterStatLabel>
                    TOTAL OUTSTANDING
                  </FooterStatLabel>

                  <FooterStatValue $red>
                    ₹
                    {formatMoney(
                      totalPending
                    )}
                  </FooterStatValue>

                </FooterStat>


              </HistoryFooter>

            )
          }

        </HistoryCard>

      </Section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <PageFooter>

        <FooterBrand>
          Sri Murugan Rig Service
        </FooterBrand>


        <FooterTagline>
          Since 2001 — Reliability at Every Depth.
        </FooterTagline>

      </PageFooter>

    </Page>

  );

};


export default FuelPage;


// =====================================================
// STYLES
// =====================================================


// =====================================================
// PAGE
// =====================================================

const Page = styled.div`

  min-height: 100vh;

  padding:
    25px 42px 60px;

  background:

    radial-gradient(
      circle at 8% 5%,
      rgba(34, 197, 94, 0.07),
      transparent 28%
    ),

    radial-gradient(
      circle at 92% 12%,
      rgba(20, 83, 45, 0.05),
      transparent 25%
    ),

    linear-gradient(
      135deg,
      #f8faf9 0%,
      #eef5f0 100%
    );

`;


// =====================================================
// TOP BAR
// =====================================================

const TopBar = styled.div`

  max-width: 1450px;

  margin:
    0 auto 25px;

  min-height: 62px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

`;


// =====================================================
// BACK BUTTON
// =====================================================

const BackButton = styled.button`

  display: flex;

  align-items: center;

  gap: 10px;

  min-height: 48px;

  padding:
    0 17px;

  border:
    1px solid #dce7e1;

  border-radius: 12px;

  background: #ffffff;

  color: #334155;

  font-size: 13px;

  font-weight: 800;

  cursor: pointer;

  box-shadow:
    0 5px 16px
    rgba(15, 23, 42, 0.045);

  transition:
    all 0.2s ease;


  span {

    font-size: 21px;

  }


  &:hover {

    transform:
      translateX(-3px);

    border-color:
      #86efac;

    color:
      #166534;

  }

`;


// =====================================================
// TOP BAR RIGHT
// =====================================================

const TopBarRight = styled.div`

  display: flex;

  align-items: center;

`;


// =====================================================
// USER BADGE
// =====================================================

const UserBadge = styled.div`

  display: flex;

  align-items: center;

  gap: 10px;

  padding:
    7px 12px;

  border:
    1px solid #dce7e1;

  border-radius: 13px;

  background:
    rgba(255, 255, 255, 0.9);

`;


// =====================================================
// USER AVATAR
// =====================================================

const UserAvatar = styled.div`

  width: 34px;

  height: 34px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

  background:
    #166534;

  color: white;

  font-size: 13px;

  font-weight: 900;

`;


// =====================================================
// USER BADGE LABEL
// =====================================================

const UserBadgeLabel = styled.div`

  color: #94a3b8;

  font-size: 8px;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// USER BADGE NAME
// =====================================================

const UserBadgeName = styled.div`

  color: #172554;

  font-size: 12px;

  font-weight: 800;

`;


// =====================================================
// HERO
// =====================================================

const Hero = styled.section`

  position: relative;

  max-width: 1450px;

  min-height: 310px;

  margin:
    0 auto 35px;

  padding:
    48px 55px;

  overflow: hidden;

  border-radius: 27px;

  background:
    linear-gradient(
      120deg,
      #12372a,
      #1f513c 55%,
      #2d6a4f
    );

  box-shadow:
    0 20px 45px
    rgba(18, 55, 42, 0.18);

`;


// =====================================================
// HERO CONTENT
// =====================================================

const HeroContent = styled.div`

  position: relative;

  z-index: 3;

  max-width: 800px;

`;


// =====================================================
// HERO EYEBROW
// =====================================================

const HeroEyebrow = styled.div`

  color:
    #bbf7d0;

  font-size: 11px;

  font-weight: 900;

  letter-spacing: 2px;

`;


// =====================================================
// HERO TITLE
// =====================================================

const HeroTitle = styled.h1`

  margin:
    10px 0 0;

  color: #ffffff;

  font-size: 48px;

  line-height: 1.05;

  font-weight: 900;

  letter-spacing: -1.5px;

`;


// =====================================================
// HERO DESCRIPTION
// =====================================================

const HeroDescription = styled.p`

  max-width: 680px;

  margin:
    17px 0 0;

  color:
    #d9ede0;

  font-size: 16px;

  line-height: 1.7;

`;


// =====================================================
// HERO FOOTER
// =====================================================

const HeroFooter = styled.div`

  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 20px;

  margin-top: 27px;

`;


// =====================================================
// HERO LORRY
// =====================================================

const HeroLorry = styled.div`

  display: flex;

  align-items: center;

  gap: 12px;

  padding:
    9px 14px;

  border:
    1px solid
    rgba(255, 255, 255, 0.12);

  border-radius: 13px;

  background:
    rgba(255, 255, 255, 0.08);

`;


// =====================================================
// HERO TRUCK ICON
// =====================================================

const HeroTruckIcon = styled.div`

  width: 40px;

  height: 40px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 11px;

  background:
    rgba(255, 255, 255, 0.12);

  font-size: 21px;

`;


// =====================================================
// HERO LORRY LABEL
// =====================================================

const HeroLorryLabel = styled.div`

  color:
    #a7f3d0;

  font-size: 8px;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// HERO LORRY NUMBER
// =====================================================

const HeroLorryNumber = styled.div`

  margin-top: 3px;

  color: #ffffff;

  font-size: 17px;

  font-weight: 900;

  letter-spacing: 0.7px;

`;


// =====================================================
// HERO COMPANY
// =====================================================

const HeroCompany = styled.div`

  color:
    #d1fae5;

  font-size: 13px;

  font-weight: 700;

`;


// =====================================================
// HERO CIRCLE
// =====================================================

const HeroBackgroundCircle = styled.div`

  position: absolute;

  right: -130px;

  top: -200px;

  width: 520px;

  height: 520px;

  border-radius: 50%;

  border:
    1px solid
    rgba(255,255,255,0.10);

`;


// =====================================================
// HERO CIRCLE TWO
// =====================================================

const HeroBackgroundCircleTwo = styled.div`

  position: absolute;

  right: 90px;

  bottom: -250px;

  width: 480px;

  height: 480px;

  border-radius: 50%;

  border:
    1px solid
    rgba(255,255,255,0.07);

`;


// =====================================================
// SECTION
// =====================================================

const Section = styled.section`

  max-width: 1450px;

  margin:
    0 auto 35px;

`;


// =====================================================
// SECTION HEADER
// =====================================================

const SectionHeader = styled.div`

  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 19px;

`;


// =====================================================
// SECTION EYEBROW
// =====================================================

const SectionEyebrow = styled.div`

  color:
    #3f6f5a;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1.8px;

  margin-bottom: 5px;

`;


// =====================================================
// SECTION TITLE
// =====================================================

const SectionTitle = styled.h2`

  margin: 0;

  color:
    #172554;

  font-size: 28px;

  font-weight: 900;

  letter-spacing: -0.6px;

`;


// =====================================================
// SECTION DESCRIPTION
// =====================================================

const SectionDescription = styled.div`

  margin-top: 6px;

  color:
    #64748b;

  font-size: 13px;

  line-height: 1.5;

  strong {

    color:
      #166534;

  }

`;


// =====================================================
// SUMMARY GRID
// =====================================================

const SummaryGrid = styled.div`

  max-width: 1450px;

  margin:
    0 auto 38px;

  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 17px;

`;


// =====================================================
// SUMMARY CARD
// =====================================================

const SummaryCard = styled.div`

  min-height: 150px;

  display: flex;

  align-items: center;

  gap: 16px;

  padding: 23px;

  border:
    1px solid
    ${({ $danger }) =>
      $danger
        ? "#fecaca"
        : "#dce7e1"};

  border-radius: 20px;

  background:
    ${({ $danger }) =>
      $danger
        ? "#fffafa"
        : "#ffffff"};

  box-shadow:
    0 8px 24px
    rgba(15,23,42,0.05);

`;


// =====================================================
// SUMMARY ICON
// =====================================================

const SummaryIcon = styled.div`

  width: 55px;

  height: 55px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 16px;

  background:
    ${({ $danger }) =>
      $danger
        ? "#fef2f2"
        : "#ecfdf5"};

  color:
    ${({ $danger }) =>
      $danger
        ? "#dc2626"
        : "#166534"};

  font-size: 22px;

  font-weight: 900;

`;


// =====================================================
// SUMMARY CONTENT
// =====================================================

const SummaryContent = styled.div`

  min-width: 0;

`;


// =====================================================
// SUMMARY LABEL
// =====================================================

const SummaryLabel = styled.div`

  color:
    #64748b;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// SUMMARY VALUE
// =====================================================

const SummaryValue = styled.div`

  margin-top: 5px;

  color:
    ${({ $danger }) =>
      $danger
        ? "#dc2626"
        : "#172554"};

  font-size: 24px;

  font-weight: 900;

`;


// =====================================================
// SUMMARY HINT
// =====================================================

const SummaryHint = styled.div`

  margin-top: 5px;

  color:
    #94a3b8;

  font-size: 10px;

`;


// =====================================================
// PERMISSION BADGE
// =====================================================

const PermissionBadge = styled.div`

  padding:
    9px 12px;

  border-radius: 9px;

  background:
    #ecfdf5;

  color:
    #166534;

  font-size: 10px;

  font-weight: 900;

`;


// =====================================================
// FUEL FORM CARD
// =====================================================

const FuelFormCard = styled.div`

  padding: 25px;

  border:
    1px solid #dce7e1;

  border-radius: 21px;

  background:
    #ffffff;

  box-shadow:
    0 9px 28px
    rgba(15,23,42,0.055);

`;


// =====================================================
// FORM LORRY BANNER
// =====================================================

const FormLorryBanner = styled.div`

  display: flex;

  align-items: center;

  gap: 13px;

  padding:
    15px 17px;

  margin-bottom: 23px;

  border:
    1px solid #bbf7d0;

  border-radius: 14px;

  background:
    linear-gradient(
      135deg,
      #f0fdf4,
      #ecfdf5
    );

`;


// =====================================================
// FORM LORRY ICON
// =====================================================

const FormLorryIcon = styled.div`

  width: 47px;

  height: 47px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 13px;

  background:
    #dcfce7;

  font-size: 23px;

`;


// =====================================================
// FORM LORRY LABEL
// =====================================================

const FormLorryLabel = styled.div`

  color:
    #64748b;

  font-size: 8px;

  font-weight: 900;

  letter-spacing: 1.1px;

`;


// =====================================================
// FORM LORRY NUMBER
// =====================================================

const FormLorryNumber = styled.div`

  margin-top: 3px;

  color:
    #14532d;

  font-size: 19px;

  font-weight: 900;

  letter-spacing: 0.6px;

`;


// =====================================================
// LOCKED BADGE
// =====================================================

const LockedBadge = styled.div`

  margin-left: auto;

  padding:
    6px 9px;

  border-radius: 7px;

  background:
    #ffffff;

  color:
    #64748b;

  font-size: 9px;

  font-weight: 800;

`;


// =====================================================
// FORM GRID
// =====================================================

const FormGrid = styled.div`

  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 19px;

`;


// =====================================================
// FORM FIELD
// =====================================================

const FormField = styled.div`

  min-width: 0;

`;


// =====================================================
// FORM LABEL
// =====================================================

const FormLabel = styled.label`

  display: block;

  margin-bottom: 7px;

  color:
    #334155;

  font-size: 11px;

  font-weight: 900;

`;


// =====================================================
// MATERIAL INPUT
// =====================================================

const StyledTextField = styled(TextField)`

  && {

    .MuiOutlinedInput-root {

      min-height: 52px;

      border-radius: 11px;

      background:
        #ffffff;

      font-size: 14px;

      font-weight: 600;

    }


    .MuiOutlinedInput-notchedOutline {

      border-color:
        #cbd5e1;

    }


    .MuiOutlinedInput-root:hover
    .MuiOutlinedInput-notchedOutline {

      border-color:
        #86efac;

    }


    .MuiOutlinedInput-root.Mui-focused
    .MuiOutlinedInput-notchedOutline {

      border-color:
        #22c55e;

      border-width:
        1px;

      box-shadow:
        0 0 0 3px
        rgba(34,197,94,0.09);

    }

  }

`;


// =====================================================
// INPUT PREFIX
// =====================================================

const InputWithPrefix = styled.div`

  position: relative;

`;


// =====================================================
// PREFIX
// =====================================================

const Prefix = styled.div`

  position: absolute;

  z-index: 2;

  left: 14px;

  top: 50%;

  transform:
    translateY(-50%);

  color:
    #166534;

  font-size: 15px;

  font-weight: 900;

`;


// =====================================================
// INPUT UNIT
// =====================================================

const InputWithUnit = styled.div`

  position: relative;

`;


// =====================================================
// UNIT
// =====================================================

const Unit = styled.div`

  position: absolute;

  z-index: 2;

  right: 14px;

  top: 50%;

  transform:
    translateY(-50%);

  color:
    #64748b;

  font-size: 12px;

  font-weight: 900;

`;


// =====================================================
// CALCULATED CARD
// =====================================================

const CalculatedCard = styled.div`

  min-height: 82px;

  padding:
    13px 15px;

  border:
    1px solid #bfdbfe;

  border-radius: 12px;

  background:
    #eff6ff;

`;


// =====================================================
// CALCULATED LABEL
// =====================================================

const CalculatedLabel = styled.div`

  color:
    #64748b;

  font-size: 8px;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// CALCULATED VALUE
// =====================================================

const CalculatedValue = styled.div`

  margin-top: 4px;

  color:
    #1e3a8a;

  font-size: 21px;

  font-weight: 900;

`;


// =====================================================
// CALCULATED HINT
// =====================================================

const CalculatedHint = styled.div`

  margin-top: 2px;

  color:
    #94a3b8;

  font-size: 9px;

`;


// =====================================================
// FORM FOOTER
// =====================================================

const FormFooter = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  margin-top: 23px;

  padding-top: 20px;

  border-top:
    1px solid #eef2f7;

`;


// =====================================================
// FORM HINT
// =====================================================

const FormHint = styled.div`

  max-width: 580px;

  color:
    #94a3b8;

  font-size: 11px;

  line-height: 1.5;

`;


// =====================================================
// PRIMARY BUTTON
// =====================================================

const PrimaryButton = styled.button`

  min-height: 49px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 15px;

  flex-shrink: 0;

  padding:
    0 20px;

  border: none;

  border-radius: 11px;

  background:
    linear-gradient(
      135deg,
      #166534,
      #15803d
    );

  color:
    #ffffff;

  font-size: 13px;

  font-weight: 900;

  cursor: pointer;

  box-shadow:
    0 8px 19px
    rgba(22,101,52,0.17);

  transition:
    transform 0.2s ease;

  span {

    font-size: 18px;

  }


  &:hover {

    transform:
      translateY(-2px);

  }


  &:disabled {

    opacity: 0.55;

    cursor:
      not-allowed;

    transform:
      none;

  }

`;


// =====================================================
// FILTER CARD
// =====================================================

const FilterCard = styled.div`

  display: flex;

  align-items: flex-end;

  gap: 17px;

  padding:
    22px;

  border:
    1px solid #dce7e1;

  border-radius: 18px;

  background:
    #ffffff;

  box-shadow:
    0 8px 25px
    rgba(15,23,42,0.05);

`;


// =====================================================
// FILTER FIELD
// =====================================================

const FilterField = styled.div`

  flex: 1;

  min-width: 0;

`;


// =====================================================
// FILTER LABEL
// =====================================================

const FilterLabel = styled.div`

  margin-bottom: 7px;

  color:
    #64748b;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1px;

`;


// =====================================================
// DATE INPUT
// =====================================================

const DateInput = React.forwardRef(
  (
    {
      value,
      onClick,
      placeholder
    },
    ref
  ) => (

    <DateInputBox
      onClick={
        onClick
      }
      ref={ref}
    >

      <DateIcon>
        ◷
      </DateIcon>


      <span>

        {
          value ||
          placeholder
        }

      </span>


      <DateArrowSmall>
        ▾
      </DateArrowSmall>

    </DateInputBox>

  )
);


// =====================================================
// DATE INPUT BOX
// =====================================================

const DateInputBox = styled.button`

  width: 100%;

  min-height: 52px;

  display: flex;

  align-items: center;

  gap: 10px;

  padding:
    0 14px;

  border:
    1px solid #cbd5e1;

  border-radius: 11px;

  background:
    #ffffff;

  color:
    #475569;

  font-family: inherit;

  font-size: 13px;

  font-weight: 600;

  text-align: left;

  cursor: pointer;

  &:hover {

    border-color:
      #86efac;

  }


  span {

    flex: 1;

  }

`;


// =====================================================
// DATE ICON
// =====================================================

const DateIcon = styled.div`

  color:
    #166534;

  font-size: 17px;

`;


// =====================================================
// DATE ARROW
// =====================================================

const DateArrowSmall = styled.div`

  color:
    #94a3b8;

`;


// =====================================================
// DATE ARROW BETWEEN
// =====================================================

const DateArrow = styled.div`

  padding-bottom:
    15px;

  color:
    #94a3b8;

  font-size: 20px;

`;


// =====================================================
// FETCH BUTTON
// =====================================================

const FetchButton = styled.button`

  min-width: 175px;

  min-height: 52px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 12px;

  border: none;

  border-radius: 11px;

  background:
    #172554;

  color:
    #ffffff;

  font-size: 13px;

  font-weight: 900;

  cursor: pointer;

  span {

    font-size: 18px;

  }


  &:hover {

    background:
      #1e3a8a;

  }


  &:disabled {

    opacity:
      0.55;

    cursor:
      not-allowed;

  }

`;


// =====================================================
// RECORDS BADGE
// =====================================================

const RecordsBadge = styled.div`

  padding:
    9px 12px;

  border-radius:
    9px;

  background:
    #f1f5f9;

  color:
    #475569;

  font-size:
    10px;

  font-weight:
    900;

`;


// =====================================================
// HISTORY CARD
// =====================================================

const HistoryCard = styled.div`

  overflow: hidden;

  border:
    1px solid #dce7e1;

  border-radius:
    21px;

  background:
    #ffffff;

  box-shadow:
    0 9px 28px
    rgba(15,23,42,0.055);

`;


// =====================================================
// HISTORY HEADER
// =====================================================

const HistoryHeader = styled.div`

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding:
    22px 24px;

  border-bottom:
    1px solid #eef2f7;

`;


// =====================================================
// HISTORY TITLE
// =====================================================

const HistoryTitle = styled.h3`

  margin: 0;

  color:
    #172554;

  font-size:
    20px;

  font-weight:
    900;

`;


// =====================================================
// HISTORY SUBTITLE
// =====================================================

const HistorySubtitle = styled.div`

  margin-top:
    5px;

  color:
    #94a3b8;

  font-size:
    11px;

`;


// =====================================================
// HISTORY LORRY
// =====================================================

const HistoryLorry = styled.div`

  padding:
    8px 11px;

  border-radius:
    9px;

  background:
    #f0fdf4;

  color:
    #166534;

  font-size:
    10px;

  font-weight:
    900;

`;


// =====================================================
// TABLE WRAPPER
// =====================================================

const TableWrapper = styled.div`

  width: 100%;

  overflow-x: auto;

`;


// =====================================================
// FUEL TABLE
// =====================================================

const FuelTable = styled.table`

  width: 100%;

  min-width:
    1100px;

  border-collapse:
    collapse;

`;


// =====================================================
// TABLE HEADER
// =====================================================

const TableHeader = styled.th`

  padding:
    15px 16px;

  background:
    #f8fafc;

  color:
    #64748b;

  font-size:
    9px;

  font-weight:
    900;

  letter-spacing:
    0.8px;

  text-align:
    left;

  white-space:
    nowrap;

`;


// =====================================================
// FUEL ROW
// =====================================================

const FuelRow = styled.tr`

  transition:
    background 0.15s ease;

  &:hover {

    background:
      #f8fafc;

  }

`;


// =====================================================
// TABLE DATA
// =====================================================

const TableData = styled.td`

  padding:
    17px 16px;

  border-top:
    1px solid #f1f5f9;

  color:
    #475569;

  font-size:
    12px;

  font-weight:
    600;

  white-space:
    nowrap;

`;


// =====================================================
// DATE MAIN
// =====================================================

const DateMain = styled.div`

  color:
    #334155;

  font-weight:
    800;

`;


// =====================================================
// BUNK NAME
// =====================================================

const BunkName = styled.div`

  max-width:
    180px;

  overflow:
    hidden;

  color:
    #172554;

  font-weight:
    800;

  text-overflow:
    ellipsis;

`;


// =====================================================
// QUANTITY
// =====================================================

const QuantityValue = styled.span`

  color:
    #172554;

  font-size:
    14px;

  font-weight:
    900;

`;


// =====================================================
// QUANTITY UNIT
// =====================================================

const QuantityUnit = styled.span`

  margin-left:
    3px;

  color:
    #94a3b8;

  font-size:
    10px;

  font-weight:
    800;

`;


// =====================================================
// STRONG MONEY
// =====================================================

const StrongMoney = styled.span`

  color:
    #172554;

  font-weight:
    900;

`;


// =====================================================
// PAID MONEY
// =====================================================

const PaidMoney = styled.span`

  color:
    #166534;

  font-weight:
    900;

`;


// =====================================================
// PENDING MONEY
// =====================================================

const PendingMoney = styled.span`

  color:
    #dc2626;

  font-weight:
    900;

`;


// =====================================================
// ZERO MONEY
// =====================================================

const ZeroMoney = styled.span`

  color:
    #94a3b8;

  font-weight:
    800;

`;


// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = styled.div`

  width:
    fit-content;

  display:
    flex;

  align-items:
    center;

  gap:
    6px;

  padding:
    6px 9px;

  border-radius:
    8px;

  background:
    ${({ $cleared }) =>
      $cleared
        ? "#f0fdf4"
        : "#fff7ed"};

  color:
    ${({ $cleared }) =>
      $cleared
        ? "#166534"
        : "#c2410c"};

  font-size:
    9px;

  font-weight:
    900;

`;


// =====================================================
// STATUS DOT
// =====================================================

const StatusDot = styled.span`

  width:
    6px;

  height:
    6px;

  border-radius:
    50%;

  background:
    ${({ $cleared }) =>
      $cleared
        ? "#22c55e"
        : "#f97316"};

`;


// =====================================================
// CLEAR ACTION
// =====================================================

const ClearAction = styled.button`

  min-height:
    34px;

  padding:
    0 11px;

  border:
    1px solid #bbf7d0;

  border-radius:
    8px;

  background:
    #f0fdf4;

  color:
    #166534;

  font-size:
    10px;

  font-weight:
    900;

  cursor:
    pointer;

  &:hover {

    background:
      #dcfce7;

  }


  &:disabled {

    opacity:
      0.5;

    cursor:
      not-allowed;

  }

`;


// =====================================================
// ACTION PLACEHOLDER
// =====================================================

const ActionPlaceholder = styled.span`

  color:
    #cbd5e1;

  font-size:
    15px;

`;


// =====================================================
// EMPTY HISTORY
// =====================================================

const EmptyHistory = styled.div`

  min-height:
    330px;

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  justify-content:
    center;

  padding:
    45px;

`;


// =====================================================
// EMPTY ICON
// =====================================================

const EmptyFuelIcon = styled.div`

  width:
    70px;

  height:
    70px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  margin-bottom:
    16px;

  border-radius:
    20px;

  background:
    #ecfdf5;

  font-size:
    31px;

`;


// =====================================================
// EMPTY TITLE
// =====================================================

const EmptyTitle = styled.h3`

  margin:
    0;

  color:
    #172554;

  font-size:
    19px;

  font-weight:
    900;

`;


// =====================================================
// EMPTY DESCRIPTION
// =====================================================

const EmptyDescription = styled.p`

  max-width:
    470px;

  margin:
    8px 0 0;

  color:
    #94a3b8;

  font-size:
    12px;

  line-height:
    1.6;

  text-align:
    center;

`;


// =====================================================
// HISTORY FOOTER
// =====================================================

const HistoryFooter = styled.div`

  display:
    grid;

  grid-template-columns:
    repeat(5, minmax(0, 1fr));

  border-top:
    1px solid #eef2f7;

  background:
    #fafcfb;

`;


// =====================================================
// FOOTER STAT
// =====================================================

const FooterStat = styled.div`

  min-height:
    95px;

  padding:
    18px;

  border-right:
    1px solid #eef2f7;

  background:
    ${({ $highlight }) =>
      $highlight
        ? "#fffafa"
        : "transparent"};

`;


// =====================================================
// FOOTER STAT LABEL
// =====================================================

const FooterStatLabel = styled.div`

  color:
    #94a3b8;

  font-size:
    8px;

  font-weight:
    900;

  letter-spacing:
    1px;

`;


// =====================================================
// FOOTER STAT VALUE
// =====================================================

const FooterStatValue = styled.div`

  margin-top:
    7px;

  color:
    ${({ $green, $orange, $red }) => {

      if ($green) {
        return "#166534";
      }

      if ($orange) {
        return "#c2410c";
      }

      if ($red) {
        return "#dc2626";
      }

      return "#172554";

    }};

  font-size:
    18px;

  font-weight:
    900;

`;


// =====================================================
// PAGE FOOTER
// =====================================================

const PageFooter = styled.footer`

  max-width:
    1450px;

  margin:
    35px auto 0;

  padding-top:
    22px;

  border-top:
    1px solid #dce7e1;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    20px;

`;


// =====================================================
// FOOTER BRAND
// =====================================================

const FooterBrand = styled.div`

  color:
    #166534;

  font-size:
    13px;

  font-weight:
    900;

`;


// =====================================================
// FOOTER TAGLINE
// =====================================================

const FooterTagline = styled.div`

  color:
    #94a3b8;

  font-size:
    11px;

  font-weight:
    600;

`;


// =====================================================
// LOADING SCREEN
// =====================================================

const LoadingScreen = styled.div`

  min-height:
    100vh;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  padding:
    30px;

  background:
    linear-gradient(
      135deg,
      #f8faf9,
      #eef5f0
    );

`;


// =====================================================
// LOADING CARD
// =====================================================

const LoadingCard = styled.div`

  width:
    min(430px, 100%);

  padding:
    40px;

  border:
    1px solid #dce7e1;

  border-radius:
    23px;

  background:
    #ffffff;

  text-align:
    center;

  box-shadow:
    0 20px 50px
    rgba(15,23,42,0.08);

`;


// =====================================================
// LOADING TRUCK
// =====================================================

const LoadingTruck = styled.div`

  width:
    70px;

  height:
    70px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  margin:
    0 auto 18px;

  border-radius:
    20px;

  background:
    #ecfdf5;

  font-size:
    33px;

  animation:
    pulse 1.5s ease-in-out infinite;


  @keyframes pulse {

    0%,
    100% {
      transform:
        scale(1);
    }

    50% {
      transform:
        scale(1.08);
    }

  }

`;


// =====================================================
// LOADING TITLE
// =====================================================

const LoadingTitle = styled.div`

  color:
    #172554;

  font-size:
    20px;

  font-weight:
    900;

`;


// =====================================================
// LOADING TEXT
// =====================================================

const LoadingText = styled.div`

  margin-top:
    7px;

  color:
    #94a3b8;

  font-size:
    12px;

`;


// =====================================================
// RESPONSIVE
// =====================================================

const ResponsiveStyle = styled.div`

  @media (max-width: 1100px) {

    ${FormGrid} {

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

    }


    ${SummaryGrid} {

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

    }

  }


  @media (max-width: 850px) {

    ${Page} {

      padding:
        20px 20px 50px;

    }


    ${Hero} {

      padding:
        40px 35px;

    }


    ${HeroTitle} {

      font-size:
        40px;

    }


    ${FilterCard} {

      align-items:
        stretch;

      flex-direction:
        column;

    }


    ${DateArrow} {

      display:
        none;

    }


    ${FetchButton} {

      width:
        100%;

    }


    ${HistoryFooter} {

      grid-template-columns:
        repeat(3, 1fr);

    }

  }


  @media (max-width: 650px) {

    ${Page} {

      padding:
        14px 14px 40px;

    }


    ${TopBar} {

      min-height:
        52px;

    }


    ${UserBadge} {

      display:
        none;

    }


    ${Hero} {

      min-height:
        390px;

      padding:
        32px 25px;

      border-radius:
        22px;

    }


    ${HeroTitle} {

      font-size:
        34px;

    }


    ${HeroDescription} {

      font-size:
        14px;

    }


    ${HeroFooter} {

      align-items:
        flex-start;

      flex-direction:
        column;

    }


    ${SummaryGrid} {

      grid-template-columns:
        1fr;

    }


    ${SectionTitle} {

      font-size:
        25px;

    }


    ${SectionHeader} {

      align-items:
        flex-start;

      flex-direction:
        column;

    }


    ${FuelFormCard} {

      padding:
        19px;

    }


    ${FormGrid} {

      grid-template-columns:
        1fr;

    }


    ${FormFooter} {

      align-items:
        stretch;

      flex-direction:
        column;

    }


    ${PrimaryButton} {

      width:
        100%;

    }


    ${HistoryHeader} {

      align-items:
        flex-start;

      flex-direction:
        column;

    }


    ${HistoryLorry} {

      width:
        100%;

    }


    ${HistoryFooter} {

      grid-template-columns:
        repeat(2, 1fr);

    }


    ${FooterStat} {

      border-bottom:
        1px solid #eef2f7;

    }


    ${PageFooter} {

      align-items:
        flex-start;

      flex-direction:
        column;

    }

  }


  @media (max-width: 420px) {

    ${HeroTitle} {

      font-size:
        30px;

    }


    ${HeroDescription} {

      font-size:
        13px;

    }


    ${FormLorryBanner} {

      align-items:
        flex-start;

    }


    ${LockedBadge} {

      display:
        none;

    }


    ${HistoryFooter} {

      grid-template-columns:
        1fr;

    }

  }

`;


// =====================================================
// NOTE
// =====================================================
//
// ResponsiveStyle is intentionally included as a
// CSS component. To activate it, render:
//
// <ResponsiveStyle />
//
// immediately inside the Page.
//
// =====================================================