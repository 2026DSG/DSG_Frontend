import styled from "@emotion/styled";
import Header from "../../components/Header";
import ArrowLeft from "../../assets/arrowLeft.svg";
import ArrowRight from "../../assets/arrowRight.svg";
import Calender from "../../assets/calender.svg";

const ApplicationListPage = () => {
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

          <CalenderButton>
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
    </Body>
  );
};

const Body = styled.div`
  width: 100vw;
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 120px;
  zoom: 0.8;
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

  //position: sticky;
  //top: 0;
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

export default ApplicationListPage;
