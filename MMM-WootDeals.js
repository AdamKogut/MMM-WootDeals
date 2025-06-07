Module.register("MMM-WootDeals", {
  defaults: {
    apiKey: "",
    updateInterval: 60 * 60 * 1000, // Update every hour
  },

  /**
   * Apply the default styles.
   */
  getStyles() {
    return ["wootdeals.css"]
  },

  /**
   * Pseudo-constructor for our module. Initialize stuff here.
   */
  start() {
    this.offers = []

    if (this.config.apiKey === "") {
      Log.error("MMM-WootDeals: Please set your API key in the config.")
      return
    }

    // to display "Loading..." at start-up
    this.title = "Loading..."
    this.loaded = false

    // set timeout for next random text
    this.updateIntervalID = setInterval(() => this.sendSocketNotification("GET_WOOT_OFFERS", this.config), this.config.updateInterval)
    this.sendSocketNotification("GET_WOOT_OFFERS", this.config)
  },

  suspend() {
    // Clear the interval when the module is suspended
    if (this.updateIntervalID) {
      clearInterval(this.updateIntervalID)
      this.updateIntervalID = null
    }
  },

  resume() {
    // Restart the interval when the module is resumed
    if (!this.updateIntervalID) {
      this.updateIntervalID = setInterval(() => this.sendSocketNotification("GET_WOOT_OFFERS", this.config), this.config.updateInterval)
      this.sendSocketNotification("GET_WOOT_OFFERS", this.config)
    }
  },

  /**
   * Handle notifications received by the node helper.
   * So we can communicate between the node helper and the module.
   *
   * @param {string} notification - The notification identifier.
   * @param {any} payload - The payload data`returned by the node helper.
   */
  socketNotificationReceived: function (notification, payload) {
    if (notification === "WOOT_OFFERS") {
      this.offers = payload
      this.updateDom()
    }
  },

  /**
   * Render the page we're on.
   */
  getDom() {
    const wrapper = document.createElement("div")
    if (!this.offers.length) {
      wrapper.innerHTML = "Loading Woot offers..."
      return wrapper
    }
    this.offers.forEach((offer) => {
      const offerDiv = document.createElement("div")
      offerDiv.innerHTML = `
        <img src="${offer.ImageUrl}" style="max-width:100px;"><br>
        <b>${offer.Title}</b>
      `
      wrapper.appendChild(offerDiv)
    })
    return wrapper
  },

  /**
   * This is the place to receive notifications from other modules or the system.
   *
   * @param {string} notification The notification ID, it is preferred that it prefixes your module name
   * @param {number} payload the payload type.
   */
  notificationReceived(notification, payload) {
    
  }
})
