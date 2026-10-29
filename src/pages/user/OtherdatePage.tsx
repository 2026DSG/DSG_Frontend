import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ArrowLeft from "../../assets/arrowLeft.svg";
import ArrowRight from "../../assets/arrowRight.svg";

import {
  getKstToday,
  shiftDate,
  getWeekday,
  isAllowedOtherDate,
} from "../../utils/kst";

const toLocalDate = (s: string): Date => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const OtherDatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const meal = searchParams.get("meal");

  const [today, setToday] = useState<string>(getKstToday());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setToday(getKstToday());
    const id = setInterval(update, 30_000);
    window.addEventListener("pointerdown", update, true);
    return () => {
      clearInterval(id);
      window.removeEventListener("pointerdown", update, true);
    };
  }, []);

  const minDate = shiftDate(today, 1);

  const validSelectedDate =
    selectedDate !== null && selectedDate >= minDate ? selectedDate : null;

  const handleNext = () => {
    if (validSelectedDate === null) return;
    if (!isAllowedOtherDate(validSelectedDate)) {
      alert("선택할 수 없는 날짜입니다. 다시 선택해주세요.");
      setSelectedDate(null);
      return;
    }
    const query = meal ? `?meal=${meal}` : "";
    navigate(`/apply/reason${query}`, { state: { date: validSelectedDate } });
  };

  return (
    <Body>
      <ContentWrapper>
        <TotalContainer>
          <Header title="다른 날짜로 신청" showBack />

          <MainContent>
            <CalendarBox>
              <StyledCalendar
                value={
                  validSelectedDate ? toLocalDate(validSelectedDate) : null
                }
                onChange={(value) =>
                  setSelectedDate((value as Date).toLocaleDateString("sv-SE"))
                }
                minDate={toLocalDate(minDate)}
                defaultActiveStartDate={toLocalDate(minDate)}
                calendarType="gregory"
                view="month"
                prev2Label={null}
                next2Label={null}
                prevLabel={<img src={ArrowLeft} alt="이전" />}
                nextLabel={<img src={ArrowRight} alt="다음" />}
                formatDay={(_, date) => String(date.getDate())}
              />
            </CalendarBox>

            <SummaryBox>
              <SummaryLabel>선택한 날짜</SummaryLabel>
              <SummaryDate>
                {validSelectedDate
                  ? `${validSelectedDate.replaceAll("-", " / ")} (${getWeekday(validSelectedDate)})`
                  : "날짜를 선택해주세요"}
              </SummaryDate>

              <NextButton
                active={validSelectedDate !== null}
                disabled={validSelectedDate === null}
                onClick={handleNext}
              >
                다음
              </NextButton>
            </SummaryBox>
          </MainContent>
        </TotalContainer>
      </ContentWrapper>
      <Footer />
    </Body>
  );
};

const Body = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 120px;
`;

const MainContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 60px;
  margin-top: 24px;
`;

const CalendarBox = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SummaryBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 340px;
  padding-top: 40px;
`;

const SummaryLabel = styled.span`
  font-size: 20px;
  color: #888;
`;

const SummaryDate = styled.span`
  min-height: 40px;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
`;

const NextButton = styled.button<{ active: boolean }>`
  width: 100%;
  height: 65px;
  margin-top: 24px;
  font-size: 24px;
  font-weight: 500;
  color: white;
  background-color: ${({ active }) => (active ? "#444f61" : "#bec3cc")};
  border: none;
  border-radius: 10px;
  cursor: ${({ active }) => (active ? "pointer" : "not-allowed")};
`;

const StyledCalendar = styled(Calendar)`
  width: 560px;
  border: none;
  border-radius: 12px;
  padding: 20px 30px;

  .react-calendar__navigation {
    border-bottom: 3px solid #e8e8e8;
  }

  .react-calendar__navigation button {
    min-width: 60px;
  }

  .react-calendar__navigation button:hover,
  .react-calendar__navigation button:focus {
    background-color: transparent;
  }

  .react-calendar__navigation__label {
    font-size: 22px;
    font-weight: 500;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .react-calendar__navigation img {
    width: 13px;
  }

  .react-calendar__month-view__weekdays__weekday--weekend abbr[title="일요일"] {
    color: #ff0000;
  }

  .react-calendar__month-view__weekdays__weekday--weekend abbr[title="토요일"] {
    color: #2e7af2;
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none;
    font-size: 18px;
  }

  .react-calendar__month-view__days__day--weekend:nth-of-type(7n) abbr {
    color: #2e7af2;
  }

  .react-calendar__month-view__days__day--neighboringMonth abbr {
    color: #dcdcdc !important;
  }

  .react-calendar__tile {
    height: 64px;
    font-size: 22px;
  }
  .react-calendar__tile--now {
    background: #fff;
    font-weight: bold;
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background: transparent;
  }
  .react-calendar__tile:disabled {
    background: none;
  }

  .react-calendar__tile:disabled abbr {
    color: #dcdcdc !important;
  }
  .react-calendar__tile--active {
    background: #444f61 !important;
    color: white !important;
    border-radius: 50%;
  }
  .react-calendar__tile--active abbr {
    color: white !important;
  }
`;

export default OtherDatePage;
