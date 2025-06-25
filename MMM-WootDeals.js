Module.register("MMM-WootDeals", {
  defaults: {
    apiKey: "",
    updateInterval: 60 * 60 * 1000, // Update every hour
    numRows: 1, // Number of rows to display
    numColumns: 1, // Number of columns to display
    pageCycleInterval: 20 * 1000, // Cycle pages every 10 seconds (new)
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

    // Start page cycling timer
    this.startPageCycle()
  },

  suspend() {
    // Clear the interval when the module is suspended
    if (this.updateIntervalID) {
      clearInterval(this.updateIntervalID)
      this.updateIntervalID = null
    }
    if (this.pageCycleIntervalID) {
      clearInterval(this.pageCycleIntervalID)
      this.pageCycleIntervalID = null
    }
  },

  resume() {
    // Restart the interval when the module is resumed
    if (!this.updateIntervalID) {
      this.updateIntervalID = setInterval(() => this.sendSocketNotification("GET_WOOT_OFFERS", this.config), this.config.updateInterval)
      this.sendSocketNotification("GET_WOOT_OFFERS", this.config)
    }
    if (!this.pageCycleIntervalID) {
      this.startPageCycle()
    }
  },

  startPageCycle() {
    if (this.pageCycleIntervalID) {
      clearInterval(this.pageCycleIntervalID)
    }
    this.pageCycleIntervalID = setInterval(() => {
      if (!this.offers || this.offers.length === 0) return
      const totalPages = Math.ceil(this.offers.length / this.itemsPerPage)
      this.currentPage = (this.currentPage + 1) % totalPages
      this.updateDom()
    }, this.config.pageCycleInterval)
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
      if (!payload || !Array.isArray(payload)) {
        Log.error("MMM-WootDeals: Invalid payload received for Woot offers.")
        return
      }

      Log.info("MMM-WootDeals: Received Woot offers:", payload)
      this.filterDeals(payload)
      this.updateDom()
    }
  },
  getStyles() {
    return ["MMM-WootDeals.css"]
  },
  filterDeals(offers) {
    if (!offers || !Array.isArray(offers)) {
      return []
    }

    // Filter out offers that are not available or have no image
    this.offers = offers.filter(offer => offer.IsFeatured === true && offer.IsSoldOut === false && offer.Photo != "")
    // Reset to first page and restart cycling when new offers arrive
    this.currentPage = 0
    this.startPageCycle()
  },

  /**
   * Render the page we're on.
   */
  getDom() {
    const wrapper = document.createElement("div")
    wrapper.className = "wootdeals-wrapper"
    if (!this.offers.length) {
      wrapper.innerHTML = "Loading Woot offers..."
      wrapper.classList.add("wootdeals-loading")
      return wrapper
    }

    // Calculate which offers to show
    const startIdx = this.currentPage * this.itemsPerPage
    const endIdx = startIdx + this.itemsPerPage
    const pageOffers = this.offers.slice(startIdx, endIdx)

    // Create a table for grid layout
    const table = document.createElement("table")
    table.className = "wootdeals-table"
    let row
    pageOffers.forEach((offer, idx) => {
      if (idx % this.config.numColumns === 0) {
        row = document.createElement("tr")
        row.className = "wootdeals-row"
        table.appendChild(row)
      }
      const cell = document.createElement("td")
      cell.className = "wootdeals-cell"
      cell.innerHTML = `
        <img src="${offer.Photo}" class="wootdeals-image"/><br>
        <b class="wootdeals-title">${offer.Title}</b>
      `
      row.appendChild(cell)
    })
    wrapper.appendChild(table)

    // Add page indicator (dots or text)
    const totalPages = Math.ceil(this.offers.length / this.itemsPerPage)
    if (totalPages > 1) {
      const pageIndicator = document.createElement("div")
      pageIndicator.className = "wootdeals-page-indicator"
      if (totalPages <= 10) {
        // Dots indicator
        for (let i = 0; i < totalPages; i++) {
          const dot = document.createElement("span")
          dot.className = "wootdeals-page-dot" + (i === this.currentPage ? " wootdeals-page-dot-active" : "")
          pageIndicator.appendChild(dot)
        }
      } else {
        // Fallback to text indicator
        pageIndicator.innerText = `Page ${this.currentPage + 1} of ${totalPages}`
      }
      wrapper.appendChild(pageIndicator)
    }

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
