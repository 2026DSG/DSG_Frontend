import styled from "@emotion/styled";
import ArrowLeft from "../../assets/arrowLeft.svg";
import ArrowRight from "../../assets/arrowRight.svg";
import Header from "../../components/Header";

const TeacherListPage = () => {
  return (
    <Body>
      <TotalContainer>
        <Header />
        <UpsideBox>
          <YearNavigator>
            <img src={ArrowLeft} alt="이전 연도" />
            <Years>2025</Years>
            <img src={ArrowRight} alt="이후 연도" />
          </YearNavigator>

          <ApplicantListButton>
            <ApplicantListText>신청자 리스트</ApplicantListText>
            <img src={ArrowRight} alt="이동" />
          </ApplicantListButton>
        </UpsideBox>
        <TableWrapper>
          <Table>
            <Thead>
              <Tr>
                <Th>이름</Th>
                <Th>부서</Th>
                <Th>직위</Th>
                <Th></Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td>이동욱</Td>
                <Td>SW교육부</Td>
                <Td>교사</Td>
                <Td>
                  <button>삭제</button>
                </Td>
              </Tr>

              <Tr>
                <Td>이동욱</Td>
                <Td>SW교육부</Td>
                <Td>교사</Td>
                <Td>
                  <button>삭제</button>
                </Td>
              </Tr>

              <Tr>
                <Td>이동욱</Td>
                <Td>SW교육부</Td>
                <Td>교사</Td>
                <Td>
                  <button>삭제</button>
                </Td>
              </Tr>

              <Tr>
                <Td>이동욱</Td>
                <Td>SW교육부</Td>
                <Td>교사</Td>
                <Td>
                  <button>삭제</button>
                </Td>
              </Tr>

              <Tr>
                <Td>이동욱</Td>
                <Td>SW교육부</Td>
                <Td>교사</Td>
                <Td>
                  <button>삭제</button>
                </Td>
              </Tr>

              <Tr>
                <Td>이동욱</Td>
                <Td>SW교육부</Td>
                <Td>교사</Td>
                <Td>
                  <button>삭제</button>
                </Td>
              </Tr>

              <Tr>
                <Td>이동욱</Td>
                <Td>SW교육부</Td>
                <Td>교사</Td>
                <Td>
                  <button>삭제</button>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableWrapper>
        <ButtonBox>
          <TeacherButton>교직원 등록</TeacherButton>
          <TeacherButton>교직원 다운로드</TeacherButton>
          <TeacherButton>파일 업로드</TeacherButton>
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
  justify-content: space-between;
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

const ApplicantListButton = styled.button`
  padding: 9px 18px;
  border: none;
  border-radius: 6px;
  background-color: #c1c6d1;
`;

const ApplicantListText = styled.span`
  margin-right: 10px;
  font-size: 20px;
`;

const TableWrapper = styled.div`
  margin-top: 21px;
  max-height: 400px;
  overflow-y: auto;
`;


const Table = styled.table`
  width: 100%;
  //border-collapse: collapse;
  border-collapse: separate;
  border-spacing: 0;
  //border-radius: 6px;
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

const TeacherButton = styled.button`
  padding: 15px 50px;
  font-size: 32px;
  color: white;
  border: none;
  border-radius: 12px;
  background-color: #444f61;
`;


export default TeacherListPage;
