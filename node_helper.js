const NodeHelper = require("node_helper")
const fetch = require("node-fetch")

module.exports = NodeHelper.create({
  start() {
    console.log("Starting node helper for MMM-WootDeals")
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "GET_WOOT_OFFERS") {
      this.config = payload
      this.getWootOffers()
    }
  },

  async getWootOffers() {
    try {
      const response = await fetch("https://developer.woot.com/feed/Featured", {
        headers: { "x-api-key": this.config.apiKey }
      })
      const data = await response.json()
      // Assume offers are in data.Offers or similar
      this.sendSocketNotification("WOOT_OFFERS", data.Offers || [])
    } catch (err) {
      console.error("Error fetching Woot offers:", err)
      this.sendSocketNotification("WOOT_OFFERS", [])
    }
  }
})
