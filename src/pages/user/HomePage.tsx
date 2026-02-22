'use client';

import styled from "@emotion/styled";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import ArrowLeft from "../../../src/assets/arrowLeft.svg";
import ArrowRight from "../../../src/assets/arrowRight.svg";
import user from "../../assets/user.svg";


const initialData = [
  { id: 1, name: "권수현", reason: "개인부담", department: "부서", position: "교직원" },
  { id: 2, name: "강세아", reason: "초과근무", department: "부서", position: "교직원" },
  { id: 3, name: "권수현", reason: "개인부담", department: "부서", position: "교직원" },
  { id: 4, name: "강세아", reason: "초과근무", department: "부서", position: "교직원" },
  { id: 5, name: "권수현", reason: "개인부담", department: "부서", position: "교직원" },
  { id: 6, name: "강세아", reason: "초과근무", department: "부서", position: "교직원" },
  { id: 7, name: "권수현", reason: "개인부담", department: "부서", position: "교직원" },
];


const HomePage = () => {
  return (
    <Body>
      <TotalContainer>
        <Header title="메인페이지" />

        <ControlRow>
          <YearNavigator>
            <img src={ArrowLeft || "/placeholder.svg"} alt="이전 날짜" />
            <Years>2025 / 12 / 19</Years>
            <img src={ArrowRight || "/placeholder.svg"} alt="이후 날짜" />
          </YearNavigator>

          <MealSelect defaultValue="석식">
            <option value="석식">석식</option>
            <option value="중식">중식</option>
            <option value="조식">조식</option>
          </MealSelect>

          <LoginButton>
            <img src={user} alt="이전 날짜" />
            Login
          </LoginButton>
        </ControlRow>

        <TableWrapper>
          <Table>
            <Thead>
              <Tr>
                <Th>이름</Th>
                <Th>사유</Th>
                <Th>부서</Th>
                <Th>직위</Th>
                <Th></Th>
              </Tr>
            </Thead>

            <Tbody>
              {initialData.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.name}</Td>
                  <Td>{item.reason}</Td>
                  <Td>{item.department}</Td>
                  <Td>{item.position}</Td>
                  <Td>
                    <DeleteButton>삭제</DeleteButton>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>

        <ButtonBox>
          <ApplyButton>신청하기</ApplyButton>
        </ButtonBox>
      </TotalContainer>
      

      <Footer />
    </Body>
  );
};

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

const MealSelect = styled.select`
  padding: 8px 16px;
  padding-right: 50px; /* 화살표가 들어갈 공간 확보 */
  font-size: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  
  background-position: calc(100% - 16px) center; 
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
  max-height: 370px;
  height: auto;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  background-color: #444f61;
  border-bottom: 2px solid #ccc;
  padding: 12px;
  font-size: 24px;

  &:first-of-type {
    border-top-left-radius: 6px;
  }
  &:last-of-type {
    border-top-right-radius: 6px;
  }

  position: sticky;
  top: 0;
  z-index: 10;
`;

const Td = styled.td`
  border-right: 1px solid #e0e0e0;
  padding: 12px;
  font-size: 24px;
  text-align: center;

  &:last-of-type {
    border-right: none;
  }
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

export default HomePage;