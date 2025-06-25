Module.register("MMM-WootDeals", {
  defaults: {
    apiKey: "",
    updateInterval: 60 * 60 * 1000, // Update every hour
    numRows: 1, // Number of rows to display
    numColumns: 1, // Number of columns to display
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

    if (this.config.numRows < 1 || this.config.numColumns < 1) {
      Log.error("MMM-WootDeals: numRows and numColumns must be at least 1.")
      return
    }

    // to display "Loading..." at start-up
    this.title = "Loading..."
    this.loaded = false
    this.itemsPerPage = this.config.numRows * this.config.numColumns
    this.currentPage = 0

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
      this.filterDeals(payload)
      this.updateDom()
    }
  },

  filterDeals(offers) {
    if (!offers || !Array.isArray(offers)) {
      return []
    }

    // Filter out offers that are not available or have no image
    this.offers = offers.filter(offer => offer.IsSoldOut === false && offer.Photo != "")
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

    // Calculate which offers to show
    const startIdx = this.currentPage * this.itemsPerPage
    const endIdx = startIdx + this.itemsPerPage
    const pageOffers = this.offers.slice(startIdx, endIdx)

    // Create a table for grid layout
    const table = document.createElement("table")
    let row
    pageOffers.forEach((offer, idx) => {
      if (idx % this.config.numColumns === 0) {
        row = document.createElement("tr")
        table.appendChild(row)
      }
      const cell = document.createElement("td")
      cell.innerHTML = `
        <img src="${offer.ImageUrl}" style="max-width:100px;"><br>
        <b>${offer.Title}</b>
      `
      row.appendChild(cell)
    })
    wrapper.appendChild(table)
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
