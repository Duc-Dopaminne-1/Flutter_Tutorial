import React from "react";
import DropdownNative, { ObjDropdown } from "@src/components/Dropdown/DropdownNative";
import styles from "./styles";
import TableCalendar from "./TableCalendar";

const listMonth: ObjDropdown[] = [
  { _key: "2020-07-27", _value: "27th - 2nd July, 2020" },
  { _key: "2020-08-03", _value: "3rd - 9th August, 2020" },
  { _key: "2020-08-10", _value: "10th - 16th August, 2020" },
];

const CalendarByWeek = () => {

  return (
    <>
      <DropdownNative
        arrData={listMonth}
        containerStyle={styles.timeFilterContainer}
        selected={0}
        isShowAccessory={true}
        onChangeDropDown={obj => { }}
        linearGradientColors={['transparent', 'transparent']}
        textStyle={styles.timeFilterText}
        iconRightStyle={styles.arrowStyle}
        buttonContainer={styles.buttonContainer}
        isHideTitle={true}
      />
      <TableCalendar />
  </>
  );
};

export default CalendarByWeek;
