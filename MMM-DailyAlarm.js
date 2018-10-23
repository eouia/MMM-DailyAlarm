Module.register("MMM-DailyAlarm", {
  defaults: {
    refreshInterval: 1000,
    alarms: [
    ],
    defaultAlarm: {
      time: "",
      showAt: "00:00:00",
      hideAt: "23:59:59",
      exceptDays: [], // [] for all days, available values : MON, TUE, WED, THU, FRI, SAT, SUN
      customClass: "", //If you want to set custom CSS class to this event.
      beforeText: "Alarm",
      afterText: "", //If omitted or null or "", `beforeText` will be used after time.
      alarmSound: "", //path for alarm sound,
      humanize: false,
      alarmNotification: {
        notification: null,
        payload: {}
      }
    }
  },

  getStyles: function() {
    return ["MMM-DailyAlarm.css"]
  },

  getScripts: function() {
    return ["moment.js"]
  },

  start: function() {
    this.events = []
    this.updateTimestamp = null
    this.prepareAllEvents()

  },

  prepareAllEvents: function() {
    for (i in this.config.alarms) {
      this.prepareEvent(i, this.config.alarms[i])
    }
    this.updateTimestamp = moment().format("YYYY-MM-DD")
  },

  prepareEvent: function(index, ev) {
    var now = new moment()
    var today = now.format("YYYY-MM-DD")
    var tDay = now.isoWeekday()
    var event = Object.assign({}, this.config.defaultAlarm, ev)
    var s = moment(today + " " + event.showAt)
    var h = moment(today + " " + event.hideAt)
    var t = moment(today + " " + event.time)
    if (h.isBefore(s)) {
      h.add(1, "day")
    }
    if (t.isBefore(s)) {
      t.add(1, "day")
    }
    event.id = index
    event.time = t
    event.showAt = s
    event.hideAt = h
    event.passed = (now.isAfter(t)) ? true : false
    this.events[i] = event
  },

  getDom: function() {
    var wrapper = document.createElement("div")
    wrapper.id = "DAILYALARM_WRAPPER"
    var da = document.createElement("div")
    da.id = "DAILYALARM"
    var audio = document.createElement("audio")
    audio.id = "DA_AUDIO"
    wrapper.appendChild(da)
    wrapper.appendChild(audio)
    return wrapper
  },

  notificationReceived: function(noti, payload, sender) {
    switch(noti) {
      case "DOM_OBJECTS_CREATED":
        this.refresh()
        break
    }
  },

  refresh: function() {
    this.drawAll()
    if (this.updateTimestamp !== moment().format("YYYY-MM-DD")) {
      this.prepareAllEvents()
    }
    setTimeout(()=>{
      this.refresh()
    }, this.config.refreshInterval)
  },

  drawAll: function() {
    var wrapper = document.getElementById("DAILYALARM")
    wrapper.innerHTML = ""
    for (i in this.events) {
      this.draw(this.events[i])
    }
  },

  draw: function(ev) {
    const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    var now = new moment()
    var isVisible = (now.isAfter(ev.showAt) && now.isBefore(ev.hideAt))
    var isExcept = ev.exceptDays.includes(DAYS[ev.time.isoWeekday()])
    var isPassed = now.isAfter(ev.time)
    if (!isExcept) {
      if (isVisible) {
        var event = document.createElement("div")
        event.className = ev.customClass
        var text = document.createElement("div")
        text.className = "text"
        var time = document.createElement("div")
        time.className = "time"
        var diff = null
        if (isPassed) {
          event.className += " after"
          text.innerHTML = (ev.afterText) ? ev.afterText : ev.beforeText
          diff = now.diff(ev.time)
        } else {
          event.className += " before"
          text.innerHTML = ev.beforeText
          diff = ev.time.diff(now)
        }

        if (ev.humanize) {
          diff = ev.time.diff(now)
          var duration = moment.duration(diff)
          time.innerHTML = duration.humanize(true)
          time.className += " humanized"
        } else {

          time.innerHTML = moment.utc(diff).format("HH:mm:ss")
        }
        event.appendChild(text)
        event.appendChild(time)
        var wrapper = document.getElementById("DAILYALARM")
        wrapper.appendChild(event)
      }
      if (!ev.passed) {
        if (isPassed) {
          ev.passed = true
          if (ev.alarmNotification.notification) {
            var payload = ev.alarmNotification.payload
            this.sendNotification(ev.alarmNotification.notification, payload)
          }
          if (ev.alarmSound) {
            var audio = document.getElementById("DA_AUDIO")
            audio.src = "/modules/MMM-DailyAlarm/resources/" + ev.alarmSound
            audio.play()
          }
        }
      }
    }
  },

})
