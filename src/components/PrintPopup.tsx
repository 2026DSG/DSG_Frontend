import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import type { PointerEvent, WheelEvent } from "react";
import Reset from "../assets/reset.svg";
import CloseButton from "../assets/CloseButton.svg";
import arrowTop from "../assets/arrowTop.svg";
import arrowBottom from "../assets/arrowBottom.svg";

interface PrintPopupProps {
  initialYear?: number;
  initialMonth?: number;
  yearMin?: number;
  yearMax?: number;
  onClose: () => void;
  onPrint: (year: number, month: number) => void | Promise<void>;
}

const OFFSETS = [2, 1, 0, -1, -2] as const;
const pad = (n: number) => String(n).padStart(2, "0");
const wrapMonth = (month: number) => {
  return ((((month - 1) % 12) + 12) % 12) + 1;
};

interface WheelColumnProps {
  label: "년" | "월";
  listWidth: number;
  getText: (offset: number) => string | null;
  onStep: (delta: 1 | -1) => void;
}

function WheelColumn({ label, listWidth, getText, onStep }: WheelColumnProps) {
  const startY = useRef<number | null>(null);
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    onStep(e.deltaY < 0 ? 1 : -1);
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    startY.current = e.clientY;
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startY.current === null) return;

    const dy = e.clientY - startY.current;
    startY.current = null;
    if (Math.abs(dy) > 25) {
      onStep(dy > 0 ? 1 : -1);
    }
  };

  return (
    <Column>
      <WheelArea>
        <List
          listWidth={listWidth}
          aria-label={`${label} 선택`}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          {OFFSETS.map((offset) => {
            const text = getText(offset);
            return (
              <Item
                key={offset}
                offset={offset}
                hidden={text === null}
                onClick={() => {
                  if (offset !== 0 && text !== null) {
                    onStep(offset > 0 ? 1 : -1);
                  }
                }}
              >
                {text}
              </Item>
            );
          })}
        </List>

        <Arrows>
          <ArrowButton
            type="button"
            aria-label={`${label} 증가`}
            onClick={() => onStep(1)}
          >
            <img src={arrowTop} />
          </ArrowButton>

          <ArrowButton
            type="button"
            aria-label={`${label} 감소`}
            onClick={() => onStep(-1)}
          >
            <img src={arrowBottom} />
          </ArrowButton>
        </Arrows>
      </WheelArea>
      <Unit>{label}</Unit>
    </Column>
  );
}

export default function PrintPopup({
  initialYear,
  initialMonth,
  yearMin = 1990,
  yearMax = 2100,
  onClose,
  onPrint,
}: PrintPopupProps) {
  const today = new Date();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const [year, setYear] = useState(initialYear ?? currentYear);
  const [month, setMonth] = useState(initialMonth ?? currentMonth);
  const [isPrinting, setIsPrinting] = useState(false);

  const stepYear = (delta: 1 | -1) => {
    setYear((current) => {
      const next = current + delta;

      if (next < yearMin || next > yearMax) {
        return current;
      }

      return next;
    });
  };

  const stepMonth = (delta: 1 | -1) => {
    if (delta === 1) {
      if (month === 12) {
        setMonth(1);

        setYear((current) => {
          if (current >= yearMax) {
            return current;
          }
          return current + 1;
        });

        return;
      }
      setMonth((current) => current + 1);
      return;
    }

    if (month === 1) {
      setMonth(12);
      setYear((current) => {
        if (current <= yearMin) {
          return current;
        }
        return current - 1;
      });

      return;
    }

    setMonth((current) => current - 1);
  };

  const yearText = (offset: number) => {
    const targetYear = year + offset;

    if (targetYear < yearMin || targetYear > yearMax) {
      return null;
    }

    return String(targetYear);
  };

  const monthText = (offset: number) => {
    return pad(wrapMonth(month + offset));
  };

  const reset = () => {
    setYear(currentYear);
    setMonth(currentMonth);
  };

  const handlePrint = async () => {
    if (isPrinting) return;
    setIsPrinting(true);
    try {
      await onPrint(year, month);
    } finally {
      setIsPrinting(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <Overlay
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Modal
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-date-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <CloseBtn type="button" aria-label="닫기" onClick={onClose}>
          <img src={CloseButton} />
        </CloseBtn>

        <Title id="print-date-modal-title">출력 날짜 설정</Title>

        <Pickers>
          <WheelColumn
            label="년"
            listWidth={160}
            getText={yearText}
            onStep={stepYear}
          />

          <WheelColumn
            label="월"
            listWidth={72}
            getText={monthText}
            onStep={stepMonth}
          />
        </Pickers>

        <Actions>
          <ResetButton type="button" onClick={reset}>
            <img src={Reset} alt="초기화" />
          </ResetButton>

          <PrintButton
            type="button"
            disabled={isPrinting}
            onClick={handlePrint}
          >
            신청자 월별 액셀 출력
          </PrintButton>
        </Actions>
      </Modal>
    </Overlay>
  );
}

const colors = {
  bg: "#ffffff",
  fg: "#000000",
  sub: "#828282",
  faint: "#e0e0e0",
  chevron: "#bdbdbd",
  unit: "#333333",
  button: "#444f61",
  line: "#444f61",
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.42);
`;

const Modal = styled.main`
  position: relative;
  width: 900px;
  height: 560px;
  box-sizing: border-box;
  padding: 58px 48px 62px;
  background: ${colors.bg};
  border-radius: 12px;
  box-shadow:
    0 12px 35px rgba(0, 0, 0, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.08);

  color: ${colors.fg};

  font-family:
    "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic",
    sans-serif;
  text-align: center;

  @media (max-width: 950px) {
    width: calc(100vw - 48px);
  }

  @media (max-height: 650px) {
    height: calc(100vh - 48px);
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: #000000;
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${colors.line};
    outline-offset: 2px;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  line-height: 38px;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

const Pickers = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  margin-top: 45px;
`;

const Column = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WheelArea = styled.div`
  display: flex;
  align-items: center;
`;

const List = styled.div<{
  listWidth: number;
}>`
  position: relative;
  width: ${({ listWidth }) => listWidth}px;
  height: 208px;
  flex: none;
  overflow: hidden;
  user-select: none;
  touch-action: none;
  cursor: ns-resize;
`;

const itemStyle = (offset: number) => {
  switch (offset) {
    case 0:
      return {
        size: "64px",
        color: colors.fg,
        weight: 600,
        y: 0,
      };
    case 1:
      return {
        size: "32px",
        color: colors.sub,
        weight: 700,
        y: -62,
      };

    case -1:
      return {
        size: "32px",
        color: colors.sub,
        weight: 700,
        y: 62,
      };

    case -2:
      return {
        size: "20px",
        color: colors.faint,
        weight: 700,
        y: 97,
      };

    default:
      return {
        size: "20px",
        color: colors.faint,
        weight: 700,
        y: -97,
      };
  }
};

const Item = styled.div<{
  offset: number;
  hidden?: boolean;
}>`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 64px;
  margin-top: -32px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  cursor: ${({ offset }) => (offset === 0 ? "default" : "pointer")};
  transition:
    transform 0.18s ease,
    opacity 0.18s ease,
    font-size 0.18s ease,
    color 0.18s ease;

  ${({ offset, hidden }) => {
    const style = itemStyle(offset);
    return `
      font-size: ${style.size};
      font-weight: ${style.weight};
      color: ${style.color};
      transform: translateY(${style.y}px);
      opacity: ${hidden ? 0 : 1};
      pointer-events: ${hidden ? "none" : "auto"};
    `;
  }}
`;

const Arrows = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 24px;
  margin-left: 8px;
`;

const ArrowButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: none;
  color: ${colors.chevron};
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
  &:hover {
    color: ${colors.sub};
  }
  &:focus-visible {
    outline: 2px solid ${colors.line};
    outline-offset: -2px;
  }
`;

const Unit = styled.span`
  width: 20px;
  margin-left: 10px;
  font-size: 20px;
  line-height: 1;
  text-align: left;
  white-space: nowrap;
  color: ${colors.unit};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 70px;
`;

const ResetButton = styled.button`
  width: 80px;
  height: 80px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 2px solid ${colors.line};
  border-radius: 12px;
  background: #ffffff;
  color: #000000;
  cursor: pointer;
  svg {
    width: 30px;
    height: 30px;
    fill: currentColor;
  }
  &:hover {
    background: #f7f8fa;
  }
  &:active {
    transform: scale(0.98);
  }
  &:focus-visible {
    outline: 2px solid ${colors.line};
    outline-offset: 2px;
  }
`;

const PrintButton = styled.button`
  width: 340px;
  height: 80px;
  border: 0;
  border-radius: 12px;
  background: ${colors.button};
  color: #ffffff;
  font: inherit;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -0.02em;
  cursor: pointer;
  &:hover {
    filter: brightness(1.05);
  }
  &:active {
    transform: scale(0.98);
  }
  &:focus-visible {
    outline: 2px solid ${colors.line};
    outline-offset: 1px;
  }
`;
