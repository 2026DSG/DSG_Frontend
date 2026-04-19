import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import type { MealType } from "../../services/mealService";

type BaseMealType = "LUNCH" | "DINNER";

const ApplicationReasonPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const dateParam = searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const initialMeal = (searchParams.get("meal") as BaseMealType) || "LUNCH";

  const [mealType, setMealType] = useState<BaseMealType>(initialMeal);
  const [isSelfPay, setIsSelfPay] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("ko-KR", { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    if (!reason.trim()) {
      alert("신청 사유를 입력하거나 선택해주세요.");
      return;
    }
    
    // 최종 MealType 결정
    let finalType: MealType = mealType;
    if (mealType === "LUNCH") finalType = isSelfPay ? "LUNCH_SELF" : "LUNCH";
    else finalType = isSelfPay ? "DINNER_SELF" : "DINNER";

    navigate(`/apply/teacher?meal=${finalType}&date=${dateParam}&reason=${encodeURIComponent(reason)}`);
  };

  const reasons = ["단순 업무", "회의", "학생 상담", "기타 활동"];

  return (
    <Body>
      <TotalContainer>
        <Header title="급식 신청" />
        <ContentWrapper>
          <TopRow>
            <TimeDisplay>{currentTime}</TimeDisplay>
            <MealTypeText>{mealType === "LUNCH" ? "중식" : "석식"} 신청</MealTypeText>
            <MealToggleGroup>
              <MealToggleButton active={mealType === "LUNCH"} onClick={() => setMealType("LUNCH")}>중식</MealToggleButton>
              <MealToggleButton active={mealType === "DINNER"} onClick={() => setMealType("DINNER")}>석식</MealToggleButton>
            </MealToggleGroup>
          </TopRow>

          <InputSection>
            <Label>결제 방식</Label>
            <SelectGroup>
              <SelectButton active={!isSelfPay} onClick={() => setIsSelfPay(false)}>초과근무</SelectButton>
              <SelectButton active={isSelfPay} onClick={() => setIsSelfPay(true)}>개인부담</SelectButton>
            </SelectGroup>

            <Label style={{ marginTop: '40px' }}>신청 사유</Label>
            <ReasonGrid>
              {reasons.map(r => (
                <ReasonChip key={r} selected={reason === r} onClick={() => setReason(r)}>{r}</ReasonChip>
              ))}
            </ReasonGrid>
            <CustomInput 
              placeholder="직접 입력..." 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
            />
          </InputSection>

          <NextButton onClick={handleNext}>다음으로</NextButton>
        </ContentWrapper>
      </TotalContainer>
      <Footer />
    </Body>
  );
};

const Body = styled.div` width: 100vw; height: 100vh; background-color: #fff; `;
const TotalContainer = styled.div` display: flex; flex-direction: column; margin: 0 120px; `;
const ContentWrapper = styled.div` display: flex; flex-direction: column; align-items: center; margin-top: 40px; `;
const TopRow = styled.div` display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 60px; `;
const TimeDisplay = styled.div` font-size: 24px; font-weight: bold; `;
const MealTypeText = styled.h1` font-size: 48px; margin: 0; `;
const MealToggleGroup = styled.div` display: flex; border: 1px solid #ccc; border-radius: 6px; overflow: hidden; `;
const MealToggleButton = styled.button<{ active: boolean }>` padding: 10px 20px; border: none; cursor: pointer; background: ${props => props.active ? "#444f61" : "#fff"}; color: ${props => props.active ? "#fff" : "#444f61"}; `;
const InputSection = styled.div` width: 100%; max-width: 600px; `;
const Label = styled.div` font-size: 24px; font-weight: bold; margin-bottom: 16px; `;
const SelectGroup = styled.div` display: flex; gap: 12px; `;
const SelectButton = styled.button<{ active: boolean }>` flex: 1; padding: 15px; border: 1px solid #ccc; border-radius: 8px; cursor: pointer; background: ${props => props.active ? "#444f61" : "#fff"}; color: ${props => props.active ? "#fff" : "#444f61"}; font-size: 18px; `;
const ReasonGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; `;
const ReasonChip = styled.div<{ selected: boolean }>` padding: 15px; text-align: center; border: 1px solid #ccc; border-radius: 8px; cursor: pointer; background: ${props => props.selected ? "#eef0f4" : "#fff"}; font-size: 18px; `;
const CustomInput = styled.input` width: 100%; padding: 15px; border: 1px solid #ccc; border-radius: 8px; font-size: 18px; box-sizing: border-box; `;
const NextButton = styled.button` margin-top: 60px; padding: 20px 100px; font-size: 28px; background: #444f61; color: white; border: none; border-radius: 12px; cursor: pointer; `;

export default ApplicationReasonPage;