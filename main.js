import { useMap, useGame } from "@owlbear-rodeo/sdk"

const map = useMap()
const game = useGame()
let tapCounter = 0
let tapTimeout

function showInventoryOverlay(items = []) {
  removeOverlay()
  const overlay = document.createElement("div")
  overlay.className = "inventory-overlay"

  if (items.length === 0) {
    overlay.innerHTML = "<i>No inventory found for this token</i>"
  } else {
    items.forEach(item => {
      const entry = document.createElement("div")
      entry.textContent = `• ${item.name} x${item.quantity}`
      overlay.appendChild(entry)
    })
  }

  document.body.appendChild(overlay)
}

function removeOverlay() {
  const old = document.querySelector(".inventory-overlay")
  if (old) old.remove()
}

function getInventory(tokenId) {
  const store = game.getState("inventoryData") || {}
  return store[tokenId] || []
}

function onTokenClick(tokenId) {
  tapCounter++
  clearTimeout(tapTimeout)
  tapTimeout = setTimeout(() => { tapCounter = 0 }, 400)

  if (tapCounter === 3) {
    tapCounter = 0
    showInventoryOverlay(getInventory(tokenId))
  }
}

map.on("ready", () => {
  map.getTokens().forEach(token => {
    const el = document.querySelector(`[data-token-id="${token.id}"]`)
    if (el) {
      el.addEventListener("click", () => onTokenClick(token.id))
    }
  })
})

// Demo seed data
game.setState("inventoryData", {
  "token-1": [
    { name: "Longsword", quantity: 1 },
    { name: "Potion", quantity: 3 }
  ],
  "mount-3": [
    { name: "Saddlebag", quantity: 1 },
    { name: "Rations", quantity: 5 }
  ]
})
