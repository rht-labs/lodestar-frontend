import {
  ToggleGroup,
  ToggleGroupItem,
  ToggleGroupVariant,
} from '@patternfly/react-core';
import {
  addQuarters,
  eachQuarterOfInterval,
  endOfQuarter,
  getQuarter,
  startOfQuarter,
  sub,
  subQuarters,
  subYears,
} from 'date-fns';
import React, { useState } from 'react';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface DateWindowSelectorProps {
  onSelectWindow?(dates?: DateRange): void;
}

enum DateWindows {
  OneWeek,
  OneMonth,
  ThreeMonths,
  SixMonths,
  OneYear,
  AllTime,
  Q1,
  Q2,
  Q3,
  Q4,
}

const lastDayOfLastQuarter = endOfQuarter(subQuarters(new Date(), 1));
const quarters = eachQuarterOfInterval({
  end: lastDayOfLastQuarter,
  start: startOfQuarter(addQuarters(subYears(lastDayOfLastQuarter, 1), 1)),
}).reverse();

export const DateWindowSelector = ({
  onSelectWindow = () => {},
}: DateWindowSelectorProps) => {
  const [selectedRange, setSelectedRange] = useState<DateWindows>(
    DateWindows.AllTime
  );
  const handleClick = (dateWindow: DateWindows) => () => {
    setSelectedRange(dateWindow);
    switch (dateWindow) {
      case DateWindows.OneWeek:
        onSelectWindow({
          startDate: sub(new Date(Date.now()), { weeks: 1 }),
          endDate: new Date(Date.now()),
        });
        break;
      case DateWindows.OneMonth:
        onSelectWindow({
          startDate: sub(new Date(Date.now()), { months: 1 }),
          endDate: new Date(Date.now()),
        });
        break;
      case DateWindows.ThreeMonths:
        onSelectWindow({
          startDate: sub(new Date(Date.now()), { months: 3 }),
          endDate: new Date(Date.now()),
        });
        break;
      case DateWindows.SixMonths:
        onSelectWindow({
          startDate: sub(new Date(Date.now()), { months: 6 }),
          endDate: new Date(Date.now()),
        });
        break;
      case DateWindows.OneYear:
        onSelectWindow({
          startDate: sub(new Date(Date.now()), { years: 1 }),
          endDate: new Date(Date.now()),
        });
        break;
      case DateWindows.AllTime:
        onSelectWindow();
        break;
      default:
        const quarterSelection = quarters.find(
          q => `Q${getQuarter(q)}` === DateWindows[dateWindow]
        );
        if (!!quarterSelection) {
          onSelectWindow({
            startDate: startOfQuarter(quarterSelection),
            endDate: endOfQuarter(quarterSelection),
          });
        }
    }
  };
  return (
    <div>
      <ToggleGroup variant={ToggleGroupVariant.light}>
        <ToggleGroupItem
          text="1w"
          key={'1w'}
          data-testid="1w-window"
          onChange={handleClick(DateWindows.OneWeek)}
          isSelected={selectedRange === DateWindows.OneWeek}
        ></ToggleGroupItem>
        <ToggleGroupItem
          text="1m"
          key={'1m'}
          data-testid="1m-window"
          onChange={handleClick(DateWindows.OneMonth)}
          isSelected={selectedRange === DateWindows.OneMonth}
        ></ToggleGroupItem>
        <ToggleGroupItem
          text="3m"
          key={'3m'}
          data-testid="3m-window"
          onChange={handleClick(DateWindows.ThreeMonths)}
          isSelected={selectedRange === DateWindows.ThreeMonths}
        ></ToggleGroupItem>
        <ToggleGroupItem
          text="6m"
          key={'6m'}
          data-testid="6m-window"
          onChange={handleClick(DateWindows.SixMonths)}
          isSelected={selectedRange === DateWindows.SixMonths}
        ></ToggleGroupItem>
        <ToggleGroupItem
          text="1y"
          key={'1y'}
          data-testid="1y-window"
          onChange={handleClick(DateWindows.OneYear)}
          isSelected={selectedRange === DateWindows.OneYear}
        ></ToggleGroupItem>
        {quarters.map(q => {
          const quarter = getQuarter(q);
          return (
            <ToggleGroupItem
              text={`Q${quarter}'${q.getFullYear() - 2000}`} //"Q1'21"
              key={'q' + quarter.toString()}
              data-testid={'q' + quarter.toString()}
              onChange={handleClick(DateWindows['Q' + quarter.toString()])}
              isSelected={
                selectedRange === DateWindows['Q' + quarter.toString()]
              }
            ></ToggleGroupItem>
          );
        })}
        <ToggleGroupItem
          text="All Time"
          key={'alltime'}
          data-testid="alltime-window"
          onChange={handleClick(DateWindows.AllTime)}
          isSelected={selectedRange === DateWindows.AllTime}
        ></ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
