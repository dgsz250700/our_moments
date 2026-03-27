import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Moment } from '../data/moments';
import { Fonts } from '../theme/fonts';

interface CalendarPanelProps {
  moments: Moment[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function CalendarPanel({ moments }: CalendarPanelProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Build a set of days that have moments, for the current month/year
  const momentDays = new Set<number>();
  moments.forEach((m) => {
    const d = new Date(m.date);
    if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
      momentDays.add(d.getDate());
    }
  });

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const goToPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Build calendar grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d: number) =>
    d === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  return (
    <View style={styles.panel}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPrev} style={styles.navBtn}>
          <Text style={styles.navArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </Text>
        <TouchableOpacity onPress={goToNext} style={styles.navBtn}>
          <Text style={styles.navArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Day-of-week row */}
      <View style={styles.weekRow}>
        {DAY_NAMES.map((d) => (
          <Text key={d} style={styles.dayName}>
            {d}
          </Text>
        ))}
      </View>

      {/* Day grid */}
      <View style={styles.grid}>
        {cells.map((day, idx) => (
          <View key={idx} style={styles.cell}>
            {day !== null && (
              <View
                style={[
                  styles.dayCircle,
                  isToday(day) && styles.todayCircle,
                  momentDays.has(day) && styles.momentDot,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    isToday(day) && styles.todayText,
                    momentDays.has(day) && styles.momentDayText,
                  ]}
                >
                  {day}
                </Text>
                {momentDays.has(day) && <View style={styles.dot} />}
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendDot} />
        <Text style={styles.legendText}>Memory saved on this day</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#fffcf5',
    borderRadius: 12,
    padding: 16,
    margin: 12,
    elevation: 4,
    shadowColor: '#7a6450',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#ede5d8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navBtn: {
    padding: 6,
  },
  navArrow: {
    fontSize: 22,
    color: '#8c7158',
    fontWeight: '300',
  },
  monthLabel: {
    fontSize: 16,
    color: '#5c4030',
    fontFamily: Fonts.headingItalic,
    letterSpacing: 0.3,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    color: '#b09a88',
    letterSpacing: 0.8,
    fontFamily: Fonts.label,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  todayCircle: {
    backgroundColor: '#6e5c47',
  },
  momentDot: {
    // No fill, just marker below
  },
  dayText: {
    fontSize: 13,
    color: '#5c4a3a',
    fontFamily: Fonts.body,
  },
  todayText: {
    color: '#fff',
    fontFamily: Fonts.label,
  },
  momentDayText: {
    fontFamily: Fonts.label,
    color: '#c0845a',
  },
  dot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#c0845a',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    opacity: 0.7,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#c0845a',
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    color: '#9a8878',
    fontFamily: Fonts.bodyItalic,
  },
});
