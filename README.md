# MMM-DailyAlarm
MagicMirror module for daily recurrent event alarms

## Screenshot

## Features
- Showing time remained & passed for daily recurrent events
- Exception rule by day available
- beforeText / afterText
- Showing & hiding by defined time
- Alarm sound playable
- Notification enable
- Custom CSS for each event.
- At 00AM of each day, events will be refreshed.

## Installation
```
cd ~/MagicMirror/modules
git clone https://github.com/eouia/MMM-DailyAlarm
```

## Configuration
### Simple
```
{
  module: "MMM-DailyAlarm",
  position:"top_right",
  config: {
    alarms: [
      {
        time: "20", //REQUIRED
        beforeText: "Time to Bed",
      },
    ],
  }
},
```
### Detailed
```
{
  module: "MMM-DailyAlarm",
  position:"top_right",
  config: {
    alarms: [
      {
        time: "12:00:00", // ISO8601 time format strings are supported.
        customClass: "myClass", //If you want, you can assign your custom CSS className to this event.
        beforeText: "Lunch Time", // This will be displayed before time
        afterText: "After Lunch", // This will be displayed after time. If omitted, `beforeText` will be displayed.
        alarmSound: "beeps.mp3" //If you want, you can play sound for alarm. Put a sound file into `resources` directory.
      },
      {
        time: "18:00:00",
        showAt: "12:00", // You can control showing/hiding of this event with this fields.
        hideAt: "18:30",
        exceptDays: ["SUN", "SAT"], // You can except this event on specific day.
        //available values : array of "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"
        beforeText: "Go Home",
        afterText: "I'm going home",
        humanize:true, //If set as true, remain/past time is written as human-readable.
        alarmNotification: { //You can send notification also.
          notification: "SHOW_ALERT",
          payload: {
            message: "I'm going home!!!",
          }
        }
      },
    ],
  }
},
```

### WARNING
not yet tested enough.
