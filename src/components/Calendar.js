import React, { useState, useContext } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { EventContext } from "../context/EventContext";
import EventModal from "./EventModal";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { events } = useContext(EventContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const onDateClick = (day) => {
    setSelectedDate(day);
    setShowModal(true);
  };

  const handleClose = () =>{
    setShowModal(false);
    setSelectedDate(null);
  };

  const renderHeader = () => (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <button
        className="btn btn-outline-primary"
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
      >
        &lt;
      </button>
      <h4 className="mb-0">{format(currentMonth, "MMMM yyyy")}</h4>
      <button
        className="btn btn-outline-primary"
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
      >
        &gt;
      </button>
    </div>
  );

  // Fixed renderDays without undefined variables
  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="row text-center fw-bold">
        {days.map((day) => (
          <div className="col border p-2" key={day}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        const dayEvents = events.filter((e) =>
          isSameDay(new Date(e.date), cloneDay)
        );

        days.push(
          <div
            className={`col border p-2 ${
              !isSameMonth(day, monthStart) ? "bg-light text-muted" : ""
            } ${isSameDay(day, new Date()) ? "bg-info text-white" : ""}`}
            key={day}
            onClick={() => onDateClick(day)}
            style={{ cursor: "pointer" }}
          >
            <div className="small fw-bold">{formattedDate}</div>
            {dayEvents.map((event, i) => (
              <div key={i} className="badge bg-primary mt-1 text-wrap w-100">
                {event.title}
              </div>
            ))}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    const onDateClick = (day) => {
  console.log("Date clicked:", day);
  setSelectedDate(day);
  setShowModal(true);
};
    return <div>{rows}</div>;
  };

  return (
    <div className="container">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {showModal && (
        <EventModal
          selectedDate={selectedDate}
          onClose={handleClose}
          // Add other props you need to pass
        />
      )}
    </div>
  );
};

export default Calendar;
