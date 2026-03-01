'use client';

import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";


type MealType = '중식' | '석식';
type ReasonType = '초과근무' | '개인부담';

const getDefaultMealType = (): MealType => {
  const now = new Date();
  const totalMinute = now.getHours() * 60 + now.getMinutes();
  if (totalMinute >= 13 * 60 + 30) return '석식';
  return '중식';
};


const ApplicationReasonPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const dateParam =
    searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  const [currentTime, setCurrentTime] = useState<string>('');
  const [mealType, setMealType] = useState<MealType>(
    (searchParams.get("meal") as MealType) ?? getDefaultMealType()
  );

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleReasonSelect = (reason: ReasonType) => {
    navigate(
      `/apply/teacher?meal=${encodeURIComponent(mealType)}&reason=${encodeURIComponent(reason)}&date=${dateParam}`
    );
  };




  return (
    <Body>
      <TotalContainer>
        <Header title="유형 선택" showBack />

        <ContentWrapper>
          <TopRow>
            <TimeDisplay>{currentTime}</TimeDisplay>
            <MealTypeText>{mealType}</MealTypeText>
            <MealToggleGroup>
              {(['중식', '석식'] as MealType[]).map((meal) => (
                <MealToggleButton
                  key={meal}
                  active={mealType === meal}
                  onClick={() => setMealType(meal)}
                >
                  {meal}
                </MealToggleButton>
              ))}
            </MealToggleGroup>
          </TopRow>

          <ButtonContainer>
            <ReasonButton onClick={() => handleReasonSelect('초과근무')}>
              초과근무
            </ReasonButton>
            <ReasonButton onClick={() => handleReasonSelect('개인부담')}>
              개인부담
            </ReasonButton>
          </ButtonContainer>
        </ContentWrapper>
      </TotalContainer>

      <Footer />
    </Body>
  );
};

const Body = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 120px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 80px;
`;

const TimeDisplay = styled.div`
  font-size: 24px;
  color: #333;
`;

const MealTypeText = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const MealToggleGroup = styled.div`
  display: flex;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
`;

const MealToggleButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  font-size: 20px;
  border: none;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "#444f61" : "white")};
  color: ${({ active }) => (active ? "white" : "#444f61")};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 100px;
  margin-bottom: 100px;
`;

const ReasonButton = styled.button`
  width: 400px;
  height: 270px;
  font-size: 48px;
  font-weight: bold;
  color: #ffffff;
  background-color: #444f61;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  `;

export default ApplicationReasonPage;