import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import { useNavigate } from "react-router-dom";

import styled from "styled-components";

import api from "../utils/api";

import LorryImage from "../assets/images/TN34K3749.jpeg";


const OwnerPage = () => {

  const navigate = useNavigate();


  // =====================================================
  // USER
  // =====================================================

  const userName =
    localStorage.getItem("userName");


  // =====================================================
  // STATE
  // =====================================================

  const [lorries, setLorries] =
    useState([]);

  const [managers, setManagers] =
    useState([]);

  const [selectedManagers, setSelectedManagers] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [isFormVisible, setIsFormVisible] =
    useState(false);


  // =====================================================
  // ADD LORRY FORM STATE
  // =====================================================

  const [registrationNumber, setRegistrationNumber] =
    useState("");

  const [ownerPhone, setOwnerPhone] =
    useState("");

  const [model, setModel] =
    useState("");

  const [yearBuilt, setYearBuilt] =
    useState("");

  const [ownerName, setOwnerName] =
    useState("");


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = useCallback(() => {

    localStorage.removeItem(
      "authToken"
    );

    localStorage.removeItem(
      "userId"
    );

    localStorage.removeItem(
      "userType"
    );

    localStorage.removeItem(
      "userName"
    );

    navigate("/login");

  }, [navigate]);


  // =====================================================
  // FETCH LORRIES
  // =====================================================

  const fetchLorries = useCallback(
    async () => {

      try {

        setLoading(true);

        const response =
          await api.get("/lorry");

        setLorries(
          response.data
        );

        console.log(
          "Owner - Lorries:",
          response.data
        );

      } catch (error) {

        console.error(
          "Error fetching lorries:",
          error
        );

        if (
          error.response?.status === 401
        ) {

          logout();

          return;
        }

        alert(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Error fetching lorries."
        );

      } finally {

        setLoading(false);

      }

    },
    [logout]
  );


  // =====================================================
  // FETCH LORRY MANAGERS
  // =====================================================

  const fetchManagers = useCallback(
    async () => {

      try {

        const response =
          await api.get(
            "/lorry/managers"
          );

        setManagers(
          response.data
        );

        console.log(
          "Available lorry managers:",
          response.data
        );

      } catch (error) {

        console.error(
          "Error fetching managers:",
          error
        );

        if (
          error.response?.status === 401
        ) {

          logout();

          return;
        }

        alert(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to fetch lorry managers."
        );

      }

    },
    [logout]
  );


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchLorries();

    fetchManagers();

  }, [
    fetchLorries,
    fetchManagers
  ]);


  // =====================================================
  // ADD LORRY BUTTON
  // =====================================================

  const handleAddLorry = () => {

    setIsFormVisible(
      !isFormVisible
    );

  };


  // =====================================================
  // ADD LORRY
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const newLorry = {

        registration_number:
          registrationNumber,

        owner_phone:
          ownerPhone,

        model,

        year_built:
          yearBuilt,

        owner_name:
          ownerName

      };


      await api.post(
        "/lorry/add",
        newLorry
      );


      alert(
        "Lorry added successfully."
      );


      // Clear form

      setRegistrationNumber("");

      setOwnerPhone("");

      setModel("");

      setYearBuilt("");

      setOwnerName("");

      setIsFormVisible(false);


      await fetchLorries();

    } catch (error) {

      console.error(
        "Error adding lorry:",
        error
      );

      if (
        error.response?.status === 401
      ) {

        logout();

        return;
      }

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add lorry."
      );

    }

  };


  // =====================================================
  // DELETE LORRY
  // =====================================================

  const handleDeleteLorry = async (
    lorryId,
    registrationNumber
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete lorry ${registrationNumber}?`
      );


    if (!confirmed) {

      return;

    }


    try {

      setLoading(true);


      await api.delete(
        `/lorry/${lorryId}`
      );


      alert(
        "Lorry deleted successfully."
      );


      setLorries(
        (previousLorries) =>
          previousLorries.filter(
            (lorry) =>
              lorry.id !== lorryId
          )
      );

    } catch (error) {

      console.error(
        "Error deleting lorry:",
        error
      );


      if (
        error.response?.status === 401
      ) {

        logout();

        return;
      }


      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete lorry."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // SELECT MANAGER
  // =====================================================

  const handleManagerChange = (
    lorryId,
    managerId
  ) => {

    setSelectedManagers(
      (previous) => ({
        ...previous,
        [lorryId]: managerId
      })
    );

  };


  // =====================================================
  // ASSIGN MANAGER
  // =====================================================

  const handleAssignManager = async (
    lorryId
  ) => {

    const managerId =
      selectedManagers[lorryId];


    if (!managerId) {

      alert(
        "Please select a lorry manager."
      );

      return;
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to assign this lorry manager?\n\n" +
        "If the manager is currently assigned to another lorry, " +
        "they will be moved to this lorry."
      );


    if (!confirmed) {

      return;

    }


    try {

      setLoading(true);


      await api.put(
        `/lorry/${lorryId}/manager`,
        {
          managerId:
            Number(managerId)
        }
      );


      alert(
        "Lorry manager assigned successfully."
      );


      await fetchLorries();


      setSelectedManagers(
        (previous) => {

          const updated = {
            ...previous
          };

          delete updated[
            lorryId
          ];

          return updated;

        }
      );

    } catch (error) {

      console.error(
        "Error assigning manager:",
        error
      );


      if (
        error.response?.status === 401
      ) {

        logout();

        return;
      }


      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to assign lorry manager."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // REMOVE MANAGER
  // =====================================================

  const handleRemoveManager = async (
    lorryId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to remove the lorry manager?"
      );


    if (!confirmed) {

      return;

    }


    try {

      setLoading(true);


      await api.delete(
        `/lorry/${lorryId}/manager`
      );


      alert(
        "Lorry manager removed successfully."
      );


      await fetchLorries();

    } catch (error) {

      console.error(
        "Error removing manager:",
        error
      );


      if (
        error.response?.status === 401
      ) {

        logout();

        return;
      }


      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to remove lorry manager."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // OPEN DASHBOARD
  // =====================================================

  const handleLorryClick = (
    lorryId
  ) => {

    navigate(
      `/dashboard/${lorryId}`
    );

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <Container>

      <Header>

        <CompanyName>
          Sri Murugan Rig Service
        </CompanyName>


        <UserSection>

          <UserName>
            {userName || "Owner"}
          </UserName>


          <UserRole>
            OWNER
          </UserRole>


          <LogoutButton
            onClick={logout}
          >
            Logout
          </LogoutButton>

        </UserSection>

      </Header>


      {/* =================================================
          ADD LORRY
      ================================================= */}

      <AddLorryButton
        onClick={handleAddLorry}
      >

        {isFormVisible
          ? "Cancel"
          : "+ Add Lorry"}

      </AddLorryButton>


      {/* =================================================
          ADD LORRY FORM
      ================================================= */}

      {isFormVisible && (

        <AddLorryForm
          onSubmit={handleSubmit}
        >

          <Input
            type="text"
            placeholder="Registration Number"
            value={registrationNumber}
            onChange={(e) =>
              setRegistrationNumber(
                e.target.value
              )
            }
            required
          />


          <Input
            type="text"
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) =>
              setOwnerName(
                e.target.value
              )
            }
            required
          />


          <Input
            type="text"
            placeholder="Owner Phone"
            value={ownerPhone}
            onChange={(e) =>
              setOwnerPhone(
                e.target.value
              )
            }
            required
          />


          <Input
            type="text"
            placeholder="Model"
            value={model}
            onChange={(e) =>
              setModel(
                e.target.value
              )
            }
            required
          />


          <Input
            type="number"
            placeholder="Year Built"
            value={yearBuilt}
            onChange={(e) =>
              setYearBuilt(
                e.target.value
              )
            }
            required
          />


          <SubmitButton
            type="submit"
          >
            Add Lorry
          </SubmitButton>

        </AddLorryForm>

      )}


      {/* =================================================
          LORRIES
      ================================================= */}

      <LorryList>

        {loading &&
        lorries.length === 0 ? (

          <LoadingText>
            Loading lorries...
          </LoadingText>

        ) : lorries.length === 0 ? (

          <NoLorries>
            No lorries available.
          </NoLorries>

        ) : (

          lorries.map(
            (lorry) => (

              <LorryCard
                key={lorry.id}
              >

                <CardContent
                  onClick={() =>
                    handleLorryClick(
                      lorry.id
                    )
                  }
                >

                  <OwnerPhone>
                    {lorry.owner_phone ||
                      "Unknown Owner"}
                  </OwnerPhone>


                  <ImageContainer>

                    <img
                      src={LorryImage}
                      alt="Lorry"
                    />

                  </ImageContainer>


                  <Details>

                    <div>
                      <strong>
                        Owner:
                      </strong>{" "}
                      {lorry.owner_name}
                    </div>


                    <div>
                      <strong>
                        Registration:
                      </strong>{" "}
                      {lorry.registration_number}
                    </div>


                    <div>
                      <strong>
                        Model:
                      </strong>{" "}
                      {lorry.model}
                    </div>


                    <div>
                      <strong>
                        Year Built:
                      </strong>{" "}
                      {lorry.year_built}
                    </div>


                    <ManagerInfo>

                      <strong>
                        Lorry Manager:
                      </strong>{" "}


                      {lorry.lorry_manager_name
                        ? `${lorry.lorry_manager_name} (${lorry.lorry_manager_phone})`
                        : "Not Assigned"}

                    </ManagerInfo>

                  </Details>

                </CardContent>


                {/* =================================================
                    MANAGER ASSIGNMENT
                ================================================= */}

                <ManagerSection
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >

                  <ManagerSelect
                    value={
                      selectedManagers[
                        lorry.id
                      ] || ""
                    }
                    onChange={(e) =>
                      handleManagerChange(
                        lorry.id,
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Lorry Manager
                    </option>


                    {managers.map(
                      (manager) => (

                        <option
                          key={manager.id}
                          value={manager.id}
                        >

                          {manager.name}
                          {" - "}
                          {manager.phone}

                        </option>

                      )
                    )}

                  </ManagerSelect>


                  <ManagerButton
                    onClick={() =>
                      handleAssignManager(
                        lorry.id
                      )
                    }
                    disabled={loading}
                  >
                    Assign Manager
                  </ManagerButton>


                  {lorry.lorry_manager_id && (

                    <RemoveManagerButton
                      onClick={() =>
                        handleRemoveManager(
                          lorry.id
                        )
                      }
                      disabled={loading}
                    >
                      Remove Manager
                    </RemoveManagerButton>

                  )}

                </ManagerSection>


                {/* =================================================
                    DELETE
                ================================================= */}

                <DeleteButton
                  onClick={(e) => {

                    e.stopPropagation();

                    handleDeleteLorry(
                      lorry.id,
                      lorry.registration_number
                    );

                  }}
                >
                  Delete Lorry
                </DeleteButton>

              </LorryCard>

            )
          )

        )}

      </LorryList>

    </Container>
  );
};


export default OwnerPage;


// =====================================================
// STYLES
// =====================================================

const Container = styled.div`
  min-height: 100vh;
  padding: 30px;
  background-color: #f9f9f9;
`;


const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  width: 100%;

  border-bottom: 1px solid #ddd;

  padding-bottom: 20px;
`;


const CompanyName = styled.h1`
  margin: 0;

  font-size: 3rem;

  color: #333;

  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;


const UserSection = styled.div`
  position: absolute;

  right: 0;

  top: 0;

  text-align: right;
`;


const UserName = styled.div`
  font-size: 1.4rem;

  font-weight: bold;

  color: #333;
`;


const UserRole = styled.div`
  font-size: 0.9rem;

  color: #666;

  margin-top: 5px;
`;


const LogoutButton = styled.button`
  margin-top: 10px;

  padding: 10px 20px;

  background-color: #f44336;

  color: white;

  border: none;

  border-radius: 5px;

  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;


const AddLorryButton = styled.button`
  display: block;

  margin: 30px auto 0;

  padding: 12px 25px;

  background-color: #4caf50;

  color: white;

  border: none;

  border-radius: 5px;

  cursor: pointer;

  font-size: 16px;

  &:hover {
    background-color: #43a047;
  }
`;


const AddLorryForm = styled.form`
  display: flex;

  flex-direction: column;

  gap: 12px;

  margin: 30px auto;

  width: 100%;

  max-width: 400px;
`;


const Input = styled.input`
  padding: 12px;

  font-size: 16px;

  border-radius: 5px;

  border: 1px solid #ddd;

  width: 100%;

  box-sizing: border-box;
`;


const SubmitButton = styled.button`
  padding: 12px;

  background-color: #4caf50;

  color: white;

  border: none;

  border-radius: 5px;

  cursor: pointer;

  font-size: 16px;
`;


const LorryList = styled.div`
  display: flex;

  flex-wrap: wrap;

  justify-content: center;

  gap: 30px;

  margin-top: 40px;
`;


const LorryCard = styled.div`
  width: 320px;

  padding: 20px;

  border: 1px solid #ddd;

  border-radius: 12px;

  background-color: white;

  box-shadow:
    0 4px 12px
    rgba(0, 0, 0, 0.1);
`;


const CardContent = styled.div`
  text-align: center;

  cursor: pointer;

  &:hover {
    transform: scale(1.01);
  }
`;


const OwnerPhone = styled.div`
  font-size: 16px;

  font-weight: bold;

  color: #4caf50;

  margin-bottom: 10px;
`;


const ImageContainer = styled.div`
  width: 100%;

  height: 220px;

  overflow: hidden;

  border-radius: 10px;

  margin-bottom: 15px;

  img {
    width: 100%;

    height: 100%;

    object-fit: cover;
  }
`;


const Details = styled.div`
  font-size: 14px;

  color: #333;

  div {
    margin: 8px 0;
  }
`;


const ManagerInfo = styled.div`
  padding-top: 8px;

  border-top: 1px solid #eee;
`;


const ManagerSection = styled.div`
  margin-top: 15px;

  padding-top: 15px;

  border-top: 1px solid #ddd;
`;


const ManagerSelect = styled.select`
  width: 100%;

  padding: 10px;

  border-radius: 5px;

  border: 1px solid #ccc;

  font-size: 14px;

  margin-bottom: 10px;
`;


const ManagerButton = styled.button`
  width: 100%;

  padding: 10px;

  background-color: #007bff;

  color: white;

  border: none;

  border-radius: 5px;

  cursor: pointer;

  margin-bottom: 8px;

  &:disabled {
    opacity: 0.6;

    cursor: not-allowed;
  }
`;


const RemoveManagerButton = styled.button`
  width: 100%;

  padding: 10px;

  background-color: #ff9800;

  color: white;

  border: none;

  border-radius: 5px;

  cursor: pointer;

  &:disabled {
    opacity: 0.6;

    cursor: not-allowed;
  }
`;


const DeleteButton = styled.button`
  display: block;

  margin: 15px auto 0;

  padding: 8px 15px;

  background-color: #f44336;

  color: white;

  border: none;

  border-radius: 5px;

  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;


const LoadingText = styled.div`
  font-size: 20px;

  color: #555;

  margin-top: 50px;
`;


const NoLorries = styled.div`
  font-size: 20px;

  color: #555;

  margin-top: 50px;
`;