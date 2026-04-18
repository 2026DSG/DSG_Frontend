import styled from "@emotion/styled";
import Header from "../../components/Header";
import ArrowLeft from "../../assets/arrowLeft.svg";
import ArrowRight from "../../assets/arrowRight.svg";
import CloseButton from "../../assets/CloseButton.svg";
import Calender from "../../assets/calender.svg";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  getApplyList,
  downloadMonthlyExcel,
  downloadSummaryExcel,
} from "../../services/apply";
import type { Applicant } from "../../services/apply";

const mealLabel: Record<string, string> = {
  LUNCH: "중식",
  LUNCH_SELF: "중식",
  DINNER: "석식",
  DINNER_SELF: "석식",
};

const ApplicationListPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [allApplicantList, setAllApplicantList] = useState<Applicant[]>([]);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y} / ${m} / ${d}`;
  };

  useEffect(() => {
    const date = selectedDate.toLocaleDateString("sv-SE");

    getApplyList(undefined, date)
      .then(setAllApplicantList)
      .catch(() => alert("신청자 목록 조회에 실패했습니다."));
  }, [selectedDate]);

  const applicantList = allApplicantList;

  const goToPrevDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const goToNextDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
  };

  return (
    <Body>
      <TotalContainer>
        <Header title="신청자리스트" showBack />
        <UpsideBox>
          <YearNavigator>
            <img src={ArrowLeft} onClick={goToPrevDay} alt="이전 날짜" />
            <Years>{formatDate(selectedDate)}</Years>
            <img src={ArrowRight} onClick={goToNextDay} alt="이후 날짜" />
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
              {applicantList.length === 0 ? (
                <Tr>
                  <EmptyTd colSpan={5}>신청자가 존재하지 않습니다.</EmptyTd>
                </Tr>
              ) : (
                applicantList.map((applicant) => (
                  <Tr key={applicant.applyId}>
                    <Td>{mealLabel[applicant.meal] ?? applicant.meal}</Td>
                    <Td>{applicant.teacherName}</Td>
                    <Td>{applicant.department}</Td>
                    <Td>{applicant.position}</Td>
                    <Td>{applicant.reason}</Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableWrapper>

        <ButtonBox>
          <OutputButton onClick={downloadMonthlyExcel}>
            신청자 월별 액셀 출력
          </OutputButton>
          <OutputButton onClick={downloadSummaryExcel}>
            총괄표 출력
          </OutputButton>
        </ButtonBox>
      </TotalContainer>
      {isOpen && (
        <ModalOverlay onClick={() => setIsOpen(false)}>
          <CalendarBody onClick={(e) => e.stopPropagation()}>
            <CloseIcon
              src={CloseButton}
              alt="닫기"
              onClick={() => setIsOpen(false)}
            />
            <StyledCalendar
              value={selectedDate}
              onChange={(date) => {
                setSelectedDate(date as Date);
                setIsOpen(false);
              }}
              calendarType="gregory"
              view="month"
              prev2Label={null}
              next2Label={null}
              prevLabel={<img src={ArrowLeft} />}
              nextLabel={<img src={ArrowRight} />}
              formatDay={(_, date) => String(date.getDate())}
            />
          </CalendarBody>
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
  box-shadow: 0 8px 32px rgba(0, 0, 6, 0.2);
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

const EmptyTd = styled.td`
  padding: 150px 0;
  font-size: 24px;
  text-align: center;
  color: #888;
  background-color: white;
`;

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
  width: 340px;
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

const CalendarBody = styled.div`
  height: auto;
  position: relative;
  background: white;
  border-radius: 12px;
  height: 300px;
`;

const CloseIcon = styled.img`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 20px;
  right: 10px;
  width: 30px;
  cursor: pointer;
`;

const StyledCalendar = styled(Calendar)`
  width: 400px;
  border: none;
  border-radius: 12px;
  padding: 30px 50px;

  .react-calendar__navigation__label {
    font-size: 20px;
    font-weight: 500;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .react-calendar__navigation button:hover,
  .react-calendar__navigation button:focus {
    background-color: transparent;
  }

  .react-calendar__navigation {
    border-bottom: 3px solid #e8e8e8;
  }

  .react-calendar__month-view__weekdays__weekday--weekend abbr[title="일요일"] {
    color: #ff0000;
  }

  .react-calendar__month-view__weekdays__weekday--weekend abbr[title="토요일"] {
    color: #2e7af2;
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none;
  }

  .react-calendar__month-view__days__day--weekend:nth-of-type(7n) abbr {
    color: #2e7af2;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    abbr {
      color: #dcdcdc !important;
    }
  }

  .react-calendar__tile--active {
    background: none;
    color: #424242;
  }

  .react-calendar__tile--now {
    background: #fff;
    font-weight: bold;
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background: transparent;
  }

  .react-calendar__tile--active {
    background: #444f61 !important;
    color: white !important;
    border-radius: 50%;
  }
`;

export default ApplicationListPage;
