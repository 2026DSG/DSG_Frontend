import styled from "@emotion/styled";
import Header from "../../components/Header";
import ArrowLeft from "../../assets/arrowLeft.svg";
import ArrowRight from "../../assets/arrowRight.svg";
import Calender from "../../assets/calender.svg";
import Close from "../../assets/CloseButton.svg";
import Footer from "../../components/Footer";
import { useState } from "react";

const ApplicationListPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Body>
      <TotalContainer>
        <Header title="신청자리스트" showBack />
        <UpsideBox>
          <YearNavigator>
            <img src={ArrowLeft} alt="이전 날짜" />
            <Years>2025 / 12 / 19</Years>
            <img src={ArrowRight} alt="이후 날짜" />
          </YearNavigator>

          <CalenderButton onClick={() => setIsOpen(true)}>
            <img src={Calender} alt="이동" />
            <CalenderText>달력 보기</CalenderText>
          </CalenderButton>
        </UpsideBox>
        <TableWrapper>
          <Table>
            <Thead>
              <Tr>
                <Th>급식 종류</Th>
                <Th>이름</Th>
                <Th>부서</Th>
                <Th>직위</Th>
                <Th>사유</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td>석식</Td>
                <Td>권수현</Td>
                <Td>SW교육부</Td>
                <Td>교사</Td>
                <Td>개인부담</Td>
              </Tr>
              <Tr>
                <Td>석식</Td>
                <Td>권수현</Td>
                <Td>SW교육부</Td>
                <Td>교사</Td>
                <Td>개인부담</Td>
              </Tr>
              <Tr>
                <Td>석식</Td>
                <Td>권수현</Td>
                <Td>SW교육부</Td>
                <Td>교사</Td>
                <Td>개인부담</Td>
              </Tr>
              <Tr>
                <Td>석식</Td>
                <Td>권수현</Td>
                <Td>SW교육부</Td>
                <Td>교사</Td>
                <Td>개인부담</Td>
              </Tr>
              <Tr>
                <Td>석식</Td>
                <Td>권수현</Td>
                <Td>SW교육부</Td>
                <Td>교사</Td>
                <Td>개인부담</Td>
              </Tr>
              <Tr>
                <Td>석식</Td>
                <Td>권수현</Td>
                <Td>SW교육부</Td>
                <Td>교사</Td>
                <Td>개인부담</Td>
              </Tr>
              <Tr>
                <Td>석식</Td>
                <Td>권수현</Td>
                <Td>SW교육부</Td>
                <Td>교사</Td>
                <Td>개인부담</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableWrapper>

        <ButtonBox>
          <OutputButton>신청자 월별 액셀 출력</OutputButton>
        </ButtonBox>
      </TotalContainer>
      {isOpen && (
        <ModalOverlay onClick={() => setIsOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ArrowButton>
                <img src={ArrowLeft} alt="" />
              </ArrowButton>
              <MonthText>2025년 12월</MonthText>
              <ArrowButton>
                <img src={ArrowRight} alt="" />
              </ArrowButton>
              <CloseButton onClick={() => setIsOpen(false)}>
                <img src={Close} alt="" />
              </CloseButton>
            </ModalHeader>

            <Divider />

            <CalendarBody>
              
            </CalendarBody>
          </ModalContainer>
        </ModalOverlay>
      )}
      <Footer />
    </Body>
  );
};

const Body = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 120px;
  zoom: 0.8;
  flex: 1;
`;

const UpsideBox = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 34px;
`;

const YearNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;

  img {
    width: 13px;
  }
`;

const Years = styled.span`
  font-size: 24px;
  padding-bottom: 6px;
`;

const CalenderButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background-color: #c1c6d1;

  img {
    margin-right: 14px;
  }
`;

const CalenderText = styled.span`
  margin-right: 10px;
  font-size: 24px;
`;

const TableWrapper = styled.div`
  margin-top: 21px;
  max-height: 400px;
  overflow-y: auto;
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

  /* 왼쪽 위 모서리 */
  &:first-of-type {
    border-top-left-radius: 6px;
  }
  /* 오른쪽 위 모서리 */
  &:last-of-type {
    border-top-right-radius: 6px;
  }

  position: sticky; // 스크롤 시 고정
  top: 0; // 최상단 고정
  z-index: 10;
`;

const Td = styled.td`
  border-right: 1px solid #e0e0e0;
  padding: 12px;
  font-size: 24px;
  text-align: center;

  button {
    font-size: 24px;
    padding: 5px 29px;
    border: none;
    border-radius: 6px;
    color: white;
    background-color: #444f61;
  }
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 66px;
`;

const OutputButton = styled.button`
  padding: 20px 24px;
  font-size: 32px;
  color: white;
  border: none;
  border-radius: 12px;
  background-color: #444f61;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  padding: 130px 0 0 440px;
  z-index: 999;
`;

const ModalContainer = styled.div`
  width: 320px;
  height: 320px;
  background: white;
  border-radius: 12px;
  padding: 24px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 20px;
  font-weight: 600;
`;

const MonthText = styled.span`
  margin: 0 16px;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  margin-top: 6px;
  cursor: pointer;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;

  img {
    width: 14px;
    height: 14px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #e0e0e0;
  margin: 16px 0 10px 0;
`;

const CalendarBody = styled.div`
  min-height: 210px;
`;

export default ApplicationListPage;
