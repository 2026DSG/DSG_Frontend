import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import ArrowLeft from "../../assets/arrowLeft.svg";
import ArrowRight from "../../assets/arrowRight.svg";
import user from "../../assets/user.svg";

import { getMealList, deleteMealById } from "../../services/mealService";
import type { MealType, MealItem } from "../../services/mealService";

type BaseMealType = "LUNCH" | "DINNER";

type ToastType = "success" | "error";
interface Toast {
  text: string;
  type: ToastType;
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year} / ${month} /  ${day}`;
};

const toDateParam = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}    ${hours}:${minutes}`;
};

const getDefaultMealType = (): BaseMealType => {
  const now = new Date();
  const totalMinute = now.getHours() * 60 + now.getMinutes();
  if (totalMinute >= 13 * 60 + 30) return "DINNER";
  return "LUNCH";
};

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const dateQuery = searchParams.get("date");
  const mealQuery = searchParams.get("meal") as BaseMealType | null;

  const currentDate = dateQuery ? new Date(dateQuery) : new Date();
  const mealType = mealQuery || getDefaultMealType();
  const currentDateString = toDateParam(currentDate);

  const [mealList, setMealList] = useState<MealItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("accessToken"));

    const loadData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const types: MealType[] = mealType === "LUNCH" ? ["LUNCH", "LUNCH_SELF"] : ["DINNER", "DINNER_SELF"];
        
        // 두 가지 유형(초과/개인)을 병렬로 조회
        const [res1, res2] = await Promise.all([
          getMealList(currentDateString, types[0]),
          getMealList(currentDateString, types[1]),
        ]);

        // 최신 신청 순(createdAt 내림차순)으로 정렬
        const combined = [...res1, ...res2].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setMealList(combined);
      } catch {
        showToast("데이터를 불러오는데 실패했습니다.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentDateString, mealType]);

  const showToast = (text: string, type: ToastType) => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDateChange = (step: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + step);
    setSearchParams({ date: toDateParam(newDate), meal: mealType });
  };

  const handleMealTypeChange = (newMeal: BaseMealType) => {
    setSearchParams({ date: currentDateString, meal: newMeal });
  };

  const handleDeleteConfirm = async () => {
    if (deletingId === null) return;
    try {
      await deleteMealById(deletingId);
      setMealList(prev => prev.filter(item => item.applyId !== deletingId));
      showToast("삭제되었습니다.", "success");
    } catch {
      showToast("삭제 실패했습니다.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Body>
      {toast && <ToastMessage type={toast.type}>{toast.text}</ToastMessage>}
      {deletingId !== null && (
        <ModalOverlay>
          <ModalBox>
            <ModalMessage>정말 삭제하시겠습니까?</ModalMessage>
            <ModalButtons>
              <CancelButton onClick={() => setDeletingId(null)}>취소</CancelButton>
              <ConfirmDeleteButton onClick={handleDeleteConfirm}>삭제</ConfirmDeleteButton>
            </ModalButtons>
          </ModalBox>
        </ModalOverlay>
      )}

      <TotalContainer>
        <Header title="메인페이지" />
        <ControlRow>
          <YearNavigator>
            <img src={ArrowLeft} alt="prev" onClick={() => handleDateChange(-1)} />
            <Years>{formatDate(currentDate)}</Years>
            <img src={ArrowRight} alt="next" onClick={() => handleDateChange(1)} />
          </YearNavigator>
          <MealToggleGroup>
            <MealToggleButton active={mealType === "LUNCH"} onClick={() => handleMealTypeChange("LUNCH")}>중식</MealToggleButton>
            <MealToggleButton active={mealType === "DINNER"} onClick={() => handleMealTypeChange("DINNER")}>석식</MealToggleButton>
          </MealToggleGroup>
          {!isLoggedIn && (
            <LoginButton onClick={() => navigate("/login")}>
              <img src={user} alt="user" /> Login
            </LoginButton>
          )}
        </ControlRow>

        <TableWrapper>
          <Table>
            <Thead>
              <Tr>
                <Th>이름</Th>
                <Th>사유</Th>
                <Th>부서</Th>
                <Th>직위</Th>
                <Th>신청일시</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr><EmptyTd colSpan={6}>로딩 중...</EmptyTd></Tr>
              ) : mealList.length === 0 ? (
                <Tr><EmptyTd colSpan={6}>신청 내역이 없습니다.</EmptyTd></Tr>
              ) : (
                mealList.map((item) => (
                  <Tr key={item.applyId}>
                    <Td>{item.teacherName}</Td>
                    <Td>{item.reason}</Td>
                    <Td>{item.department}</Td>
                    <Td>{item.position}</Td>
                    <Td>{formatDateTime(item.createdAt)}</Td>
                    <Td>
                      <DeleteButton onClick={() => setDeletingId(item.applyId)}>삭제</DeleteButton>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableWrapper>

        <ButtonBox>
          <ApplyButton onClick={() => navigate(`/apply/reason?meal=${mealType}&date=${currentDateString}`)}>신청하기</ApplyButton>
        </ButtonBox>
      </TotalContainer>
      <Footer />
    </Body>
  );
};

// 스타일 컴포넌트
const Body = styled.div`
  width: 100vw;
  height: 100vh;
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 120px;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 34px;
`;

const YearNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
  
  img {
    width: 8px;
    cursor: pointer;
  }
`;

const Years = styled.span`
  font-size: 20px;
  padding-bottom: 6px;
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

const LoginButton = styled.button`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  font-size: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
`;

const TableWrapper = styled.div`
  margin-top: 21px;
  height: 370px;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Thead = styled.thead`
  background-color: #444f61;
  color: white;
`;

const Tbody = styled.tbody`
  tr:nth-of-type(odd) {
    background-color: white;
  }
  tr:nth-of-type(even) {
    background-color: #eef0f4;
  }
`;

const Tr = styled.tr``;

const Th = styled.th`
  padding: 12px;
  font-size: 24px;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #444f61;
`;

const Td = styled.td`
  padding: 12px;
  font-size: 24px;
  text-align: center;
  border-right: 1px solid #e0e0e0;
`;

const EmptyTd = styled.td`
  padding: 40px;
  text-align: center;
  color: #888;
  font-size: 20px;
`;

const DeleteButton = styled.button`
  font-size: 20px;
  padding: 5px 29px;
  border: none;
  border-radius: 6px;
  color: white;
  background-color: #444f61;
  cursor: pointer;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

const ApplyButton = styled.button`
  padding: 20px 120px;
  font-size: 32px;
  color: white;
  border: none;
  border-radius: 12px;
  background-color: #444f61;
  cursor: pointer;
`;

const ToastMessage = styled.div<{ type: string }>`
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 16px 28px;
  border-radius: 12px;
  color: white;
  background-color: ${({ type }) => (type === "success" ? "#27ae60" : "#e74c3c")};
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 36px 48px;
  text-align: center;
`;

const ModalMessage = styled.p`
  font-size: 22px;
  margin-bottom: 28px;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const CancelButton = styled.button`
  padding: 10px 30px;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
`;

const ConfirmDeleteButton = styled.button`
  padding: 10px 30px;
  background: #444f61;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

export default HomePage;