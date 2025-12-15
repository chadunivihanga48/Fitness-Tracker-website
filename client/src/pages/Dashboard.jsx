import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { counts } from "../utils/data";
import CountsCard from "../components/cards/CountsCard";
import WeeklyStatCard from "../components/cards/WeeklyStatCard";
import CategoryChart from "../components/cards/CategoryChart";
import AddWorkout from "../components/AddWorkout";
import WorkoutCard from "../components/cards/WorkoutCard";
import { addWorkout, getDashboardDetails, getWorkouts } from "../api";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  padding: 0px 16px;
 
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 0px 16px;
  @media (max-widh: 600px){
  gap: 12px;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 100px;
  justify-content: center;
  @media (max-width: 600px){
  gap: 12px;
   }
`;

const mockData = {
  totalCaloriesBurnt: 13500,
  totalWorkouts: 6,
  avgCaloriesBurnPerWorkout: 2250,
  totalWeeksCaloriesBurnt: {
    weeks: ["17th", "18th", "19th", "20th", "21st", "22nd", "23rd"],
    caloriesBurned: [10500, 0, 0, 0, 0, 0, 13500],
  },
  pieChartData: [
    { id: 0, value: 6000, label: "Legs" },
    { id: 1, value: 4100, label: "Chest" },
    { id: 2, value: 3800, label: "Back" },
    { id: 3, value: 2600, label: "Arms" },
    { id: 4, value: 1800, label: "Shoulders" },
    { id: 5, value: 1200, label: "Core" },
  ],
};

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [workout, setWorkout] = useState(`#Legs
    -Back Squat
    -5 setsX15 reps
    -30 kg
    -10 min`);

    const dashboardData = async () => {
      setLoading(true);
      const token = localStorage.getItem("fittrack app token");
      await getDashboardDetails(token).then((res) => {
        setData(res.data);
        console.log(res.data);
        setLoading(false);
      });
    };

    const addNewWorkout = async () => {
      setButtonLoading(true);
      const token = localStorage.getItem("fittrack app token");
      await addWorkout(token, {workoutString: workout }).then((res) => {
          dashboardData();
          getTodayWorkout();
          setButtonLoading(false);
      })
      .catch((err) => {
        alert(err);
      });
    };
  const displayData = data || mockData;

  useEffect(() => {
    dashboardData();
    getTodayWorkout();
    
  }, []);

  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>

        <FlexWrap>
          {counts.map((item, i) => (
            <CountsCard key={i} item={item} data={displayData} />
          ))}
        </FlexWrap>

        <FlexWrap>
          <WeeklyStatCard data={displayData} />
          <CategoryChart data={displayData} />
          <AddWorkout
            workout={workout}
            setWorkout={setWorkout} 
            addNewWorkout={addNewWorkout}
            buttonLoading={buttonLoading}
          />
        </FlexWrap>

        <Section>
          <Title>Todays Workouts</Title>
          <CardWrapper>
            {todaysWorkouts.map((workout) => (
              <WorkoutCard workout={workout} />
            ))}
          </CardWrapper>
        </Section>
      </Wrapper>
    </Container>
  );
};

export default Dashboard;
