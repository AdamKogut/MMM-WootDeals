const NodeHelper = require("node_helper")
const Log = require("logger");
const request = require("request");

module.exports = NodeHelper.create({
  start() {
    Log.info("Starting node helper for MMM-WootDeals")
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "GET_WOOT_OFFERS") {
      this.config = payload
      this.getWootOffers()
    }
  },

  async getWootOffers() {
    try {
      request({
        url: "https://developer.woot.com/feed/Featured",
        headers: { "x-api-key": this.config.apiKey }
      }, (error, response, body) => {
        if (error) {
          Log.error("Error fetching Woot offers:", error)
          this.sendSocketNotification("WOOT_OFFERS", [])
          return
        }

        if (response.statusCode !== 200) {
          Log.error("Failed to fetch Woot offers, status code:", response.statusCode)
          this.sendSocketNotification("WOOT_OFFERS", [])
          return
        }

        let data
        try {
          data = JSON.parse(body)
          // Log.info("Fetched Woot offers successfully:", data)
        } catch (parseError) {
          Log.error("Error parsing Woot offers response:", parseError)
          this.sendSocketNotification("WOOT_OFFERS", [])
          return
        }

        if (data.MarketingName !== "Featured Deals") {
          Log.warn("Unexpected response from Woot API, MarketingName is not 'Featured Deals', retrying in 10 seconds...")
          setTimeout(() => this.getWootOffers(), 10000)
          return
        }

        // Assume offers are in data.Offers or similar
        const featuredOffers = data.Items.filter(offer => offer.IsFeatured === true) || []
        if (featuredOffers.length === 0) {
          Log.warn("No featured Woot offers found, retrying in 10 seconds...")
          setTimeout(() => this.getWootOffers(), 10000)
          return
        }
        this.sendSocketNotification("WOOT_OFFERS", featuredOffers)
      })
    } catch (err) {
      Log.error("Error fetching Woot offers:", err)
      this.sendSocketNotification("WOOT_OFFERS", [])
    }
  }
})
